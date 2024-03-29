import { CreateProductDto, CreateProductModel } from './products.types';

export class ProductsMapper {
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
