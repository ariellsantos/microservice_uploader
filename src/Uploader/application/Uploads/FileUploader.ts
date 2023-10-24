import { Compressor } from '../Compressor';
import { Storage } from '../Storage';

export interface FileUploaderData {
  fileName: string;
  data: string;
}
export class FileUploader {
  constructor(
    private readonly compressorService: Compressor,
    private readonly storageService: Storage
  ) {}

  async run(params: FileUploaderData) {
    const fileRawData = await this.compressorService.decompressFromBase64(params.data);
    await this.storageService.uploadFileFromBuffer(params.fileName, fileRawData);
  }
}
