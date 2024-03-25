import Koa from 'koa';
import CONSTANTS from '../../constants';
import { ValidationError } from '../../types/errors';
import { ImageUploadService } from './image-upload-service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsRepository } from './products.repository';
import { CreateProductImageDto } from './products.types';

const imageUploadService = new ImageUploadService();

export class ProductImagesController {
  static async getProductImagesByProductId(ctx: Koa.Context, next: Koa.Next) {
    // TODO: Implement this method
  }

  static async createProductImage(ctx: Koa.Context, next: Koa.Next) {
    const userId = ctx.state.user.id;
    const productId = ctx.params.id;
    const body = ctx.request.body as CreateProductImageDto;

    const product = await ProductsRepository.getProductByIdAndUserId(
      productId,
      userId,
    );
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }

    const imagesPerProductCount =
      await ProductImagesRepository.countImagesByProductId(productId);
    if (imagesPerProductCount >= CONSTANTS.MAX_IMAGES_PER_PRODUCT) {
      throw new ValidationError('Too many pictures for this product');
    }

    const imageUrl = await imageUploadService.uploadImage(
      userId,
      productId,
      body,
    );

    const { id: imageId } = await ProductImagesRepository.createProductImage(
      productId,
      imageUrl,
      body.name,
      body.description,
    );
    if (!imageId) {
      throw new Error(`Failed to product image`);
    }

    ctx.status = 201;
    ctx.body = { id: imageId, url: imageUrl };
  }
}
