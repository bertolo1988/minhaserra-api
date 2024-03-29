import { Knex } from 'knex';

import { getDatabaseInstance, isUpdateSuccessfull } from '../../knex-database';
import { NotFoundError } from '../../types/errors';
import { CaseConverter } from '../../utils/case-converter';
import { UsersRepository } from '../users/users.repository';
import {
  ContactVerificationDto,
  ContactVerificationModel,
  CreateContactVerificationModel,
} from './contact-verifications.types';

function mapContactVerificationDtoToCreateContactVerificationModel(
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
    const data = mapContactVerificationDtoToCreateContactVerificationModel(dto);
    const result = (await knex('contact_verifications').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: string;
    }[];
    return result[0];
  }

  static async getById(id: string): Promise<ContactVerificationModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<ContactVerificationModel>('contact_verifications')
      .where('id', id)
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as ContactVerificationModel;
  }

  static async getByIdAndExpiration(
    id: string,
    expiresAt = new Date(),
  ): Promise<ContactVerificationModel | null> {
    const knex = await getDatabaseInstance();
    const result = await knex<ContactVerificationModel>('contact_verifications')
      .where('id', id)
      .andWhere('expires_at', '>', expiresAt)
      .andWhere('verified_at', null)
      .first();
    return CaseConverter.objectKeysSnakeToCamel(
      result as Record<string, unknown>,
    ) as ContactVerificationModel;
  }

  static async setVerifiedAt(
    id: string,
    verifiedAt: Date,
    transaction: Knex.Transaction,
  ): Promise<{ id: string; verified_at: string }[]> {
    const knex = await getDatabaseInstance();
    const updateResult: { id: string; verified_at: string }[] =
      await knex<ContactVerificationModel>('contact_verifications')
        .where('id', id)
        .update(
          CaseConverter.objectKeysCamelToSnake({
            verifiedAt,
            updatedAt: new Date(),
          }),
          ['id', 'verified_at'],
        )
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
        if (isUpdateSuccessfull(firstUpdate) === false) {
          throw new NotFoundError(
            `Failed to set contact verification with id ${contactVerification.id} as verified`,
          );
        }
        const secondUpdate = await UsersRepository.setEmailVerified(
          contactVerification.userId,
          contactVerification.contact,
          transaction,
        );
        if (isUpdateSuccessfull(secondUpdate) === false) {
          throw new NotFoundError(
            `Failed to set email verified in user with id ${contactVerification.id} and email ${contactVerification.contact}`,
          );
        }
      });
    } catch (err) {
      console.error(err);
      throw err;
    }
  }
}
