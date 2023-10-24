import { Storage } from '../Storage';

export interface GenerateUriFileData {
  fileName: string;
}

export class GenerateFileURI {
  constructor(private readonly storageService: Storage) {}

  async run(params: GenerateUriFileData): Promise<string> {
    return await this.storageService.createURL(params.fileName);
  }
}
