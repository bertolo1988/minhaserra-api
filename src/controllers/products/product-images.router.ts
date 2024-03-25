import Router from 'koa-router';
import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import { validateIdValidUuid } from '../../middlewares/param-is-valid-uuid.middleware';
import { ProductImagesValidator } from './product-images.validator';
import { ProductImagesController } from './product-images.controller';

export function configureProductsImagesRouter(router: Router) {
  router.get(
    '/products/:id/images',
    validateIdValidUuid,
    ProductImagesController.getProductImagesByProductId,
  );
  router.post(
    '/products/:id/images',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    ProductImagesValidator.validateCreateProductImage,
    ProductImagesController.createProductImage,
  );
}