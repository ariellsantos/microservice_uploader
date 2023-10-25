import config from './config';
import convict from 'convict';

export type GCPConfigurations = {
  serviceAccountPath: string;
  projectId: string;
  bucket: string;
  storageApiEndpoint: string;
};

export type LocalStorageConfigurations = {
  rootPath: string;
  rootDir: string;
  host: string;
};

export type ApplicationConfigurations = {
  port: number;
};

const properties = config.getProperties();

type Configs = string | number | GCPConfigurations | LocalStorageConfigurations | ApplicationConfigurations;
export function configFactory(resource: convict.Path<typeof properties>): Configs {
  return config.get(resource);
}
