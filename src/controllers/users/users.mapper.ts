import _ from 'lodash';
import { PasswordUtils } from '../../utils/password-utils';
import {
  CreateUserModel,
  PresentedUserModel,
  UserDto,
  UserModel,
} from './users.types';

export class UsersMapper {
  static mapUserDtoToCreateUserModel(dto: UserDto): CreateUserModel {
    const { hash, salt, iterations } = PasswordUtils.hashPassword(dto.password);
    return {
      email: dto.email,
      role: dto.role,
      firstName: dto.firstName,
      lastName: dto.lastName,
      passwordHash: hash,
      passwordSalt: salt,
      passwordIterations: iterations,
      termsVersion: dto.termsVersion,
    };
  }

  static mapUserModelToPresentedUserModel(
    model: UserModel,
  ): PresentedUserModel {
    return _.omit(model, [
      'passwordHash',
      'passwordSalt',
      'passwordIterations',
      'isDeleted',
      'isActive',
    ]);
  }
}
