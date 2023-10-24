import { GCPConfigurations } from '../../../../Application/configs/configFactory';
import { GCPStorageConfig } from '../../../application/GCPStorageConfig';

export function gcpStorageCreateCredentialsFactory(gcpConfig: GCPConfigurations): GCPStorageConfig {
  return {
    projectId: gcpConfig.projectId,
    bucket: gcpConfig.bucket,
    serviceAccountPath: gcpConfig.serviceAccountPath
  };
}
