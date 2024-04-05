import {
  CreateProductDto,
  CreateProductModel,
  ProductModel,
  OwnerProductModel,
} from './products.types';

export class ProductsMapper {
  static mapProductModeltoOwnerProductModel(
    product: ProductModel,
  ): OwnerProductModel {
    return {
      id: product.id,
      userId: product.userId,
      category: product.category,
      subCategory: product.subCategory,
      language: product.language,
      name: product.name,
      nameEnglish: product.nameEnglish,
      description: product.description,
      descriptionEnglish: product.descriptionEnglish,
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
    dto: CreateProductDto & { nameEnglish: string; descriptionEnglish: string },
  ): CreateProductModel {
    return {
      userId,
      category: dto.category,
      subCategory: dto.subCategory,
      language: dto.language,
      name: dto.name,
      nameEnglish: dto.nameEnglish,
      description: dto.description,
      descriptionEnglish: dto.descriptionEnglish,
      countryCode: dto.countryCode,
      region: dto.region,
      avaliableQuantity: dto.availableQuantity,
      price: dto.price,
      isOnSale: dto.isOnSale,
    };
  }
}
