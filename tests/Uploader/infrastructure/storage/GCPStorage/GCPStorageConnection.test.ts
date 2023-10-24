import { container } from '../../../../../src/Application/a-dependency-injection/container';
import { GCPStorageConnection } from '../../../../../src/Uploader/infrastructure/storage/GCPStorage/GCPStorageConnection';
import { Bucket } from '@google-cloud/storage';
import config from '../../../../../src/Application/configs/config';
import { InvalidBucketError } from '../../../../../src/Uploader/infrastructure/storage/GCPStorage/InvalidBucketError';

let storageConnection: GCPStorageConnection;
const storageConfigs = config.get('gcloud.bucket');

/**
 * @group integration
 */
describe('GCPStorageConnection', () => {
  beforeEach(() => {
    storageConnection = container.resolve('gcpStorageConnection');
  });
  describe('#GetBucket', () => {
    it('Should return the bucket provided in config base', async () => {
      const bucket: Bucket = await storageConnection.getBucket();
      expect(bucket.name).toStrictEqual(storageConfigs);
    });

    it("should throw an error cause bucket doesn't exists", async () => {
      await expect(async () => {
        await storageConnection.getBucket('some_bucket');
      }).rejects.toThrowError(new InvalidBucketError(`This bucket doesn't exist`));
    });
  });
});
