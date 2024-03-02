import { Knex } from 'knex';
import _ from 'lodash';
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

  static async getByEmail(
    email: string,
    isDeleted?: boolean,
  ): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const where = _.omitBy(
      {
        email,
        is_deleted: isDeleted,
      },
      _.isNil,
    );
    const result = await knex<UserModel>('users').where(where).first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as UserModel;
  }

  static async getVerifiedUserByEmail(
    email: string,
  ): Promise<UserModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<UserModel>('users')
      .where('email', email)
      .andWhere('is_email_verified', true)
      .first();
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
