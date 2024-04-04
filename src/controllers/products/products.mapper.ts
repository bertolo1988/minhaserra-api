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
    dto: CreateProductDto,
  ): CreateProductModel {
    return {
      userId,
      category: dto.category,
      subCategory: dto.subCategory,
      name: dto.name,
      // TODO: change this to the correct value
      nameEnglish: '',
      description: dto.description,
      // TODO: change this to the correct value
      descriptionEnglish: '',
      countryCode: dto.countryCode,
      region: dto.region,
      avaliableQuantity: dto.availableQuantity,
      price: dto.price,
      isOnSale: dto.isOnSale,
    };
  }
}
