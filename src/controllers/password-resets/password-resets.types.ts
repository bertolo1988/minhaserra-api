import { PasswordSchema } from '../users/users.types';

export type PasswordResetDto = {
  email: string;
};

export const PasswordResetDtoSchema = {
  type: 'object',
  properties: {
    email: { type: 'string', nullable: false },
  },
  required: ['email'],
  additionalProperties: false,
};

export type PasswordResetModel = {
  id: string;
  userId: string;
  token: string;
  usedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePasswordResetModel = Omit<
  PasswordResetModel,
  'id' | 'usedAt' | 'createdAt' | 'updatedAt'
>;

export type UpdatePasswordUnauthenticatedDto = {
  token: string;
  password: string;
};

export const UpdatePasswordUnauthenticatedDtoSchema = {
  type: 'object',
  properties: {
    token: {
      type: 'string',
      nullable: false,
    },
    password: PasswordSchema,
  },
  required: ['token', 'password'],
  additionalProperties: false,
};
