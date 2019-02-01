/*!
 * @copyright FLYACTS GmbH 2019
 */

import { BaseEntity } from '@flyacts/backend-core-entities';
import {
    Magic,
    MAGIC_MIME_TYPE,
} from 'mmmagic';
import { Stream } from 'stream';
import { ReadableStreamBuffer } from 'stream-buffers';
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
     * The internal file storage
     */
    private storage: BlobStore;

    public constructor(
        private connection: Connection,
        private configuration: MediaConfiguration,
    ) {
        this.storage = new BlobStore(this.configuration.location);
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
                fileStream = new ReadableStreamBuffer({
                    frequency: 10,
                    chunkSize: 2048,
                });
                (fileStream as ReadableStreamBuffer).put(file);
            } else if (typeof file === 'string') {
                fileStream = new ReadableStreamBuffer({
                    frequency: 10,
                    chunkSize: 2048,
                });
                (fileStream as ReadableStreamBuffer).put(Buffer.from(file, 'base64'));
            } else {
                throw new Error('Input not supported');
            }

            const writeStream = this.storage.createWriteStream();

            fileStream.pipe(writeStream);

            const hash = await (new Promise<string>((resolve, reject) => {
                fileStream.on('error', (err) => {
                    reject(err);
                });

                fileStream.on('finish', () => {
                    resolve(writeStream.key);
                });
            }));

            const filePath = await this.storage.resolve({ key: hash });
            const magic = new Magic(MAGIC_MIME_TYPE);
            const fileEntity = new FileEntity();

            fileEntity.media = media;
            fileEntity.hash = hash;
            fileEntity.variant = 'original';
            fileEntity.size = filePath.stat.size;
            fileEntity.contentType = await (new Promise((resolve, reject) => {
                magic.detectFile(filePath.path, (err, result) => {
                    if (err instanceof Error) {
                        reject(err);
                        return;
                    }
                    resolve(result);
                });
            }));


            await entityManager.save(fileEntity);

            if (!existingTransaction) {
                await queryRunner.commitTransaction();
            }

            return media;
        } catch (error) {
            if (!existingTransaction) {
                await queryRunner.rollbackTransaction();
            }
            throw error;
        }
    }
}
