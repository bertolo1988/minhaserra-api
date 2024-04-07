import CONSTANTS from '../../constants';
import { AjvCustomFormats } from '../../utils/ajv';
import { ImageUtils } from '../../utils/image-utils';

export type CreateProductImageDto = {
  name: string;
  description?: string;
  base64Image: string;
};

export type CreateProductImageModel = Omit<
  ProductImageModel,
  'createdAt' | 'updatedAt'
> & { id?: string };

export type ProductImageModel = {
  id: string;
  productId: string;
  url: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicProductImageModel = Omit<
  ProductImageModel,
  'id' | 'productId' | 'name' | 'createdAt' | 'updatedAt'
>;

export const CreateProductImageDtoSchema = {
  type: 'object',
  properties: {
    name: {
      type: 'string',
      nullable: false,
      format: AjvCustomFormats.NUMBERS_LETTERS_UNDERSCORE_DASH,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
      errorMessage: `can only contain letters, numbers, underscores, and dashes and have a maximum length of ${CONSTANTS.DEFAULT_MAX_STRING_SIZE}`,
    },
    description: {
      type: 'string',
      nullable: true,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    base64Image: {
      type: 'string',
      nullable: false,
      maxLength: CONSTANTS.MAX_BASE64_IMAGE_SIZE,
      errorMessage: `must be a string with a maximum length of ${CONSTANTS.MAX_BASE64_IMAGE_SIZE} characters, about ${ImageUtils.reverseEstimateBase64Size(CONSTANTS.MAX_BASE64_IMAGE_SIZE) / 1000000} megabytes of original image size.`,
    },
  },
  required: ['name', 'base64Image'],
  additionalProperties: false,
};
