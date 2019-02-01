/*!
 * @copyright FLYACTS GmbH 2019
 */

import { Stats } from 'fs';
import { promisify } from 'util';

const blobs = require('content-addressable-blob-store');

// tslint:disable:no-any

interface BlobMetada {
    /**
     * An identitfier for the blob
     */
    key: string;
}

type WriteFinishCallback = (error: any, metadata: BlobMetada) => void;

interface ReadStreamOptions {
    /**
     * An identitfier for the blob
     */
    key: string;

    /**
     * The position in the file where to start reading from
     */
    start?: number;

    /**
     * The position in the file where to stop reading from
     */
    end?: number;
}

interface ResolveResults {
    /**
     * The path of the blob in the filesystem
     */
    path: string;
    /**
     * An fs.Stats object with information about the file
     */
    stat: Stats;
}

/**
 * A small promise based wrapper arround content-addressable-blob-store
 */
export class BlobStore {
    /**
     * The central storage of content-addressable-blob-store
     */
    private storage: any;

    public constructor(path: string, algo: string = 'sha256') {
        this.storage = blobs({
            path,
            algo,
        });
    }

    /**
     * Check if the blob exists
     */
    public async exists(metadata: BlobMetada) {
        return promisify(this.storage.exists)(metadata);
    }

    /**
     * Remove the blob from the storage
     */
    public async delete(metadata: BlobMetada) {
        return promisify(this.storage.remove)(metadata);
    }

    /**
     * Look the up file specific information for this blob
     */
    public async resolve(metadata: BlobMetada): Promise<ResolveResults> {
        return new Promise((resolve, reject) => {
            this.storage.resolve(metadata, (err: any, path: string, stat: Stats) => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve({
                    path,
                    stat,
                });
            });
        });
    }

    /**
     * Create a write stream for a file
     */
    public createWriteStream(callback?: WriteFinishCallback) {
        return this.storage.createWriteStream(callback);
    }

    /**
     * Create a read stream for a given file hash
     */
    public createReadStream(options: ReadStreamOptions) {
        return this.storage.createReadStream(options);
    }
}
