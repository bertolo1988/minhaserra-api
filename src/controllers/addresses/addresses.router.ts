import Router from 'koa-router';
import { AddressesController } from './addresses.controller';

export function configureAddressesRouter(router: Router) {
  router.get('/addresses', AddressesController.getAddresses);
  router.get('/addresses/:id', AddressesController.getOneAddress);
  router.post('/addresses', AddressesController.createAddress);
  router.put('/addresses/:id', AddressesController.updateAddress);
  router.delete('/addresses/:id', AddressesController.deleteAddress);
}
