import config from '../../../../../src/Application/configs/config';
import { container } from '../../../../../src/Application/a-dependency-injection/container';
import { LocalStorage } from '../../../../../src/Uploader/infrastructure/storage/LocalDiskStorage/LocalStorage';
import { FileNotFoundError } from '../../../../../src/Uploader/infrastructure/storage/FileNotFoundError';
import url from 'url';
import Logger from '../../../../../src/Uploader/domain/Logger';
const localStorage: LocalStorage = container.resolve('localStorageService');
let localStorageUtil: LocalStorage;

const logger: Logger = container.resolve('logger');

/**
 * @group integration
 */
describe('LocalDiskStorage', () => {
  beforeEach(() => {
    localStorageUtil = container.resolve('localStorageService');
  });
  afterEach(async () => {
    try {
      await localStorageUtil.clearStorage();
    } catch (error) {
      if (error instanceof Error) {
        logger.info('Nothing to delete');
      }
    }
  });
  describe('#FindFile', () => {
    it('should find a file by providing the nameFile ', async () => {
      const fileName = 'some/folder/test.txt';
      const fileData = Buffer.from('FIle test', 'utf-8');

      await localStorage.uploadFileFromBuffer(fileName, fileData);

      const fileFound = await localStorage.findFile(fileName);

      expect(fileFound).toStrictEqual(fileData);
    });
    it("should throw an error cause file doesn't  exist", async () => {
      const fileName = 'some/test/path/dosent/exist.txt';
      await expect(async () => {
        await localStorage.findFile(fileName);
      }).rejects.toThrowError(new FileNotFoundError('File not found'));
    });
  });

  describe('#UploadFile', () => {
    it(`Should upload file data buffer and create folder if it doesn't exists`, async () => {
      const fileBuffer = Buffer.from('This is a file test', 'utf-8');
      const fileName: string = 'folder/test/prueba.txt';

      await localStorage.uploadFileFromBuffer(fileName, fileBuffer);

      const fileExists = await localStorage.fileExists(fileName);
      expect(fileExists).toBeTruthy();

      const savedFile = await localStorage.findFile(fileName);

      expect(savedFile).toStrictEqual(fileBuffer);
    });
  });

  describe('#CreateURI', () => {
    afterEach(async () => {
      try {
        await localStorageUtil.clearStorage();
      } catch (error) {
        logger.info('Nothing to delete');
      }
    });
    it('Should create a URI by filename', async () => {
      const fileName = 'docs/someperson/report.txt';
      const hostName = config.get('localStorage.host');

      const fileData = Buffer.from('Hello World', 'utf-8');

      await localStorage.uploadFileFromBuffer(fileName, fileData);

      const urlActual = await localStorage.createURL(fileName);

      const urlFormatted = new url.URL(urlActual);

      expect(urlFormatted.hostname).toStrictEqual(hostName);
      expect(urlFormatted.pathname).toContain(fileName);
    });

    it("Should throw an error FileNotFoundError cause file can't be  found", async () => {
      await expect(async () => {
        const fileName = 'docs/someperson/report.txt';
        await localStorage.createURL(fileName);
      }).rejects.toThrowError(new FileNotFoundError("This files doesn't exists"));
    });
  });
});
