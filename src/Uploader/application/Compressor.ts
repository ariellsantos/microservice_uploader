export interface Compressor {
  compressToBase64(file: Buffer): Promise<string>;
  decompressFromBase64(base64File: string): Promise<Buffer>;
}
