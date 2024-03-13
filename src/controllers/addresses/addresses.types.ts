import { Schema } from 'ajv';

export type CreateAddressDto = {
  label: string;
  countryCode: string;
  name: string;
  line1: string;
  line2?: string;
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
      type: 'country-code',
      nullable: false,
      minLength: 2,
      maxLength: 2,
    },
    name: { type: 'string', nullable: false, minLength: 1, maxLength: 100 },
    line1: { type: 'string', nullable: false, minLength: 1, maxLength: 255 },
    line2: { type: 'string', nullable: true, minLength: 1, maxLength: 255 },
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
    'line1',
    'city',
    'region',
    'postalCode',
  ],
  additionalProperties: false,
};
