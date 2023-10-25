import express from 'express';

import helmet from 'helmet';
import config from './configs/config';
import { router } from './routes/uploader.routes';

const server = express();

server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(helmet());
server.use('/' + config.get('localStorage.rootPath'), express.static(config.get('localStorage.rootDir')));
server.use(router);

export { server };
