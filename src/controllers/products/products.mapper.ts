import {
  CreateProductDto,
  CreateProductModel,
  ProductModel,
  PublicProductModel,
} from './products.types';

export class ProductsMapper {
  static mapProductModeltoPublicProductModel(
    product: ProductModel,
  ): PublicProductModel {
    return {
      id: product.id,
      userId: product.userId,
      category: product.category,
      subCategory: product.subCategory,
      name: product.name,
      description: product.description,
      countryCode: product.countryCode,
      region: product.region,
      avaliableQuantity: product.avaliableQuantity,
      price: parseInt(product.price.toString()),
      isApproved: product.isApproved,
      isDeleted: product.isDeleted,
      isOnSale: product.isOnSale,
      updatedAt: product.updatedAt,
      createdAt: product.createdAt,
    };
  }

  static mapCreateProductDtoToCreateProductModel(
    userId: string,
    dto: CreateProductDto,
  ): CreateProductModel {
    return {
      userId: userId,
      category: dto.category,
      subCategory: dto.subCategory,
      name: dto.name,
      description: dto.description,
      countryCode: dto.countryCode,
      region: dto.region,
      avaliableQuantity: dto.availableQuantity,
      price: dto.price,
      isOnSale: dto.isOnSale,
    };
  }
}
