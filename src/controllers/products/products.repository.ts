import { ProductModel } from './products.types';

export class ProductsRepository {
  static async getProductById(
    productId: string,
    userId: string,
    isDeleted = false,
  ): Promise<ProductModel> {
    throw new Error('Method not implemented.');
  }
}
