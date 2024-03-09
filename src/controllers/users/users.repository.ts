import { Knex } from 'knex';
import _ from 'lodash';
import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { PasswordUtils } from '../../utils/password-utils';
import { UsersMapper } from './users.mapper';
import { UserDto, UserModel } from './users.types';

export class UsersRepository {
  static async createOne(dto: UserDto): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data = UsersMapper.mapUserDtoToCreateUserModel(dto);
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
      .update(
        CaseConverter.objectKeysCamelToSnake({
          isEmailVerified: true,
          updatedAt: new Date(),
        }),
        ['id', 'is_email_verified'],
      )
      .transacting(transaction);
    return updateResult;
  }

  static async getByEmail(
    email: string,
    isDeleted?: boolean,
    isActive?: boolean,
  ): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const where = _.omitBy(
      {
        email,
        is_deleted: isDeleted,
        is_active: isActive,
      },
      _.isNil,
    );
    const result = await knex<UserModel>('users').where(where).first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as UserModel;
  }

  static async getVerifiedActiveUserByEmail(
    email: string,
  ): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const where = _.omitBy(
      {
        email,
        is_active: true,
        is_deleted: false,
        is_email_verified: true,
      },
      _.isNil,
    );
    const result = await knex<UserModel>('users').where(where).first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as UserModel;
  }

  static async updatePassword(
    password: string,
    userId: string,
    transaction: Knex.Transaction,
  ): Promise<
    {
      id: string;
      password_hash: string;
      password_salt: string;
      password_iterations: number;
    }[]
  > {
    const knex = await getDatabaseInstance();
    const { hash, salt, iterations } = PasswordUtils.hashPassword(password);
    const updateResult = await knex('users')
      .where('id', userId)
      .update(
        CaseConverter.objectKeysCamelToSnake({
          passwordHash: hash,
          passwordSalt: salt,
          passwordIterations: iterations,
          updatedAt: new Date(),
        }),
        [
          'id',
          'password_hash',
          'password_salt',
          'password_iterations',
          'updated_at',
        ],
      )
      .transacting(transaction);
    return updateResult;
  }
}
