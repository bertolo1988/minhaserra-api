import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { ProductImagesMapper } from './product-images.mapper';
import {
  CreateProductImageDto,
  CreateProductImageModel,
  ProductImageModel,
  PublicProductImageModel,
} from './products.types';

const TABLE_NAME = 'product_images';

export class ProductImagesRepository {
  static async deleteProductImageById(id: string): Promise<boolean> {
    const knex = await getDatabaseInstance();
    const result = await knex(TABLE_NAME).where({ id }).delete();
    return result > 0;
  }

  static async getProductImageByProductIdAndImageId(
    productId: string,
    imageId: string,
  ): Promise<ProductImageModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<PublicProductImageModel>(TABLE_NAME)
      .where(CaseConverter.objectKeysCamelToSnake({ productId, id: imageId }))
      .first();
    if (!result) return null;
    return CaseConverter.objectKeysSnakeToCamel(result) as ProductImageModel;
  }

  static async createProductImageWithId(
    id: string,
    productId: string,
    imageUrl: string,
    dto: CreateProductImageDto,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data: CreateProductImageModel =
      ProductImagesMapper.mapCreateProductImageDtoToProductImageModel(
        id,
        productId,
        imageUrl,
        dto,
      );
    const result = (await knex(TABLE_NAME).insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async countImagesByProductId(productId: string): Promise<number> {
    const knex = await getDatabaseInstance();
    const result = (await knex(TABLE_NAME)
      .count('id')
      .where(CaseConverter.objectKeysCamelToSnake({ productId }))
      .first()) as { count: string };
    return parseInt(result.count);
  }

  static async getProductImagesByProductId(
    productId: string,
  ): Promise<PublicProductImageModel[]> {
    const knex = await getDatabaseInstance();
    const result = await knex<PublicProductImageModel>(TABLE_NAME)
      .select(['id', 'url', 'description'])
      .where(CaseConverter.objectKeysCamelToSnake({ productId }));
    if (!result) return [];
    return result.map(
      (r) => CaseConverter.objectKeysSnakeToCamel(r) as PublicProductImageModel,
    );
  }
}
