import { Schema } from 'ajv';

import { CountryCodeSchema } from '../../schemas/shared-schemas';

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
    label: {
      type: 'string',
      nullable: false,
      maxLength: 100,
    },
    countryCode: CountryCodeSchema,
    name: {
      type: 'string',
      nullable: false,
      maxLength: 100,
    },
    lineOne: {
      type: 'string',
      nullable: false,
      maxLength: 255,
    },
    lineTwo: {
      type: 'string',
      nullable: true,
      maxLength: 255,
    },
    city: {
      type: 'string',
      nullable: false,
      maxLength: 100,
    },
    region: {
      type: 'string',
      nullable: false,
      maxLength: 100,
    },
    postalCode: {
      type: 'string',
      nullable: false,
      maxLength: 50,
    },
    phoneNumber: {
      type: 'string',
      nullable: true,
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
