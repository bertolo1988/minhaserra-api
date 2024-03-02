import { Knex } from 'knex';
import { getDatabaseInstance, isUpdateSuccessfull } from '../../knex-database';
import { NotFoundError } from '../../types/errors';
import { CaseConverter } from '../../utils/case-converter';
import { UsersRepository } from '../users';
import {
  CreatePasswordResetModel,
  PasswordResetModel,
} from './password-resets.types';

function mapPasswordResetDtoToPasswordResetModel(
  userId: string,
  token: string,
  expiresAt: Date,
): CreatePasswordResetModel {
  return {
    token,
    userId,
    expiresAt,
  };
}

export class PasswordResetsRepository {
  static async createOne(
    userId: string,
    token: string,
    expiresAt: Date,
  ): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data = mapPasswordResetDtoToPasswordResetModel(
      userId,
      token,
      expiresAt,
    );
    const result = (await knex('password_resets').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async getByTokenAndExpiration(
    token: string,
    expiresAt: Date,
  ): Promise<PasswordResetModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<PasswordResetModel>('password_resets')
      .where('token', token)
      .andWhere('expires_at', '>', expiresAt)
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as PasswordResetModel;
  }

  static async setUsedAt(
    id: string,
    usedAt: Date,
    transaction: Knex.Transaction,
  ): Promise<{ id: string; used_at: Date }[]> {
    const knex = await getDatabaseInstance();
    const updateResult: { id: string; used_at: Date }[] = await knex(
      'password_resets',
    )
      .where('id', id)
      .update(
        CaseConverter.objectKeysCamelToSnake({ usedAt, updatedAt: usedAt }),
        ['id', 'used_at', 'updated_at'],
      )
      .transacting(transaction);
    return updateResult;
  }

  static async updateUserPassword(
    password: string,
    passwordReset: PasswordResetModel,
  ) {
    const now = new Date();
    const knex = await getDatabaseInstance();
    try {
      await knex.transaction(async (transaction) => {
        const firstUpdate = await PasswordResetsRepository.setUsedAt(
          passwordReset.id,
          now,
          transaction,
        );
        if (isUpdateSuccessfull(firstUpdate) === false) {
          throw new NotFoundError(
            `Failed to set password reset with id ${passwordReset.id} as used`,
          );
        }
        const secondUpdate = await UsersRepository.updatePassword(
          password,
          passwordReset.userId,
          transaction,
        );
        if (isUpdateSuccessfull(secondUpdate) === false) {
          throw new NotFoundError(
            `Failed to update password for user with id ${passwordReset.userId}`,
          );
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
