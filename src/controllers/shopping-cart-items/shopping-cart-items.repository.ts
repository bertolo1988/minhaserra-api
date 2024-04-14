import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { ShoppingCartItemsMapper } from './shopping-cart-items.mapper';
import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemModel,
} from './shopping-cart-items.types';

export class ShoppingCartItemsRepository {
  static async createOne(
    userId: string,
    dto: CreateShoppingCartItemDto,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data: CreateShoppingCartItemModel =
      ShoppingCartItemsMapper.mapCreateItemDtoToCreateItemModel(userId, dto);

    const result = (await knex('shopping_cart_items').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];

    return result[0];
  }
}
