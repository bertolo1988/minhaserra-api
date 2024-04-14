import Router from 'koa-router';

import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { ShoppingCartItemsValidator } from './shopping-cart-items.validator';
import { ShoppingCartItemsController } from './shopping-cart-items.controller';

export function configureShoppingCartItemsRouter(router: Router) {
  router.post(
    '/shopping-cart-items',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedBuyers(),
    ShoppingCartItemsValidator.validateCreateShoppingCartItem,
    ShoppingCartItemsController.createShoppingCartItem,
  );

  // TODO: Implement the following routes
  /*   router.get(
    '/shopping-cart-items',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedSellers(),
    ShoppingCartItemsController.getShoppingCartItemsForUser,
  );

  router.delete(
    '/shopping-cart-items/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedSellers(),
    validateIdValidUuid,
    ShoppingCartItemsController.deleteShoppingCartItemById,
  );

  router.put(
    '/shopping-cart-items/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedSellers(),
    validateIdValidUuid,
    ShoppingCartItemsValidator.validateUpdateShoppingCartItem,
    ShoppingCartItemsController.updateShoppingCartItemById,
  ); */
}
