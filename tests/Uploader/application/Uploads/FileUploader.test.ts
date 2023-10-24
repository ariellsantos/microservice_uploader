import { Buffer } from 'buffer';
import { FileUploader, FileUploaderData } from '../../../../src/Uploader/application/Uploads/FileUploader';
import { StorageServiceMock } from '../../__mocks__/StorageServiceMock';
import { CompressorServiceMock } from '../../__mocks__/CompressorServiceMock';

/**
 * @group unit
 */
describe('FileUploader', () => {
  it('upload a file', async () => {
    const fileRawData = Buffer.from('Hello world!', 'utf-8');
    const fileDataBase64 = fileRawData.toString('base64');
    const fileName = 'file/name/test.txt';

    const fileUploaderData: FileUploaderData = {
      fileName,
      data: fileDataBase64
    };

    const compressorService = new CompressorServiceMock();
    compressorService.returnOnDecompressFromBaseBase64(fileRawData);

    const storageService = new StorageServiceMock();

    const fileUploaderService = new FileUploader(compressorService, storageService);

    await fileUploaderService.run(fileUploaderData);
    compressorService.assertDecompressFromBase64HasBeenCalledWith(fileDataBase64);
    storageService.assertUploadFileFromBufferHasBeenCalledWith(fileName, fileRawData);
  });
});
