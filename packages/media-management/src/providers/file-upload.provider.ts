/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import fileType from 'file-type';
import readChunk from 'read-chunk';
import {
    Readable,
    Stream,
} from 'stream';
import {
    Service,
} from 'typedi';
import { Connection, EntityManager } from 'typeorm';

import { MediaConfiguration } from '../configuration/media.configuration';
import { FileEntity } from '../entities/file.entity';
import { MediaEntity } from '../entities/media.entity';
import { BlobStore } from '../helpers/blob-store-wrapper';

/**
 * Services that helps you to upload files to a media
 */
@Service()
export class FileUploadProvider {
    /**
     * The variant that contains the original file
     */
    public static readonly rawVariant = 'raw';

    /**
     * The internal file storage
     */
    private storage: BlobStore;

    public constructor(
        private connection: Connection,
        private configuration: MediaConfiguration,
    ) {
        this.storage = new BlobStore(
            this.configuration.location,
            this.configuration.tempDir,
        );
    }

    /**
     * Attach a media to an entity
     */
    public async attachFile(
        collection: string,
        entity: BaseEntity,
        file: Stream | Buffer | unknown,
        name?: string,
        transactionManager?: EntityManager,
    ): Promise<MediaEntity> {
        if (!(entity instanceof BaseEntity)) {
            throw new Error('Not an instance of base entity');
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
            const media = new MediaEntity();
            media.collection = collection;
            media.model = entity.constructor.name;
            media.modelId = entity.id;
            media.name = name;
            await entityManager.save(media);

            let fileStream: Stream;

            if (file instanceof Stream) {
                fileStream = file;
            } else if (file instanceof Buffer) {
                fileStream = new Readable({
                    read() {
                        this.push(file);
                        this.push(null);
                    },
                });
            } else if (typeof file === 'string') {
                fileStream = new Readable({
                    read() {
                        this.push(Buffer.from(file, 'base64'));
                        this.push(null);
                    },
                });
            } else {
                throw new Error('Input not supported');
            }

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
            const fileEntity = new FileEntity();

            fileEntity.media = media;
            fileEntity.hash = hash;
            fileEntity.variant = FileUploadProvider.rawVariant;
            fileEntity.size = filePath.stat.size;
            const fileContents = await readChunk(filePath.path, 0, fileType.minimumBytes);
            const results = fileType(fileContents);
            if (results !== null) {
                fileEntity.contentType = results.mime;
            } else {
                fileEntity.contentType = 'application/octet-stream';
            }

            await entityManager.save(fileEntity);

            if (!existingTransaction) {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }

            media.files = [ fileEntity ];

            return media;
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
    public getFilestream(media: MediaEntity, variant?: string) {
        if (!Array.isArray(media.files)) {
            throw new Error();
        }

        if (typeof variant === 'undefined') {
            variant = FileUploadProvider.rawVariant;
        }

        const file = media.files.filter(item => item.variant === variant).pop();

        if (typeof file === 'undefined') {
            throw new Error();
        }

        return this.storage.createReadStream({ key: file.hash });
    }

    /**
     * Remove the media from the database and check if we can unlink the file
     */
    public async removeMedia(media: MediaEntity, transactionManager?: EntityManager) {

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

            for (const file of media.files) {
                await entityManager.remove(file);

                const isUsed = (await entityManager.find(FileEntity, { where: { hash: file.hash } })).length > 0;

                if (!isUsed) {
                    await this.storage.delete({ key: file.hash });
                }
            }

            await entityManager.remove(media);

            if (!existingTransaction) {
                await queryRunner.commitTransaction();
                await queryRunner.release();
            }
        } catch (error) {
            if (!existingTransaction) {
                await queryRunner.rollbackTransaction();
                await queryRunner.release();
            }
            throw new Error('Deleting media entity failed');
        }
    }
}
