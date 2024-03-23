import http from 'http';
import gracefulShutdown from 'http-graceful-shutdown';
import { Knex } from 'knex';
import Koa from 'koa';
import { koaBody } from 'koa-body';
import KoaLogger from 'koa-logger';
import * as databaseConfig from '../knexfile';
import CONFIG from './config';
import { ErrorsController } from './controllers/errors';
import { disconnectFromDatabase, getDatabaseInstance } from './knex-database';
import { configureKoaRouter } from './router';
import { sleep } from './utils/other-utils';
import CONSTANTS from './constants';

export type ApiServerOptions = {
  port: number;
  database: Knex.Config;
};

export const defaultServerOptions: ApiServerOptions = {
  port: CONFIG.server.port,
  database: databaseConfig,
};

export class ApiServer {
  server?: http.Server;
  options: ApiServerOptions;
  app: Koa;
  databaseInstance?: Knex;

  constructor(options: ApiServerOptions) {
    this.options = options;
    this.app = new Koa();

    this.app.use(ErrorsController.handleError);
    this.app.use(KoaLogger());
    this.app.use(
      koaBody({ multipart: true, jsonLimit: CONSTANTS.JSON_BODY_LIMIT }),
    );

    const router = configureKoaRouter();
    this.app.use(router.routes());
    this.app.use(router.allowedMethods());
  }

  private async configureDatabase(): Promise<void> {
    this.databaseInstance = await getDatabaseInstance(this.options.database);
  }

  async start(): Promise<void> {
    await this.configureDatabase();
    this.server = await this.app.listen(this.options.port);
  }

  async stopHttpServer(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.server) {
        this.server.close((err) => {
          if (err) return reject(err);
          resolve();
        });
      } else {
        reject(`server is not running`);
      }
    });
  }

  async stop(): Promise<void> {
    await disconnectFromDatabase();
    await gracefulShutdown(this.server, {
      preShutdown: async (_signal?: string) => {
        await this.stopHttpServer();
      },
      finally: () => {
        console.log('Server is gracefully terminated!');
      },
    });
    await sleep();
  }
}
