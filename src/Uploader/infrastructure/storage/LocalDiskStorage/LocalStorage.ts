import { FileData, Storage } from '../../../application/Storage';
import { mkdir, readFile, rm, writeFile } from 'fs/promises';
import { existsSync } from 'fs';
import * as path from 'path';
import { UploadFileError } from '../UploadFileError';
import { LocalStorageConfigurations } from '../../../../Application/configs/configFactory';
import { FileNotFoundError } from '../FileNotFoundError';
import * as url from 'url';
import Logger from '../../../domain/Logger';

export class LocalStorage implements Storage {
  constructor(
    private readonly localStorageConfig: LocalStorageConfigurations,
    private readonly logger: Logger
  ) {}

  async createURL(fileName: string): Promise<string> {
    if (!(await this.fileExists(fileName))) {
      throw new FileNotFoundError(`This files doesn't exists`);
    }
    return url.format({
      protocol: 'http',
      hostname: this.localStorageConfig.host,
      pathname: url.pathToFileURL(path.join('/', this.localStorageConfig.rootPath, fileName)).pathname
    });
  }

  async findFile(fileName: string): Promise<FileData> {
    try {
      const filePath = path.join(this.localStorageConfig.rootDir, fileName);

      return await readFile(filePath, { flag: 'r' });
    } catch (error) {
      if (error instanceof Error) this.logger.error(error);
      throw new FileNotFoundError('File not found');
    }
  }

  async uploadFileFromBuffer(fileName: string, fileData: FileData): Promise<void> {
    try {
      const filePath = path.join(this.localStorageConfig.rootDir, fileName);
      await this.ensureDirExist(filePath);
      await writeFile(filePath, fileData);
    } catch (error) {
      if (error instanceof Error) this.logger.error(error);
      throw new UploadFileError(`Can't upload file`);
    }
  }

  async fileExists(fileName: string): Promise<boolean> {
    const filePath = path.join(this.localStorageConfig.rootDir, fileName);
    return existsSync(filePath);
  }

  private async ensureDirExist(filePath: string): Promise<void> {
    const dirname = path.dirname(filePath);
    if (existsSync(dirname)) {
      return;
    }
    await this.ensureDirExist(dirname);
    await mkdir(dirname);
  }
  async clearStorage() {
    await rm(this.localStorageConfig.rootDir, { recursive: true });
  }
}
