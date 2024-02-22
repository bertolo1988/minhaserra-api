import { Knex, QueryBuilder } from 'knex';
import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import { UsersRepository } from '../users/users.repository';
import {
  ContactVerificationDto,
  ContactVerificationModel,
  CreateContactVerificationModel,
} from './contact-verifications.types';
import { first } from 'lodash';

function mapUserDtoToCreateUserModel(
  dto: ContactVerificationDto,
): CreateContactVerificationModel {
  return {
    userId: dto.userId,
    type: dto.type,
    contact: dto.contact,
    expiresAt: dto.expiresAt,
  };
}

export class ContactVerificationsRepository {
  static async createOne(dto: ContactVerificationDto): Promise<{ id: string }> {
    const knex = await getDatabaseInstance();
    const data = mapUserDtoToCreateUserModel(dto);
    const result = (await knex('contact_verifications').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async getByIdAndExpiration(
    id: string,
    expiresAt = new Date(),
  ): Promise<ContactVerificationModel> {
    const knex = await getDatabaseInstance();
    const result = await knex<ContactVerificationModel>('contact_verifications')
      .where('id', id)
      .andWhere('expires_at', '>', expiresAt)
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as ContactVerificationModel;
  }

  static async setVerifiedAt(
    id: string,
    verifiedAt: Date,
    transaction: Knex.Transaction,
  ): Promise<QueryBuilder> {
    const knex = await getDatabaseInstance();
    const updateResult: QueryBuilder = await knex<ContactVerificationModel>(
      'contact_verifications',
    )
      .where('id', id)
      .update(CaseConverter.objectKeysCamelToSnake({ verifiedAt }), [
        'id',
        'verified_at',
      ])
      .transacting(transaction);
    return updateResult;
  }

  static async setUserEmailVerified(
    contactVerification: ContactVerificationModel,
  ): Promise<void> {
    const now = new Date();
    const knex = await getDatabaseInstance();
    try {
      await knex.transaction(async (transaction) => {
        const firstUpdate = await ContactVerificationsRepository.setVerifiedAt(
          contactVerification.id,
          now,
          transaction,
        );
        const secondUpdate = await UsersRepository.setEmailVerified(
          contactVerification.userId,
          contactVerification.contact,
          transaction,
        );
        console.log(111, firstUpdate, secondUpdate);
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
