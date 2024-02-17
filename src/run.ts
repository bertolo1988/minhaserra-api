import dotenv from 'dotenv';
import { ApiServer, defaultServerOptions } from './server';

dotenv.config();

let server: ApiServer;
const serverOptions = defaultServerOptions;

async function run() {
  console.log(`Server options:`, JSON.stringify(serverOptions, null, 2));
  server = new ApiServer(serverOptions);
  await server.start();
  console.log(`server listening on port ${serverOptions.port}`);
}

run().catch((err) => {
  console.error(`Server stopped abrutly`, err);
});
