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
  verifiedAt?: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreatePasswordResetModel = Omit<
  PasswordResetModel,
  'id' | 'verifiedAt' | 'createdAt' | 'updatedAt'
>;
