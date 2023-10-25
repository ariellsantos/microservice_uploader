import { aliasTo, asClass, asFunction, createContainer, InjectionMode } from 'awilix';
import { configFactory } from '../configs/configFactory';
import { gcpStorageCreateCredentialsFactory } from '../../Uploader/infrastructure/storage/GCPStorage/gcpStorageCreateCredentialsFactory';
import { GCPStorageConnection } from '../../Uploader/infrastructure/storage/GCPStorage/GCPStorageConnection';
import { GCPStorage } from '../../Uploader/infrastructure/storage/GCPStorage/GCPStorage';
import { LocalStorage } from '../../Uploader/infrastructure/storage/LocalDiskStorage/LocalStorage';
import { DeflateCompressor } from '../../Uploader/infrastructure/DeflateCompressor/DeflateCompressor';
import { FileUploader } from '../../Uploader/application/Uploads/FileUploader';
import { GenerateFileURI } from '../../Uploader/application/Uploads/GenerateFileURI';

const container = createContainer({
  injectionMode: InjectionMode.CLASSIC
});

container.register({
  gcpConfig: asFunction(configFactory, {
    injector: () => ({ resource: 'gcloud' })
  }),
  localStorageConfig: asFunction(configFactory, {
    injector: () => ({ resource: 'localStorage' })
  }),
  gcpStorageCredentials: asFunction(gcpStorageCreateCredentialsFactory),
  gcpStorageConnection: asClass(GCPStorageConnection),
  gcpStorageService: asClass(GCPStorage),
  localStorageService: asClass(LocalStorage),
  deflateCompressorService: asClass(DeflateCompressor),
  storageService: aliasTo<GCPStorage>('gcpStorageService'),
  compressorService: aliasTo('deflateCompressorService'),
  uploaderService: asClass(FileUploader),
  generateUriFileService: asClass(GenerateFileURI)
});

export { container };
