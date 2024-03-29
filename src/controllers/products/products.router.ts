import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';
import { ProductsController } from './products.controller';
import { ProductsValidator } from './products.validator';

export function configureProductsRouter(router: Router) {
  /* router.get(
    '/products/:id',
    validateIdValidUuid,
    ProductsController.getProductById,
  ); */
  /*   router.delete(
    '/products/:id',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    ProductsController.deleteProductById,
  ); */
  router.post(
    '/products',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedSellers(),
    ProductsValidator.validateCreateProduct,
    ProductsController.createProduct,
  );
}
