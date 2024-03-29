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
      errorMessage: `'label' must be a string with a maximum length of 100 characters`,
    },
    countryCode: CountryCodeSchema,
    name: {
      type: 'string',
      nullable: false,
      maxLength: 100,
      errorMessage: `'name' must be a string with a maximum length of 100 characters`,
    },
    lineOne: {
      type: 'string',
      nullable: false,
      maxLength: 255,
      errorMessage: `'lineOne' must be a string with a maximum length of 255 characters`,
    },
    lineTwo: {
      type: 'string',
      nullable: true,
      maxLength: 255,
      errorMessage: `'lineTwo' must be a string with a maximum length of 255 characters`,
    },
    city: {
      type: 'string',
      nullable: false,
      maxLength: 100,
      errorMessage: `'city' must be a string with a maximum length of 100 characters`,
    },
    region: {
      type: 'string',
      nullable: false,
      maxLength: 100,
      errorMessage: `'region' must be a string with a maximum length of 100 characters`,
    },
    postalCode: {
      type: 'string',
      nullable: false,
      maxLength: 50,
      errorMessage: `'postalCode' must be a string with a maximum length of 50 characters`,
    },
    phoneNumber: {
      type: 'string',
      nullable: true,
      maxLength: 50,
      errorMessage: `'phoneNumber' must be a string with a maximum length of 50 characters`,
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
