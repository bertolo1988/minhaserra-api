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
