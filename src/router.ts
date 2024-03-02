import Router from 'koa-router';

import {
  ContactVerificationsController,
  ContactVerificationsValidator,
} from './controllers/contact-verifications';
import { HealthController } from './controllers/health';
import {
  PasswordResetsController,
  PasswordResetsValidator,
} from './controllers/password-resets';
import { UsersController, UsersValidator } from './controllers/users';

export function configureKoaRouter(): Router {
  const router = new Router({
    prefix: '/api',
  });
  router.get('/health', HealthController.hello);
  router.post(
    '/login',
    UsersValidator.validateLoginUser,
    UsersController.loginUser,
  );
  router.post(
    '/users',
    UsersValidator.validateCreateUser,
    UsersController.createUser,
  );
  router.get(
    '/contact-verifications/:id/verify',
    ContactVerificationsValidator.validateVerifyUserContact,
    ContactVerificationsController.verifyUserContact,
  );
  router.get(
    '/password-resets',
    PasswordResetsValidator.validateCreatePasswordReset,
    PasswordResetsController.createPasswordReset,
  );
  return router;
}
