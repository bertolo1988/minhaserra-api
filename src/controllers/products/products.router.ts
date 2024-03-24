import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';
import { ProductsValidator } from './products.validator';
import { ProductsController } from './products.controller';

export function configureProductsImagesRouter(router: Router) {
  router.get('/products', (ctx: any) => {
    ctx.status = 200;
    ctx.body = { message: 'hi' };
  });
  router.post(
    '/products/:id/images',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    ProductsValidator.validateCreateProductImage,
    ProductsController.createProductImage,
  );
}
