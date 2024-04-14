import {
  CreateShoppingCartItemDto,
  CreateShoppingCartItemModel,
} from './shopping-cart-items.types';

export class ShoppingCartItemsMapper {
  static mapCreateItemDtoToCreateItemModel(
    userId: string,
    dto: CreateShoppingCartItemDto,
  ): CreateShoppingCartItemModel {
    return {
      userId,
      productId: dto.productId,
      quantity: dto.quantity,
    };
  }
}
