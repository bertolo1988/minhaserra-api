import Router from 'koa-router';

import { configureContactsVerificationRouter } from './controllers/contact-verifications/contact-verifications.router';
import { configureHealthRouter } from './controllers/health/health.router';
import { configurePasswordResetsRouter } from './controllers/password-resets/password-resets.router';
import { configureUsersRouter } from './controllers/users/users.router';
import { configureAddressesRouter } from './controllers/addresses/addresses.router';

export function configureKoaRouter(): Router {
  const router = new Router({
    prefix: '/api',
  });

  configureHealthRouter(router);
  configureUsersRouter(router);
  configureContactsVerificationRouter(router);
  configurePasswordResetsRouter(router);
  configureAddressesRouter(router);

  return router;
}
