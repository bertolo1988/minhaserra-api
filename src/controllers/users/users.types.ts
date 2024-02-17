export enum UserRole {
  ADMIN = 'admin',
  MODERATOR = 'moderator',
  BUYER = 'buyer',
  SELLER = 'seller',
}

export type UserDto = {
  email: string;
  role: UserRole;
  organizationName: string;
  firstName: string;
  lastName: string;
  passwordHash: string;
  termsVersion: number;
};

export const createUserDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string' },
    role: { enum: Object.values(UserRole) },
    organizationName: { type: 'string' },
    firstName: { type: 'string' },
    lastName: { type: 'string' },
    passwordHash: { type: 'string' },
    termsVersion: { type: 'number' },
  },
  required: ['email', 'role', 'firstName', 'lastName', 'passwordHash'],
  additionalProperties: false,
};
