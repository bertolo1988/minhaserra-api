import Koa from 'koa';
import CONSTANTS from '../../constants';
import { ValidationError } from '../../types/errors';
import { ImageUploadService } from './image-upload-service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsRepository } from './products.repository';
import { CreateProductImageDto } from './products.types';

const imageUploadService = new ImageUploadService();

export class ProductImagesController {
  static async deleteProductImageById(ctx: Koa.Context, next: Koa.Next) {
    const userId = ctx.state.user.id;
    const { id: productId, imageId } = ctx.params;

    const product = await ProductsRepository.getProductById(productId);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }

    if (product.userId !== userId) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden' };
      return;
    }

    const productImage =
      await ProductImagesRepository.getProductImageByProductIdAndImageId(
        productId,
        imageId,
      );

    if (!productImage) {
      ctx.status = 404;
      ctx.body = { message: 'Image not found' };
      return;
    }

    // TODO: delete from s3 and db
    // delete from s3
    // delete from db

    ctx.status = 200;
    ctx.body = { message: 'Image deleted' };
  }

  static async getProductImagesByProductId(ctx: Koa.Context, next: Koa.Next) {
    const productId = ctx.params.id;

    const product = await ProductsRepository.getProductById(productId);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }
    const productImages =
      await ProductImagesRepository.getProductImagesByProductId(productId);

    ctx.status = 200;
    ctx.body = productImages;
  }

  static async createProductImage(ctx: Koa.Context, next: Koa.Next) {
    const userId = ctx.state.user.id;
    const productId = ctx.params.id;
    const body = ctx.request.body as CreateProductImageDto;

    const product = await ProductsRepository.getProductById(productId);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
    }

    if (product.userId !== userId) {
      ctx.status = 403;
      ctx.body = { message: 'Forbidden' };
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
