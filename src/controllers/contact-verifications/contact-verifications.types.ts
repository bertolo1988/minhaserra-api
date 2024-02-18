export enum ContactVerifiationType {
  EMAIL = 'email',
  PHONE = 'phone',
}

export type ContactVerificationModel = {
  id: number;
  userId: number;
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
