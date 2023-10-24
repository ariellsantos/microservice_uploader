import { StorageServiceMock } from '../../__mocks__/StorageServiceMock';
import { GenerateFileURI, GenerateUriFileData } from '../../../../src/Uploader/application/Uploads/GenerateFileURI';
import { FileNotFoundError } from '../../../../src/Uploader/infrastructure/storage/FileNotFoundError';

/**
 * @group unit
 */
describe('GenerateFileURI', () => {
  let storageService: StorageServiceMock;
  beforeEach(() => {
    storageService = new StorageServiceMock();
  });
  it('should generate and return a URL for a given nameFile', async () => {
    const fileName = 'some/folder/file.txt';
    const uri = 'http://localhost/storage/some/folder/file.txt';

    storageService.returnOnCreateURL(uri);

    const generateUriFileData: GenerateUriFileData = {
      fileName
    };

    const generateFileUri = new GenerateFileURI(storageService);

    const respUri = await generateFileUri.run(generateUriFileData);

    storageService.assertGenerateUriFileHasBeenCalledWith(fileName);
    expect(respUri).toStrictEqual(respUri);
  });

  it("should throw an error FileNotFoundError cause the file doesn't exits", async () => {
    const fileName = 'some/folder/file.txt';
    const error = new FileNotFoundError('File not found');
    storageService.throwErrorOnCreateURI(error);

    const generateUriFileService = new GenerateFileURI(storageService);
    const generateUriFileData: GenerateUriFileData = {
      fileName
    };

    await expect(async () => {
      await generateUriFileService.run(generateUriFileData);
    }).rejects.toThrowError(error);

    storageService.assertGenerateUriFileHasBeenCalledWith(fileName);
  });
});
