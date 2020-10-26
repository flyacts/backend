/*!
 * @copyright FLYACTS GmbH 2020
 */

import * as fileType from 'file-type';
import readChunk from 'read-chunk';
import { Readable } from 'stream';
import { Service } from 'typedi';

import { MediaConfiguration } from '../configuration/media.configuration';
import { BlobStore } from '../helpers/blob-store-wrapper';

export interface StoredFile {
    hash: string;
    contentType: string;
    size: number;
}

/**
 * A service for storing files.
 */
@Service()
export class FileStorageProvider {
    /**
     * The internal file storage
     */
    private storage: BlobStore;

    public constructor(
        private configuration: MediaConfiguration,
    ) {
        this.storage = new BlobStore(
            this.configuration.location,
            this.configuration.tempDir,
        );
    }

    /**
     * Store a file
     */
    public async storeFile(fileStream: Readable): Promise<StoredFile> {
        const writeStream = this.storage.createWriteStream();
        fileStream.pipe(writeStream);

        const hash = await (new Promise<string>((resolve, reject) => {
            writeStream.on('error', (err: unknown) => {
                reject(err);
            });

            writeStream.on('finish', () => {
                resolve(writeStream.key);
            });
        }));
        const filePath = await this.storage.resolve({ key: hash });
        const size = filePath.stat.size;
        const fileContents = await readChunk(filePath.path, 0, fileType.minimumBytes);
        const contentType = fileType(fileContents)?.mime ?? 'application/octet-stream';
        return {
            contentType,
            hash,
            size,
        };
    }

    /**
     * Get a read stream for a file by hash
     */
    public getFileStream(fileHash: string): Readable {
        return this.storage.createReadStream({ key: fileHash });
    }

    /**
     * Check if a file with a certain hash exits
     */
    public async fileExists(fileHash: string) {
        return this.storage.exists({ key: fileHash });
    }

    /**
     * Delete a file by hash
     */
    public async deleteFile(fileHash: string) {
        return this.storage.delete({ key: fileHash });
    }
}
