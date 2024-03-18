import Router from 'koa-router';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';
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
    validateIdValidUuid,
    PasswordResetsValidator.validateUpdatePasswordUnauthenticated,
    PasswordResetsController.updatePasswordUnauthenticated,
  );
}
