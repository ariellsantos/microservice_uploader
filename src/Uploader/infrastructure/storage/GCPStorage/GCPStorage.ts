import { GCPStorageConnection } from './GCPStorageConnection';
import { CreateWriteStreamOptions, GetSignedUrlConfig } from '@google-cloud/storage';
import { FileData, Storage } from '../../../application/Storage';
import { UploadFileError } from '../UploadFileError';
import { FileNotFoundError } from '../FileNotFoundError';
import { FileExistsError } from '../FileExistsError';
import { CantClearStorageError } from '../CantClearStorageError';

export class GCPStorage implements Storage {
  constructor(private readonly gcpStorageConnection: GCPStorageConnection) {}
  async uploadFileFromBuffer(fileName: string, fileData: FileData): Promise<void> {
    try {
      const bucket = await this.gcpStorageConnection.getBucket();
      const file = bucket.file(fileName);

      const opts: CreateWriteStreamOptions = {};

      await file.save(fileData, opts);
    } catch (error) {
      if (error instanceof Error) throw new UploadFileError(error.message);
    }
  }

  async createURL(fileName: string): Promise<string> {
    if (!(await this.fileExists(fileName))) {
      throw new FileNotFoundError(`This files doesn't exists`);
    }

    const bucket = await this.gcpStorageConnection.getBucket();
    const file = bucket.file(fileName);
    const opts: GetSignedUrlConfig = {
      action: 'read',
      expires: Date.now() + 60 * 60 * 100
    };
    const [url] = await file.getSignedUrl(opts);
    return url;
  }

  async findFile(fileName: string): Promise<FileData> {
    try {
      const bucket = await this.gcpStorageConnection.getBucket();
      const file = bucket.file(fileName);
      const [rawFile]: FileData[] = await file.download();
      return rawFile;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new FileNotFoundError(`Can't find the file`);
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    try {
      const bucket = await this.gcpStorageConnection.getBucket();
      const file = bucket.file(fileName);

      const [fileExists] = await file.exists();

      return fileExists;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new FileExistsError(`Can't ensure if file exists`);
    }
  }

  async clearStorage() {
    try {
      const bucket = await this.gcpStorageConnection.getBucket();

      await bucket.deleteFiles();
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new CantClearStorageError(`Can't clear storage`);
    }
  }
}
