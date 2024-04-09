import _ from 'lodash';

import { getDatabaseInstance } from '../../knex-database';
import { PaginationParams } from '../../types';
import { CaseConverter } from '../../utils/case-converter';
import { ProductsMapper } from './products.mapper';
import {
  CreateProductDto,
  CreateProductModel,
  ProductModel,
  ProductsSearchDto,
  UpdateProductDto,
} from './products.types';

export class ProductsRepository {
  static async searchProducts(
    searchParameters: ProductsSearchDto,
    paginationParams: PaginationParams,
  ): Promise<ProductModel[]> {
    const knex = await getDatabaseInstance();

    // TODO continue here - impleement search params conditionally like this:
    // have to select default sorting order, don't know what it should be

    /*     const getFilteredItems = (searchCriteria) => knex('items')
    .where((qb) => {
      if (searchCriteria.searchTerm) {
        qb.where('items.itemName', 'like', `%${searchCriteria.searchTerm}%`);
      }
  
      if (searchCriteria.itemType) {
        qb.orWhere('items.itemType', '=', searchCriteria.itemType);
      }
  
      if (searchCriteria.category) {
        qb.orWhere('items.category', '=', searchCriteria.category);
      }
    }); */

    const query = `SELECT * FROM products where search_document @@ plainto_tsquery(:text) AND country_code = :countryCode limit :limit offset :offset`;
    console.log(1111, query);

    const queryParams = _.omitBy(
      {
        text: searchParameters.text,
        countryCode: searchParameters.countryCode,
        offset: paginationParams.offset,
        limit: paginationParams.limit,
      },
      _.isNil,
    );

    const results = await knex.raw(query, queryParams);
    console.log(111, results);

    if (results != null && results.rows != null) {
      return results.rows;
    } else {
      throw new Error(
        `Error while searching products with searchParams: ${JSON.stringify(searchParameters)} paginationParams: ${JSON.stringify(paginationParams)}`,
      );
    }
  }

  static async updateProductByIdAndUserId(
    userId: string,
    id: string,
    dto: UpdateProductDto & { nameEnglish: string; descriptionEnglish: string },
  ): Promise<{ id: string }[]> {
    const knex = await getDatabaseInstance();
    const updateData = _.omitBy(
      {
        ...dto,
        updatedAt: new Date(),
      },
      _.isNil,
    );
    const updateResult = await knex('products')
      .where(
        CaseConverter.objectKeysCamelToSnake({
          id,
          userId,
          isDeleted: false,
        }),
      )
      .update(CaseConverter.objectKeysCamelToSnake(updateData), [
        'id',
        'updated_at',
      ]);
    return updateResult;
  }

  static async getProductsByUserId(
    userId: string,
    isDeleted = false,
  ): Promise<ProductModel[]> {
    const knex = await getDatabaseInstance();
    const where = {
      userId,
      isDeleted,
    };

    const result: Record<string, unknown>[] = await knex<ProductModel>(
      'products',
    )
      .where(CaseConverter.objectKeysCamelToSnake(where))
      .select()
      .orderBy('name', 'asc');

    return result.map(
      (r) => CaseConverter.objectKeysSnakeToCamel(r) as ProductModel,
    );
  }

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
        ['id', 'is_deleted', 'updated_at'],
      );
    return updateResult;
  }

  static async createOne(
    userId: string,
    dto: CreateProductDto & { nameEnglish: string; descriptionEnglish: string },
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
