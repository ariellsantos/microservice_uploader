import { container } from '../../../../src/Application/a-dependency-injection/container';
import { DeflateCompressor } from '../../../../src/Uploader/infrastructure/DeflateCompressor/DeflateCompressor';
import { DecompressError } from '../../../../src/Uploader/infrastructure/DeflateCompressor/DecompressError';

const deflateCompressor: DeflateCompressor = container.resolve('deflateCompressorService');

/**
 * @group integration
 */
describe('DeflateCompressor', () => {
  describe('#CompressToBase64String', () => {
    it('should compress binary raw data and return a base64 string', async () => {
      const base64StringExpect = '80jNyclXCM8vyklRBAA=';
      const binaryData = Buffer.from('Hello World!', 'utf-8');

      const base64DataString = await deflateCompressor.compressToBase64(binaryData);

      expect(base64DataString).toStrictEqual(base64StringExpect);
    });
  });

  describe('#DecompressFromBase64string', () => {
    it('should throw error DecompressError cause file was compressed with another method different of deflate ', async () => {
      const base64StringFile: string = 'H4sIAAAAAAAAE/NIzcnJVwjPL8pJUQQAoxwpHAwAAAA=';

      await expect(async () => {
        await deflateCompressor.decompressFromBase64(base64StringFile);
      }).rejects.toThrowError(new DecompressError(`Can't decompress the file`));
    });

    it('should decompress a file from base64 string', async () => {
      const base64String = '80jNyclXCM8vyklRBAA';
      const binaryDataExpected = Buffer.from('Hello World!', 'utf-8');

      const binaryDataResp = await deflateCompressor.decompressFromBase64(base64String);

      expect(binaryDataResp).toStrictEqual(binaryDataExpected);
    });
  });
});
