import { Schema } from 'ajv';

export type AddressModel = {
  id: string;
  userId: string;
  label: string;
  countryCode: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  city: string;
  region: string;
  postalCode: string;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateAddressModel = Omit<
  AddressModel,
  'id' | 'createdAt' | 'updatedAt'
>;

export type CreateAddressDto = {
  label: string;
  countryCode: string;
  name: string;
  lineOne: string;
  lineTwo?: string;
  city: string;
  region: string;
  postalCode: string;
  phoneNumber?: string;
};

export const CreateAddressDtoSchema: Schema = {
  type: 'object',
  properties: {
    label: { type: 'string', nullable: false, minLength: 1, maxLength: 100 },
    countryCode: {
      type: 'string',
      format: 'country-code',
      nullable: false,
      minLength: 2,
      maxLength: 2,
    },
    name: { type: 'string', nullable: false, minLength: 1, maxLength: 100 },
    lineOne: { type: 'string', nullable: false, minLength: 1, maxLength: 255 },
    lineTwo: { type: 'string', nullable: true, minLength: 1, maxLength: 255 },
    city: { type: 'string', nullable: false, minLength: 1, maxLength: 100 },
    region: { type: 'string', nullable: false, minLength: 1, maxLength: 100 },
    postalCode: {
      type: 'string',
      nullable: false,
      minLength: 1,
      maxLength: 50,
    },
    phoneNumber: {
      type: 'string',
      nullable: true,
      minLength: 1,
      maxLength: 50,
    },
  },
  required: [
    'label',
    'countryCode',
    'name',
    'lineOne',
    'city',
    'region',
    'postalCode',
  ],
  additionalProperties: false,
};
