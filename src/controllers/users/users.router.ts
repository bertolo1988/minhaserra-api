import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { UsersController } from './users.controller';
import { UsersValidator } from './users.validator';

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
    UsersValidator.validateGetUserById,
    UsersController.getUserById,
  );
  router.post(
    '/users',
    UsersValidator.validateCreateUser,
    UsersController.createUser,
  );

  router.put(
    '/users',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    UsersValidator.validateUpdateUser,
    UsersController.updateUser,
  );
}
