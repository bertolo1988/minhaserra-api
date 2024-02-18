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

export const createUserDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    role: { enum: [UserRole.BUYER, UserRole.SELLER] },
    organizationName: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    password: { type: 'string' },
    termsVersion: { type: 'number' },
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
