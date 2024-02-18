export enum ContactVerifiationType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export type ContactVerificationDto = {
  userId: string;
  type: ContactVerifiationType;
  contact: string;
  token: string;
  expiresAt: Date;
};

export type ContactVerificationModel = {
  id: string;
  userId: string;
  type: ContactVerifiationType;
  contact: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactVerificationModel = Omit<
  ContactVerificationModel,
  'id' | 'createdAt' | 'updatedAt'
>;
