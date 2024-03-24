import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { ProductImagesMapper } from './product-images.mapper';
import { CreateProductImageModel } from './products.types';

export class ProductImagesRepository {
  static async createProductImage(
    productId: string,
    imageUrl: string,
    name: string,
    description?: string,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data: CreateProductImageModel =
      ProductImagesMapper.mapCreateProductImageDtoToProductImageModel(
        productId,
        imageUrl,
        name,
        description,
      );
    const result = (await knex('product_images').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }
}
