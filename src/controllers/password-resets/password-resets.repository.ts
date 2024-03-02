import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { CreatePasswordResetModel } from './password-resets.types';

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
}
