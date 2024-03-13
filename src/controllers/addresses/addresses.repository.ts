import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { AddressesMapper } from './addresses.mapper';
import { CreateAddressDto } from './addresses.types';

export class AddressesRepository {
  static async countAddressesByUserId(userId: string): Promise<number> {
    const knex = await getDatabaseInstance();
    const result = (await knex('addresses')
      .count('id')
      .where(CaseConverter.objectKeysCamelToSnake({ userId }))
      .first()) as { count: string };
    return parseInt(result.count);
  }

  static async createAddress(
    userId: string,
    dto: CreateAddressDto,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data = AddressesMapper.mapCreateAddressDtoToAddressModel(userId, dto);
    const result = (await knex('addresses').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }
}
