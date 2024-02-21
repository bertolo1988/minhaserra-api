import { getDatabaseInstance } from '../../knex-database';
import { CaseConverter } from '../../utils/case-converter';
import {
  ContactVerificationDto,
  ContactVerificationModel,
  CreateContactVerificationModel,
} from './contact-verifications.types';

function mapUserDtoToCreateUserModel(
  dto: ContactVerificationDto,
): CreateContactVerificationModel {
  return {
    userId: dto.userId,
    type: dto.type,
    contact: dto.contact,
    token: dto.token,
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

  static async getById(id: string): Promise<ContactVerificationModel> {
    const knex = await getDatabaseInstance();
    const result = await knex<ContactVerificationModel>('contact_verifications')
      .where({
        id,
      })
      .first();
    return result as ContactVerificationModel;
  }
}
