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
  static async createOne(dto: UserDto): Promise<{ id: number }> {
    const knex = await getDatabaseInstance();
    const data = mapUserDtoToCreateUserModel(dto);
    const result = (await knex('users').insert(
      CaseConverter.objectKeysCamelToSnake(data),
      ['id'],
    )) as {
      id: number;
    }[];
    return result[0];
  }
}
