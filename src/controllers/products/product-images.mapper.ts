import {
  CreateProductImageDto,
  CreateProductImageModel,
} from './products.types';

export class ProductImagesMapper {
  static mapCreateProductImageDtoToProductImageModel(
    productId: string,
    imageUrl: string,
    name: string,
    description?: string,
  ): CreateProductImageModel {
    return {
      productId,
      url: imageUrl,
      name,
      description,
    };
  }
}
