import _ from 'lodash';

import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { ProductsMapper } from './products.mapper';
import {
  CreateProductDto,
  CreateProductModel,
  ProductModel,
} from './products.types';

export class ProductsRepository {
  static async softDeleteProductByIdAndUserId(
    userId: string,
    id: string,
  ): Promise<{ id: string; is_deleted: boolean }[]> {
    const knex = await getDatabaseInstance();
    const updateResult = await knex('products')
      .where(
        CaseConverter.objectKeysCamelToSnake({
          id,
          userId,
          isDeleted: false,
        }),
      )
      .update(
        CaseConverter.objectKeysCamelToSnake({
          isDeleted: true,
          updatedAt: new Date(),
        }),
        ['id', 'is_deleted'],
      );
    return updateResult;
  }

  static async createOne(
    userId: string,
    dto: CreateProductDto,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data: CreateProductModel =
      ProductsMapper.mapCreateProductDtoToCreateProductModel(userId, dto);
    const result = (await knex('products').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async getProductById(
    id: string,
    isDeleted = false,
  ): Promise<ProductModel | null> {
    const knex = await getDatabaseInstance();
    const where = {
      id,
      isDeleted,
    };
    const result = await knex<ProductModel>('products')
      .where(CaseConverter.objectKeysCamelToSnake(where))
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as ProductModel;
  }

  static async getProductByIdAndUserId(
    id: string,
    userId: string,
    isDeleted = false,
  ): Promise<ProductModel | null> {
    const knex = await getDatabaseInstance();
    const where = _.omitBy(
      {
        id,
        userId,
        isDeleted,
      },
      _.isNil,
    );
    const result = await knex<ProductModel>('products')
      .where(CaseConverter.objectKeysCamelToSnake(where))
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as ProductModel;
  }
}
