import { FileData, Storage } from '../../../src/Uploader/application/Storage';

export class StorageServiceMock implements Storage {
  private mockCreateURL = jest.fn();
  private mockUploadFromBuffer = jest.fn();
  private mockFindFile = jest.fn();
  private mockClearStorage = jest.fn();

  returnOnFindFIle(file: FileData) {
    this.mockFindFile.mockImplementation(() => {
      return file;
    });
  }

  returnOnCreateURL(urlString: string) {
    this.mockCreateURL.mockImplementation(() => {
      return urlString;
    });
  }

  throwErrorOnFindFile(error: Error) {
    this.mockFindFile.mockImplementation(() => {
      throw error;
    });
  }

  throwErrorOnCreateURI(error: Error) {
    this.mockCreateURL.mockImplementation(() => {
      throw error;
    });
  }

  async createURL(fileName: string): Promise<string> {
    return this.mockCreateURL(fileName);
  }

  async findFile(fileName: string): Promise<FileData> {
    return this.mockFindFile(fileName);
  }

  async uploadFileFromBuffer(fileName: string, fileData: FileData): Promise<void> {
    this.mockUploadFromBuffer(fileName, fileData);
  }

  async clearStorage() {
    this.mockClearStorage();
  }

  assertUploadFileFromBufferHasBeenCalledWith(fileName: string, fileData: FileData) {
    expect(this.mockUploadFromBuffer).toHaveBeenCalledWith(fileName, fileData);
  }

  assertGenerateUriFileHasBeenCalledWith(fileName: string) {
    expect(this.mockCreateURL).toHaveBeenCalledWith(fileName);
  }
}
