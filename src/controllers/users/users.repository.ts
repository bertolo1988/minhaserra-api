import { Knex, QueryBuilder } from 'knex';
import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { hashPassword } from '../../utils/password-utils';
import { CreateUserModel, UserDto } from './users.types';

function mapUserDtoToCreateUserModel(dto: UserDto): CreateUserModel {
  const { hash, salt, iterations } = hashPassword(dto.password);
  return {
    email: dto.email,
    role: dto.role,
    organizationName: dto.organizationName,
    firstName: dto.firstName,
    lastName: dto.lastName,
    passwordHash: hash,
    passwordSalt: salt,
    passwordIterations: iterations,
    termsVersion: dto.termsVersion,
  };
}

export class UsersRepository {
  static async createOne(dto: UserDto): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data = mapUserDtoToCreateUserModel(dto);
    const result = (await knex('users').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async setEmailVerified(
    userId: string,
    email: string,
    transaction: Knex.Transaction,
  ): Promise<QueryBuilder> {
    const knex = await getDatabaseInstance();
    const updateResult = await knex('users')
      .where({
        id: userId,
        email,
      })
      .update(CaseConverter.objectKeysCamelToSnake({ isEmailVerified: true }), [
        'id',
        'is_email_verified',
      ])
      .transacting(transaction);
    return updateResult;
  }
}
