import { Buffer } from 'buffer';

export type FileData = Buffer;
export interface Storage {
  uploadFileFromBuffer(fileName: string, fileData: FileData): Promise<void>;
  findFile(fileName: string): Promise<FileData>;
  createURL(fileName: string): Promise<string>;
  clearStorage(): Promise<void>;
}
