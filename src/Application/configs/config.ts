import convict from 'convict';
import * as path from 'path';

const config = convict({
  env: {
    doc: 'The application environment',
    format: ['production', 'development', 'test'],
    default: 'development',
    env: 'NODE_ENV'
  },
  application: {
    port: {
      doc: 'port where app server will be running',
      format: Number,
      env: 'APP_PORT',
      default: 3000
    }
  },
  gcloud: {
    serviceAccountPath: {
      doc: 'Service account associated with project resources',
      format: String,
      env: 'GOOGLE_APPLICATION_CREDENTIALS',
      default: 'keyfile.json'
    },
    projectId: {
      doc: 'The project_id for the project associated with app resources',
      format: String,
      env: 'GCP_PROJECT_ID',
      default: 'projectId'
    },
    bucket: {
      doc: 'Bucket where files are upload ',
      format: String,
      env: 'CCP_BUCKET',
      default: 'dev_bucket_f1'
    },
    storageApiEndpoint: {
      doc: 'The API endpoint of the service used to make requests.',
      format: String,
      env: 'STORAGE_API_ENDPOINT',
      default: 'storage.googleapis.com'
    }
  },
  localStorage: {
    rootDir: {
      doc: 'root dir where files are allocated',
      format: String,
      env: 'ROOT_DIR_LOCAL_STORAGE',
      default: path.join(process.cwd(), 'storage')
    },
    rootPath: {
      doc: 'Root folder to path for storage resources',
      format: String,
      env: 'ROOT_STORAGE_PATH',
      default: 'storage'
    },
    host: {
      doc: 'host location files',
      format: String,
      env: 'STORAGE_DISK_HOST',
      default: 'localhost'
    }
  }
});

const env = config.get('env');
config.loadFile(path.join(process.cwd(), 'environments', `${env}.json`));

export default config;
