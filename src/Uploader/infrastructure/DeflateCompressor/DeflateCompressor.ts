import { deflateRaw, inflateRaw } from 'zlib';
import { promisify } from 'util';
import { CompressionError } from './CompressionError';
import { Buffer } from 'buffer';
import { Compressor } from '../../application/Compressor';
import { DecompressError } from './DecompressError';

export class DeflateCompressor implements Compressor {
  async compressToBase64(file: Buffer): Promise<string> {
    try {
      const deflatePromisify = promisify(deflateRaw);
      let fileBase64: string;
      fileBase64 = (await deflatePromisify(file)).toString('base64');
      return fileBase64;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new CompressionError(`Can't compress the file`);
    }
  }

  async decompressFromBase64(base64File: string): Promise<Buffer> {
    try {
      const inflateProm = promisify(inflateRaw);
      let fileBuffer: Buffer = Buffer.from(base64File, 'base64');
      fileBuffer = await inflateProm(fileBuffer);
      return fileBuffer;
    } catch (error) {
      if (error instanceof Error) console.log(error.message);
      throw new DecompressError(`Can't decompress the file`);
    }
  }
}
