import CONSTANTS from '../../constants';

export type CreateShoppingCartItemModel = Omit<
  ShoppingCartItemModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type PublicShoppingCartItem = ShoppingCartItemModel & {
  productName: string;
  productPrice: number;
};

export type ShoppingCartItemModel = {
  id: string;
  userId: string;
  productId: string;
  quantity: number;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateShoppingCartItemDto = {
  productId: string;
  quantity: number;
};

export const CreateShoppingCartItemDtoSchema = {
  type: 'object',
  properties: {
    quantity: {
      nullable: false,
      type: 'number',
      minimum: 1,
      maximum: CONSTANTS.MAX_AVAILABLE_QUANTITY,
    },
    productId: {
      nullable: false,
      type: 'string',
      format: 'uuid',
    },
  },
  required: ['quantity', 'productId'],
  additionalProperties: false,
};

export type PatchShoppingCartItemQuantityDto = {
  quantity: number;
};

export const PatchShoppingCartItemQuantitySchema = {
  type: 'object',
  properties: {
    quantity: {
      nullable: false,
      type: 'number',
      minimum: 1,
      maximum: CONSTANTS.MAX_AVAILABLE_QUANTITY,
    },
  },
  required: ['quantity'],
  additionalProperties: false,
};
