import { server } from './server';
import config from './configs/config';
import { container } from './a-dependency-injection/container';
import Logger from '../Uploader/domain/Logger';

const logger: Logger = container.resolve('logger');

const port = config.get('application.port');
server.listen(port, () => {
  logger.info(`app running on port ${port}`);
});
