import _ from 'lodash';
import { UsersMapper } from '../../../src/controllers/users/users.mapper';
import {
  PresentedUserModel,
  UserDto,
  UserModel,
  UserRole,
} from '../../../src/controllers/users/users.types';
import { verifiedUserSeller } from '../../seeds/multiple-users.seed';

describe('UsersMapper', () => {
  describe('mapUserDtoToCreateUserModel', () => {
    test('should return object with hash, salt and iterations', () => {
      const dto: UserDto = {
        email: 'a@mail.com',
        role: UserRole.BUYER,
        firstName: 'a',
        lastName: 'a',
        password: 'a',
        termsVersion: 1,
      };
      const { passwordHash, passwordIterations, passwordSalt } =
        UsersMapper.mapUserDtoToCreateUserModel(dto);

      expect(_.isString(passwordHash)).toBe(true);
      expect(_.isString(passwordSalt)).toBe(true);
      expect(_.isNumber(passwordIterations)).toBe(true);
    });
  });

  describe('mapUserModelToPresentedUserModel', () => {
    test('should return object with id', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect(presentedUserModel.id).toBe(model.id);
    });

    test('should return object with email', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect(presentedUserModel.email).toBe(model.email);
    });

    test('should return object without passwordHash', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect((presentedUserModel as any).passwordHash).toBeUndefined();
    });

    test('should return object without passwordSalt', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect((presentedUserModel as any).passwordSalt).toBeUndefined();
    });

    test('should return object without passwordIterations', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect((presentedUserModel as any).passwordIterations).toBeUndefined();
    });

    test('should return object without isDeleted', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect((presentedUserModel as any).isDeleted).toBeUndefined();
    });

    test('should return object without isActive', () => {
      const model: UserModel = verifiedUserSeller;
      const presentedUserModel: PresentedUserModel =
        UsersMapper.mapUserModelToPresentedUserModel(model);
      expect((presentedUserModel as any).isActive).toBeUndefined();
    });
  });
});
