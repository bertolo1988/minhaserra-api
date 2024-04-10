import _ from 'lodash';

import { getDatabaseInstance } from '../../knex-database';
import { PaginationParams, SortDirection } from '../../types';
import { CaseConverter } from '../../utils/case-converter';
import { ProductsMapper } from './products.mapper';
import {
  CreateProductDto,
  CreateProductModel,
  ProductModel,
  ProductsSearchDto,
  PublicProductModel,
  UpdateProductDto,
} from './products.types';

const DEFAULT_PRODUCT_SEARCH_ORDER_BY_FIELD = 'price';
const DEFAULT_PRODUCT_SEARCH_ORDER_DIRECTION = SortDirection.DESC;

export class ProductsRepository {
  static async searchProducts(
    searchParameters: ProductsSearchDto,
    paginationParams: PaginationParams,
  ): Promise<PublicProductModel[]> {
    const knex = await getDatabaseInstance();

    const orderBy =
      searchParameters.orderBy != null
        ? searchParameters.orderBy
        : DEFAULT_PRODUCT_SEARCH_ORDER_BY_FIELD;

    const orderDirection =
      searchParameters.orderDirection != null
        ? searchParameters.orderDirection
        : DEFAULT_PRODUCT_SEARCH_ORDER_DIRECTION;

    const results = await knex<PublicProductModel>('products')
      .select({
        id: 'id',
        userId: 'user_id',
        category: 'category',
        subCategory: 'sub_category',
        language: 'language',
        name: 'name',
        nameEnglish: 'name_english',
        description: 'description',
        descriptionEnglish: 'description_english',
        countryCode: 'country_code',
        region: 'region',
        avaliableQuantity: 'avaliable_quantity',
        price: 'price',
        createdAt: 'created_at',
        updatedAt: 'updated_at',
      })
      .where((qb) => {
        if (searchParameters.text) {
          qb.whereRaw(`search_document @@ plainto_tsquery(:text)`, {
            text: searchParameters.text,
          });
        }

        if (searchParameters.category) {
          qb.andWhere('category', searchParameters.category);
        }

        if (searchParameters.subCategory) {
          qb.andWhere('sub_category', searchParameters.subCategory);
        }

        if (searchParameters.countryCode) {
          qb.andWhere('country_code', searchParameters.countryCode);
        }

        if (searchParameters.region) {
          qb.andWhere('region', searchParameters.region);
        }

        if (searchParameters.minPrice) {
          qb.andWhere('price', '>=', parseInt(searchParameters.minPrice));
        }

        if (searchParameters.maxPrice) {
          qb.andWhere('price', '<=', parseInt(searchParameters.maxPrice));
        }
      })
      .offset(paginationParams.offset)
      .limit(paginationParams.limit)
      .orderBy(orderBy, orderDirection);

    // TODO: left join product images

    return results;
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
