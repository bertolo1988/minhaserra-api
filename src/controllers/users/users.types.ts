import { BirthDateSchema, PasswordSchema } from '../../schemas/shared-schemas';

export enum UserState {
  UNVERIFIED = 'unverified',
  VERIFIED = 'verified',
  INACTIVE = 'inactive',
  ACTIVE = 'active',
  DELETED = 'deleted',
}

export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  BUYER = 'buyer',
  SELLER = 'seller',
}

export type UserDto = {
  email: string;
  role: UserRole;
  firstName: string;
  lastName: string;
  birthDate: string;
  password: string;
  termsVersion: number;
};

export const UserDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: false, format: 'email' },
    role: {
      type: 'string',
      enum: [UserRole.BUYER, UserRole.SELLER],
      nullable: false,
    },
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: false },
    birthDate: BirthDateSchema,
    password: PasswordSchema,
    termsVersion: { type: 'number', nullable: false },
  },
  required: [
    'email',
    'role',
    'firstName',
    'lastName',
    'birthDate',
    'password',
    'termsVersion',
  ],
  additionalProperties: false,
};

export type UserModel = {
  id: string;
  email: string;
  role: UserRole;
  firstName: string;
  lastName?: string;
  birthDate: Date;
  isEmailVerified: boolean;
  isActive: boolean;
  isDeleted: boolean;
  passwordHash: string;
  passwordSalt: string;
  passwordIterations: number;
  termsVersion: number;
  lastLoginAt?: Date;
  invoiceName?: string;
  invoiceTaxNumber?: string;
  invoiceAddressId?: string;
  shippingAddressId?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateUserModel = Omit<
  UserModel,
  | 'id'
  | 'isEmailVerified'
  | 'isActive'
  | 'isDeleted'
  | 'createdAt'
  | 'updatedAt'
>;

export type LoginDto = {
  email: string;
  password: string;
};

export const LoginDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: false },
    password: { type: 'string', nullable: false },
  },
  required: ['email', 'password'],
  additionalProperties: false,
};

export type PresentedUserModel = Omit<
  UserModel,
  | 'passwordHash'
  | 'passwordSalt'
  | 'passwordIterations'
  | 'isActive'
  | 'isDeleted'
>;

export type UpdateUserDto = {
  firstName?: string;
  lastName?: string;
  birthDate?: string;
  termsVersion?: number;
  invoiceName?: string;
  invoiceTaxNumber?: string;
  invoiceAddressId?: string;
  shippingAddressId?: string;
};

export const UpdateUserDtoSchema = {
  type: 'object',
  properties: {
    firstName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    birthDate: BirthDateSchema,
    termsVersion: { type: 'number', nullable: true },
    invoiceName: { type: 'string', nullable: true },
    invoiceTaxNumber: { type: 'string', nullable: true },
    invoiceAddressId: {
      type: 'string',
      nullable: true,
      format: 'uuid',
    },
    shippingAddressId: {
      type: 'string',
      nullable: true,
      format: 'uuid',
    },
  },
  required: [],
  additionalProperties: false,
};
