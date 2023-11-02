import { Bucket, Storage } from '@google-cloud/storage';
import { GCPStorageConfig } from '../../../application/GCPStorageConfig';
import { InvalidBucketError } from './InvalidBucketError';
import { Logger } from 'winston';

type Nullable<T> = null | T;

export class GCPStorageConnection {
  private bucket: Bucket;
  private storage: Storage;

  constructor(
    private readonly gcpConfig: GCPStorageConfig,
    private readonly logger: Logger
  ) {
    this.initialize();
  }
  async getBucket(name: Nullable<string> = null): Promise<Bucket> {
    if (!this.bucket) {
      const nameBucket = name ? name : this.gcpConfig.bucket;
      this.bucket = this.storage.bucket(nameBucket);
    }
    await this.ensureBucketExists(this.bucket);
    return this.bucket;
  }

  private initialize(): void {
    this.storage = new Storage({
      projectId: this.gcpConfig.projectId,
      keyFilename: this.gcpConfig.serviceAccountPath
    });
  }

  private async ensureBucketExists(bucket: Bucket) {
    try {
      await bucket.exists();
    } catch (error) {
      if (error instanceof Error) this.logger.error(error);
      throw new InvalidBucketError(`This bucket doesn't exist`);
    }
  }
}
