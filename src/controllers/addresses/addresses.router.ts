import Router from 'koa-router';

import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { AddressesController } from './addresses.controller';
import { AddressesValidator } from './addresses.validator';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';

export function configureAddressesRouter(router: Router) {
  router.get(
    '/addresses',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    AddressesController.getAddresses,
  );
  router.get(
    '/addresses/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    AddressesController.getOneAddress,
  );
  router.post(
    '/addresses',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    AddressesValidator.validateCreateAddress,
    AddressesController.createAddress,
  );
  router.delete(
    '/addresses/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    AddressesController.deleteOneAddress,
  );
}
