import Router from 'koa-router';

import { HealthController } from './controllers/health';
import { UsersController, UsersValidator } from './controllers/users';

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
  return router;
}
