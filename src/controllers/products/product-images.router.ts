import Router from 'koa-router';

import { AuthenticationUtils } from '../../middlewares/authenticate-user.middleware';
import {
  getUuidValidatorMiddleware,
  validateIdValidUuid,
} from '../../middlewares/param-is-valid-uuid.middleware';
import { ProductImagesController } from './product-images.controller';
import { ProductImagesValidator } from './product-images.validator';

export function configureProductsImagesRouter(router: Router) {
  router.get(
    '/products/:id/images',
    validateIdValidUuid,
    ProductImagesController.getProductImagesByProductId,
  );
  router.delete(
    '/products/:id/images/:imageId',
    AuthenticationUtils.authenticateUserMiddleware,
    AuthenticationUtils.authorizeActiveVerifiedUsers(),
    validateIdValidUuid,
    getUuidValidatorMiddleware('imageId'),
    ProductImagesController.deleteProductImageById,
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
