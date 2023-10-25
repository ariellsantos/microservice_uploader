import { server } from './server';
import config from './configs/config';

const port = config.get('application.port');
server.listen(port, () => {
  console.log(`app running on port ${port}`);
});
