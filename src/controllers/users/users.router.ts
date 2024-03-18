import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { UsersController } from './users.controller';
import { UsersValidator } from './users.validator';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';

export function configureUsersRouter(router: Router) {
  router.post(
    '/login',
    UsersValidator.validateLoginUser,
    UsersController.loginUser,
  );
  router.get(
    '/users/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    UsersController.getUserById,
  );
  router.post(
    '/users',
    UsersValidator.validateCreateUser,
    UsersController.createUser,
  );

  router.put(
    '/users/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    UsersValidator.validateUpdateUser,
    UsersController.updateUser,
  );
}
