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

// cheaper first
const DEFAULT_PRODUCT_SEARCH_ORDER_BY_FIELD = 'price';
const DEFAULT_PRODUCT_SEARCH_ORDER_DIRECTION = SortDirection.ASC;

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

    const results = await knex<PublicProductModel>({ p: 'products' })
      .select({
        id: 'p.id',
        userId: 'p.user_id',
        category: 'p.category',
        subCategory: 'p.sub_category',
        language: 'p.language',
        name: 'p.name',
        nameEnglish: 'p.name_english',
        description: 'p.description',
        descriptionEnglish: 'p.description_english',
        countryCode: 'p.country_code',
        region: 'p.region',
        availableQuantity: 'p.available_quantity',
        price: 'p.price',
        createdAt: 'p.created_at',
        updatedAt: 'p.updated_at',
        images: knex.raw(
          'array(select url from product_images pi2 where pi2.product_id = p.id order by created_at desc)',
        ),
      })
      .where((qb) => {
        if (searchParameters.text) {
          qb.whereRaw(`p.search_document @@ plainto_tsquery(:text)`, {
            text: searchParameters.text,
          });
        }

        if (searchParameters.category) {
          qb.andWhere('p.category', searchParameters.category);
        }

        if (searchParameters.subCategory) {
          qb.andWhere('p.sub_category', searchParameters.subCategory);
        }

        if (searchParameters.countryCode) {
          qb.andWhere('p.country_code', searchParameters.countryCode);
        }

        if (searchParameters.region) {
          qb.andWhere('p.region', searchParameters.region);
        }

        if (searchParameters.minPrice) {
          qb.andWhere('p.price', '>=', parseInt(searchParameters.minPrice));
        }

        if (searchParameters.maxPrice) {
          qb.andWhere('p.price', '<=', parseInt(searchParameters.maxPrice));
        }
      })
      .offset(paginationParams.offset)
      .limit(paginationParams.limit)
      .orderBy(orderBy, orderDirection);

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
