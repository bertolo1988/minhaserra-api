import Router from 'koa-router';

import { HealthController } from './controllers/health';
import { UsersController, UsersValidator } from './controllers/users';
import { ContactVerificationsController } from './controllers/contact-verifications';

export function configureKoaRouter(): Router {
  const router = new Router({
    prefix: '/api',
  });
  router.get('/health', HealthController.hello);
  router.post(
    '/users',
    UsersValidator.validateCreateUser,
    UsersController.createUser,
  );
  router.get(
    '/contact-verifications/:id/verify',
    ContactVerificationsController.verifyUser,
  );
  return router;
}
