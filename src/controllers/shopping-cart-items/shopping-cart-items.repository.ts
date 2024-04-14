import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { ShoppingCartItemsMapper } from './shopping-cart-items.mapper';
import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemModel,
  ShoppingCartItemModel,
} from './shopping-cart-items.types';

const TABLE_NAME = 'shopping_cart_items';

export class ShoppingCartItemsRepository {
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
  }
}
