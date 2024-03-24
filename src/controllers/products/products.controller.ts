import Koa from 'koa';
import { ImageUploadService } from './image-upload-service';
import { CreateProductImageDto } from './products.types';
import { ProductsRepository } from './products.repository';

const imageUploadService = new ImageUploadService();

export class ProductsController {
  static async createProductImage(ctx: Koa.Context, next: Koa.Next) {
    const userId = ctx.state.user.id;
    const productId = ctx.params.id;
    const body = ctx.request.body as CreateProductImageDto;

    const product = await ProductsRepository.getProductById(productId, userId);
    if (!product) {
      ctx.status = 404;
      ctx.body = { message: 'Product not found' };
      return;
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

    ctx.body = 201;
    ctx.body = { id: imageId, url: imageUrl };
  }
}
