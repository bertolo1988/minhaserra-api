import { PG_ERROR } from 'pg-error-codes-ts/lib';

import { getDatabaseInstance } from '../../knex-database';
import { ConflictError, DatabaseError } from '../../types/errors';
import { CaseConverter } from '../../utils/case-converter';
import { ShoppingCartItemsMapper } from './shopping-cart-items.mapper';
import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemModel,
  ShoppingCartItemModel,
} from './shopping-cart-items.types';

const TABLE_NAME = 'shopping_cart_items';

export class ShoppingCartItemsRepository {
  static async updateQuantity(
    userId: string,
    itemId: string,
    quantity: number,
  ): Promise<{ id: string; quantity: number; updated_at: Date }[]> {
    const knex = await getDatabaseInstance();
    const result = await knex(TABLE_NAME)
      .where(CaseConverter.objectKeysCamelToSnake({ userId, id: itemId }))
      .update(
        CaseConverter.objectKeysCamelToSnake({
          quantity,
          updatedAt: new Date(),
        }),
        ['id', 'quantity', 'updated_at'],
      );
    return result;
  }

  static async deleteOne(
    userId: string,
    id: string,
  ): Promise<{ id: string }[]> {
    const knex = await getDatabaseInstance();
    const result = (await knex(TABLE_NAME)
      .where(CaseConverter.objectKeysCamelToSnake({ id, userId }))
      .del(['id'])) as { id: string }[];
    return result;
  }

  static async getShoppingCartItemsByUserId(userId: string) {
    const knex = await getDatabaseInstance();

    const where = {
      userId,
    };

    const result: Record<string, unknown>[] = await knex<ShoppingCartItemModel>(
      TABLE_NAME,
    )
      .where(CaseConverter.objectKeysCamelToSnake(where))
      .select()
      .orderBy('updated_at', 'desc');

    return result.map(
      (r) => CaseConverter.objectKeysSnakeToCamel(r) as ShoppingCartItemModel,
    );
  }

  static async createOne(
    userId: string,
    dto: CreateShoppingCartItemDto,
  ): Promise<{ id: string }> {
    try {
      const knex = await getDatabaseInstance();
      const data: CreateShoppingCartItemModel =
        ShoppingCartItemsMapper.mapCreateItemDtoToCreateItemModel(userId, dto);

      const result = (await knex(TABLE_NAME).insert(
        CaseConverter.objectKeysCamelToSnake(data),
        ['id'],
      )) as {
        id: string;
      }[];

      return result[0];
    } catch (err: unknown) {
      if (
        DatabaseError.isDatabaseError(err) &&
        (err as DatabaseError).code === PG_ERROR.UNIQUE_VIOLATION
      ) {
        throw new ConflictError(
          `Product with id ${dto.productId} already exists in the shopping cart`,
        );
      }
      throw err;
    }
  }
}
