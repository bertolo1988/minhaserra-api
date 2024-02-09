import { getDatabaseInstance } from '../../knex-database';

export class UsersRepository {
  static async createOne(dto: any): Promise<{ id: number }> {
    return { id: 1 };
  }
}
