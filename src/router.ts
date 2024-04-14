import Router from 'koa-router';

import { configureAddressesRouter } from './controllers/addresses/addresses.router';
import { configureContactsVerificationRouter } from './controllers/contact-verifications/contact-verifications.router';
import { configureHealthRouter } from './controllers/health/health.router';
import { configurePasswordResetsRouter } from './controllers/password-resets/password-resets.router';
import { configureProductsImagesRouter } from './controllers/products/product-images.router';
import { configureProductsRouter } from './controllers/products/products.router';
import { configureShoppingCartItemsRouter } from './controllers/shopping-cart-items/shopping-cart-items.router';
import { configureUsersRouter } from './controllers/users/users.router';

export function configureKoaRouter(): Router {
  const router = new Router({
    prefix: '/api',
  });

  configureHealthRouter(router);
  configureUsersRouter(router);
  configureContactsVerificationRouter(router);
  configurePasswordResetsRouter(router);
  configureAddressesRouter(router);
  configureProductsImagesRouter(router);
  configureProductsRouter(router);
  configureShoppingCartItemsRouter(router);

  return router;
}
