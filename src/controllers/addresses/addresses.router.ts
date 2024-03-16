import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { AddressesController } from './addresses.controller';
import { AddressesValidator } from './addresses.validator';

export function configureAddressesRouter(router: Router) {
  router.get(
    '/addresses',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    AddressesValidator.validateGetAddresses,
    AddressesController.getAddresses,
  );
  router.get(
    '/addresses/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    AddressesValidator.validateGetOneAddress,
    AddressesController.getOneAddress,
  );
  router.post(
    '/addresses',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    AddressesValidator.validateCreateAddress,
    AddressesController.createAddress,
  );
  router.put('/addresses/:id', AddressesController.updateAddress);
  router.delete('/addresses/:id', AddressesController.deleteAddress);
}
