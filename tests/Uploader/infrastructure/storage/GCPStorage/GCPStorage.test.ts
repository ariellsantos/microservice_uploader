import { GCPStorage } from '../../../../../src/Uploader/infrastructure/storage/GCPStorage/GCPStorage';
import { container } from '../../../../../src/Application/a-dependency-injection/container';
import { FileNotFoundError } from '../../../../../src/Uploader/infrastructure/storage/FileNotFoundError';
import * as url from 'url';
import config from '../../../../../src/Application/configs/config';

let gcpStorage: GCPStorage;

const gcpContextEnv = container.resolve('gcpStorageService');

/**
 * @group integration
 */
describe('GCPStorage', () => {
  beforeEach(() => {
    gcpStorage = container.resolve('gcpStorageService');
  });
  afterEach(async () => {
    await gcpContextEnv.clearStorage();
  });
  describe('#FindFile', () => {
    it('should find a file by providing the nameFile', async () => {
      const fileName = 'some/folder/test.txt';
      const fileData = Buffer.from('FIle test', 'utf-8');

      await gcpStorage.uploadFileFromBuffer(fileName, fileData);

      const fileFound = await gcpStorage.findFile(fileName);

      expect(fileFound).toStrictEqual(fileData);
    });

    it(`should throw an error FileNotFoundError cause file doesn't exists on bucket`, async () => {
      const fileName = 'some/file.txt';
      await expect(async () => {
        await gcpStorage.findFile(fileName);
      }).rejects.toThrowError(new FileNotFoundError(`Can't find the file`));
    });
  });

  describe('#UploadFile', () => {
    it(`Should upload file data buffer and create folder if it doesn't exists`, async () => {
      const fileBuffer = Buffer.from('This is a file test', 'utf-8');
      const fileName: string = 'folder/test/prueba.txt';

      await gcpStorage.uploadFileFromBuffer(fileName, fileBuffer);

      const fileExists = await gcpStorage.fileExists(fileName);
      expect(fileExists).toBeTruthy();
      const savedFile = await gcpStorage.findFile(fileName);

      expect(savedFile).toStrictEqual(fileBuffer);
    });
  });

  describe('#CreateURI', () => {
    it('Should create a URI by filename', async () => {
      const fileName = 'docs/someperson/report.txt';
      const hostName = config.get('gcloud.storageApiEndpoint');

      const fileData = Buffer.from('Hello World', 'utf-8');

      await gcpStorage.uploadFileFromBuffer(fileName, fileData);

      const urlActual = await gcpStorage.createURL(fileName);

      const urlFormatted = new url.URL(urlActual);

      expect(urlFormatted.hostname).toStrictEqual(hostName);
      expect(urlFormatted.pathname).toContain(fileName);
    });

    it("Should throw an error FileNotFoundError cause file can't be  found", async () => {
      await expect(async () => {
        const fileName = 'docs/someperson/report.txt';
        await gcpStorage.createURL(fileName);
      }).rejects.toThrowError(new FileNotFoundError(`This files doesn't exists`));
    });
  });
});
