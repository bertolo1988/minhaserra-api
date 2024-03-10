import Router from 'koa-router';
import { PasswordResetsController } from './password-resets.controller';
import { PasswordResetsValidator } from './password-resets.validator';

export function configurePasswordResetsRouter(router: Router) {
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
}
