import Koa from 'koa';
import { v4 as uuidv4 } from 'uuid';

import CONSTANTS from '../../constants';
import { ValidationError } from '../../types/errors';
import { ImageUploadService } from './image-upload-service';
import { ProductImagesRepository } from './product-images.repository';
import { ProductsRepository } from './products.repository';
import {
  CreateProductImageDto,
  ProductImageModel,
  ProductModel,
} from './products.types';

const imageUploadService = new ImageUploadService();

export class ProductImagesController {
  static async deleteProductImageById(ctx: Koa.Context, next: Koa.Next) {
    const userId = ctx.state.user.id;
    const { id: productId, imageId } = ctx.params;

    const product: ProductModel | null =
      await ProductsRepository.getProductById(productId);
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

    const productImage: ProductImageModel | null =
      await ProductImagesRepository.getProductImageByProductIdAndImageId(
        productId,
        imageId,
      );

    if (!productImage) {
      ctx.status = 404;
      ctx.body = { message: 'Image not found' };
      return;
    }

    const isDeletedFromS3: boolean =
      await imageUploadService.deleteImage(productImage);
    if (!isDeletedFromS3) {
      throw new Error(`Failed to delete image: ${imageId}`);
    }

    const isDeleted =
      await ProductImagesRepository.deleteProductImageById(imageId);

    if (!isDeleted) {
      throw new Error(`Failed to delete image: ${imageId}`);
    }

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

    const productImageId = uuidv4();
    const imageUrl = await imageUploadService.uploadImage(
      productImageId,
      userId,
      productId,
      body,
    );

    const { id: imageId } =
      await ProductImagesRepository.createProductImageWithId(
        productImageId,
        productId,
        imageUrl,
        body,
      );

    if (!imageId) {
      throw new Error(`Failed to product image`);
    }

    ctx.status = 201;
    ctx.body = { id: imageId, url: imageUrl };
  }
}
