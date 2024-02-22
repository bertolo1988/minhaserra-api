export enum ContactVerifiationType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export type ContactVerificationDto = {
  userId: string;
  type: ContactVerifiationType;
  contact: string;
  expiresAt: Date;
};

export type ContactVerificationModel = {
  id: string;
  userId: string;
  type: ContactVerifiationType;
  contact: string;
  verifiedAt: Date;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateContactVerificationModel = Omit<
  ContactVerificationModel,
  'id' | 'verifiedAt' | 'createdAt' | 'updatedAt'
>;
