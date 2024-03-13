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
    label: { type: 'string', nullable: false },
    countryCode: { type: 'country-code', nullable: false },
    name: { type: 'string', nullable: false },
    line1: { type: 'string', nullable: false },
    line2: { type: 'string', nullable: true },
    city: { type: 'string', nullable: false },
    region: { type: 'string', nullable: false },
    postalCode: { type: 'string', nullable: false },
    phoneNumber: { type: 'string', nullable: true },
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
