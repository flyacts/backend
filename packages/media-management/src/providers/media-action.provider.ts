/*!
 * @copyright FLYACTS GmbH 2020
 */

import * as sharp from 'sharp';
import { Service } from 'typedi';

import { ResizeActionOptions } from '../configuration/media-action.options';
import { MediaVariantConfiguration } from '../configuration/media-variant.configuration';
import { FileEntity } from '../entities/file.entity';
import { MediaActionNotAvailableError } from '../errors/media-action-not-available.error';

import { FileStorageProvider, StoredFile } from './file-storage.provider';

/**
 * Handles variant actions for media.
 */
@Service()
export class MediaActionProvider {

    public constructor(
        private fileStorageProvider: FileStorageProvider,
    ) {}

    /**
     * handle variant actions for media
     */
    public async handleVariants(rawFile: FileEntity, variants: MediaVariantConfiguration[]) {
        const processedFiles: Array<StoredFile & { variant: string }> = [];
        for (const variant of variants) {
            for (const { type, options } of variant.actions) {
                if (type === 'resize') {
                    const resizedFile = await this.resizeImage(rawFile, options);
                    processedFiles.push({
                        ...resizedFile,
                        variant: variant.name,
                    });
                }
                else {
                    throw new MediaActionNotAvailableError(`Media action ${type} is not available`);
                }
            }
        }
        return processedFiles;
    }

    /**
     * Resize an image
     */
    private async resizeImage(rawFile: FileEntity, { width, height }: ResizeActionOptions): Promise<StoredFile> {
        const readStream = this.fileStorageProvider.getFileStream(rawFile.hash);
        const resizer = sharp()
            .resize(width, height)
            .png();

        return this.fileStorageProvider.storeFile(readStream.pipe(resizer));
    }
}
