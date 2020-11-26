/*!
 * @copyright FLYACTS GmbH 2020
 */

import { uuid } from '@flyacts/backend-core-entities';
import { plainToClass } from 'class-transformer';
import { Readable, Stream } from 'stream';
import { Service } from 'typedi';
import { Connection, EntityManager, QueryRunner } from 'typeorm';

import { MediaConfiguration } from '../configuration/media.configuration';
import { FileEntity } from '../entities/file.entity';
import { MediaEntity } from '../entities/media.entity';
import { FileNotFoundError } from '../errors/file-not-found.error';
import { InvalidFileInputError } from '../errors/invalid-file-input.error';

import { FileStorageProvider } from './file-storage.provider';
import { MediaActionProvider } from './media-action.provider';

type IdIsh = {
    /**
     * ID of an entity
     */
    id?: uuid;
};

/**
 * Services that helps you to upload files to a media
 */
@Service()
export class FileUploadProvider {
    /**
     * The variant that contains the original file
     */
    public static readonly rawVariant = 'raw';

    public constructor(
        private connection: Connection,
        private mediaActionProvider: MediaActionProvider,
        private fileStorageProvider: FileStorageProvider,
        private mediaConfiguration: MediaConfiguration,
    ) {}

    /**
     * Attach a medium to an entity
     */
    public async attachFile(
        collection: string,
        entity: IdIsh | undefined,
        file: Stream | Buffer | unknown,
        name?: string,
        transactionManager?: EntityManager,
    ): Promise<MediaEntity> {
        if (!(typeof entity === 'object' && typeof entity.id === 'string')) {
            throw new Error('Entity has no ID');
        }

        let entityManager: EntityManager;
        let existingTransaction = false;
        const queryRunner = this.connection.createQueryRunner();

        if (transactionManager instanceof EntityManager) {
            entityManager = transactionManager;
            existingTransaction = true;
        } else {
            await queryRunner.startTransaction();
            entityManager = queryRunner.manager;
        }

        try {
            const medium = new MediaEntity();
            medium.collection = collection;
            medium.model = entity.constructor.name;
            medium.modelId = entity.id;
            medium.name = name;
            medium.files = [];
            await entityManager.save(medium);

            const fileStream = this.getReadStreamFromFileInput(file);
            const storedFile = await this.fileStorageProvider.storeFile(
                fileStream,
            );

            const rawFileEntity = plainToClass(FileEntity, storedFile);
            rawFileEntity.media = medium;
            rawFileEntity.variant = FileUploadProvider.rawVariant;
            medium.files.push(rawFileEntity);

            const variantEntities = await this.handleMediaVariants(
                medium,
                rawFileEntity,
                entity,
                collection,
            );
            medium.files.push(...variantEntities);

            await entityManager.save(medium.files);
            await entityManager.save(medium);

            if (!existingTransaction) {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }

            return medium;
        } catch (error) {
            if (!existingTransaction) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
            throw error;
        }
    }

    /**
     * Create a readstream from a media and variant
     */
    public async getFilestream(medium: MediaEntity, variant?: string) {
        if (!Array.isArray(medium.files)) {
            throw new Error();
        }

        if (typeof variant === 'undefined') {
            variant = FileUploadProvider.rawVariant;
        }

        const file = medium.files
            .filter((item) => item.variant === variant)
            .pop();

        if (typeof file === 'undefined') {
            throw new Error();
        }

        const fileExists = await this.fileStorageProvider.fileExists(file.hash);

        if (!fileExists) {
            throw new FileNotFoundError();
        }

        return this.fileStorageProvider.getFileStream(file.hash);
    }

    /**
     * Remove the medium from the database and check if we can unlink the file
     */
    public async removeMedia(
        medium: MediaEntity,
        transactionManager?: EntityManager,
    ) {
        let entityManager: EntityManager;
        let queryRunner: QueryRunner | null = null;

        if (transactionManager instanceof EntityManager) {
            entityManager = transactionManager;
        } else {
            queryRunner = this.connection.createQueryRunner();
            await queryRunner.startTransaction();
            await queryRunner.connect();
            entityManager = queryRunner.manager;
        }
        try {
            for (const file of medium.files) {
                const fileEntity = await entityManager.findOne(FileEntity, {
                    where: {
                        hash: file.hash,
                    },
                });

                if (fileEntity instanceof FileEntity) {
                    await this.fileStorageProvider.deleteFile(file.hash);
                }

                await entityManager.remove(file);
            }

            await entityManager.remove(medium);

            if (queryRunner !== null) {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }
        } catch (error) {
            if (queryRunner !== null) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
            throw new Error('Deleting media entity failed');
        }
    }

    /**
     * Handles the variant actions for a medium
     */
    private async handleMediaVariants(
        medium: MediaEntity,
        rawFile: FileEntity,
        relatedEntity: IdIsh,
        collection?: string,
    ) {
        const variants = this.getVariantConfigForMedium(
            this.mediaConfiguration,
            relatedEntity,
            collection,
        );
        if (variants.length === 0) {
            return [];
        }
        const storedFileVariants = await this.mediaActionProvider.handleVariants(
            rawFile,
            variants,
        );
        return storedFileVariants.map((variant) => {
            const fileEntity = plainToClass(FileEntity, variant);
            fileEntity.media = medium;
            return fileEntity;
        });
    }

    /**
     * Process the variant config for a medium
     */
    private getVariantConfigForMedium(
        config: MediaConfiguration,
        relatedEntity: IdIsh,
        collection?: string,
    ) {
        for (const type of config.types) {
            const isValidForEntity =
                relatedEntity instanceof type.validForEntity;
            if (
                typeof type.validForCollections === 'undefined' ||
                type.validForCollections.length === 0
            ) {
                return type.variants;
            }
            const isValidForCollection =
                typeof collection === 'string' &&
                type.validForCollections?.includes(collection);
            if (isValidForEntity && isValidForCollection) {
                return type.variants;
            }
        }
        return [];
    }

    /**
     * Transforms possible inputs for the file uploads to a read stream.
     */
    private getReadStreamFromFileInput(fileInput: unknown) {
        if (fileInput instanceof Readable) {
            return fileInput;
        } else if (fileInput instanceof Buffer) {
            return new Readable({
                read() {
                    this.push(fileInput);
                    this.push(null);
                },
            });
        } else if (typeof fileInput === 'string') {
            return new Readable({
                read() {
                    this.push(Buffer.from(fileInput, 'base64'));
                    this.push(null);
                },
            });
        } else {
            throw new InvalidFileInputError();
        }
    }
}
