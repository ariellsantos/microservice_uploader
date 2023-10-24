import { Compressor } from '../../../src/Uploader/application/Compressor';
import { Buffer } from 'buffer';

export class CompressorServiceMock implements Compressor {
  private compressToBase64Mock = jest.fn();
  private decompressFromBase64Mock = jest.fn();

  returnOnCompressToBase64(base64String: string) {
    this.compressToBase64Mock.mockImplementation(() => {
      return base64String;
    });
  }

  returnOnDecompressFromBaseBase64(fileData: Buffer) {
    this.decompressFromBase64Mock.mockImplementation(() => {
      return fileData;
    });
  }

  async compressToBase64(file: Buffer): Promise<string> {
    return this.compressToBase64Mock(file);
  }

  async decompressFromBase64(base64File: string): Promise<Buffer> {
    return this.decompressFromBase64Mock(base64File);
  }

  assertDecompressFromBase64HasBeenCalledWith(base64File: string) {
    expect(this.decompressFromBase64Mock).toHaveBeenCalledWith(base64File);
  }
}
