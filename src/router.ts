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
import { AuthenticationUtils } from './middlewares/authenticate-user.middleware';

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
  router.get(
    '/users/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeAllActiveVerifiedMiddleware(),
    UsersValidator.validateGetUserById,
    UsersController.getUserById,
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
  router.post(
    '/password-resets',
    PasswordResetsValidator.validateCreatePasswordReset,
    PasswordResetsController.createPasswordReset,
  );
  router.put(
    '/password-resets/:id',
    PasswordResetsValidator.validateUpdatePasswordUnauthenticated,
    PasswordResetsController.updatePasswordUnauthenticated,
  );
  return router;
}
