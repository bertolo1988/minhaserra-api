import { Knex } from 'knex';
import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { PasswordUtils } from '../../utils/password-utils';
import { CreateUserModel, UserDto, UserModel } from './users.types';

function mapUserDtoToCreateUserModel(dto: UserDto): CreateUserModel {
  const { hash, salt, iterations } = PasswordUtils.hashPassword(dto.password);
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

  static async getById(id: string): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<UserModel>('users').where('id', id).first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as UserModel;
  }

  static async setEmailVerified(
    userId: string,
    email: string,
    transaction: Knex.Transaction,
  ): Promise<{ id: string; is_email_verified: boolean }[]> {
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

  static async getByEmail(email: string): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<UserModel>('users').where('email', email).first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as UserModel;
  }
}
