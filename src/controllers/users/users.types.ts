import { JSONSchemaType } from 'ajv';

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  BUYER = 'buyer',
  SELLER = 'seller',
}

export type UserDto = {
  email: string;
  role: UserRole;
  organizationName?: string;
  firstName: string;
  lastName: string;
  password: string;
  termsVersion: number;
};

export const UserDtoSchema: JSONSchemaType<UserDto> = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: false },
    role: {
      type: 'string',
      enum: [UserRole.BUYER, UserRole.SELLER],
      nullable: false,
    },
    organizationName: { type: 'string', nullable: true },
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: false },
    password: { type: 'string', nullable: false },
    termsVersion: { type: 'number', nullable: false },
  },
  required: [
    'email',
    'role',
    'firstName',
    'lastName',
    'password',
    'termsVersion',
  ],
  additionalProperties: false,
};

export type UserModel = {
  id: number;
  email: string;
  role: UserRole;
  organizationName?: string;
  firstName: string;
  lastName?: string;
  isActive: boolean;
  isDeleted: boolean;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  termsVersion: number;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserModel = Omit<
  UserModel,
  'id' | 'isActive' | 'isDeleted' | 'createdAt' | 'updatedAt'
>;
