import _ from 'lodash';

import {
  CreateProductImageDto,
  CreateProductImageModel,
} from './products.types';

export class ProductImagesMapper {
  static mapCreateProductImageDtoToProductImageModel(
    id: string,
    productId: string,
    imageUrl: string,
    dto: CreateProductImageDto,
  ): CreateProductImageModel {
    const result = {
      id,
      productId,
      url: imageUrl,
      name: dto.name,
      description: dto.description,
    };
    return _.omitBy(result, _.isNil) as CreateProductImageModel;
  }
}
