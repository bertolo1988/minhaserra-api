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
  organizationName?: string;
  firstName: string;
  lastName: string;
  password: string;
  termsVersion: number;
};

export const PasswordSchema = {
  type: 'string',
  nullable: false,
  minLength: 8,
  maxLength: 64,
  format: 'password',
  errorMessage: `'password' must be have at least 8 characters and at most 64 characters, and must contain at least one uppercase letter, one lowercase letter, one digit, and one special character`,
};

export const UserDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: false, format: 'email' },
    role: {
      type: 'string',
      enum: [UserRole.BUYER, UserRole.SELLER],
      nullable: false,
      errorMessage: `'role' must be either "buyer" or "seller"`,
    },
    organizationName: { type: 'string', nullable: true },
    firstName: { type: 'string', nullable: false },
    lastName: { type: 'string', nullable: false },
    password: PasswordSchema,
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
  id: string;
  email: string;
  role: UserRole;
  organizationName?: string;
  firstName: string;
  lastName?: string;
  isEmailVerified: boolean;
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
  organizationName?: string;
  termsVersion?: number;
};

export const UpdateUserDtoSchema = {
  type: 'object',
  properties: {
    organizationName: { type: 'string', nullable: true },
    firstName: { type: 'string', nullable: true },
    lastName: { type: 'string', nullable: true },
    termsVersion: { type: 'number', nullable: true },
  },
  required: [],
  additionalProperties: false,
};
