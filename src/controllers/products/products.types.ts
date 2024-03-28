import CONSTANTS from '../../constants';
import { CountryCodeSchema } from '../../schemas/shared-schemas';
import { Currency } from '../../types';
import { AjvCustomFormats } from '../../utils/ajv';
import { ImageUtils } from '../../utils/image-utils';

export enum ProductCategory {
  OTHER = 'other',
  FOOD = 'food',
  CLOTHING = 'clothing',
  HOME = 'home',
  TOYS = 'toys',
}

export enum ProductSubCategory {
  FOOD_OTHER = 'food_other',
  FOOD_OLIVE_OIL = 'food_olive-oil',
  FOOD_DRINKS = 'food_drinks',
  FOOD_VEGETABLES = 'food_vegetables',
  FOOD_HONEY = 'food_honey',
  FOOD_CHEESE = 'food_cheese',
  FOOD_WINE = 'food_wine',
  FOOD_CHARCUTERIE = 'food_charcuterie',
  FOOD_SWEETS = 'food_sweets',
  CLOTHING_OTHER = 'clothing_other',
  CLOTHING_FOOTWEAR = 'clothing_footwear',
  CLOTHING_COSTUMES = 'clothing_costumes',
  CLOTHING_ACCESSORIES = 'clothing_accessories',
  CLOTHING_PANTS = 'clothing_pants',
  CLOTHING_SWEATERS = 'clothing_sweaters',
  CLOTHING_TSHIRTS = 'clothing_tshirts',
  CLOTHING_BABY = 'clothing_baby',
  HOME_OTHER = 'home_other',
  HOME_FURNITURE = 'home_furniture',
  HOME_RUGS = 'home_rugs',
  HOME_WALL_ART = 'home_wall-art',
  HOME_GARDEN = 'home_garden',
  HOME_KITCHEN = 'home_kitchen',
  HOME_BATHROOM = 'home_bathroom',
  TOYS_OTHER = 'toys_other',
  TOYS_PUZZLES = 'toys_puzzles',
  TOYS_CARDS = 'toys_cards',
  TOYS_BOARD_GAMES = 'toys_board-games',
  TOYS_BABY = 'toys_baby',
}

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
      errorMessage: `'name' can only contain letters, numbers, underscores, and dashes`,
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
      errorMessage: `'base64Image' must be a string with a maximum length of ${CONSTANTS.MAX_BASE64_IMAGE_SIZE} characters, about ${ImageUtils.reverseEstimateBase64Size(CONSTANTS.MAX_BASE64_IMAGE_SIZE) / 1000000} megabytes of original image size.`,
    },
  },
  required: ['name', 'base64Image'],
  additionalProperties: false,
};

export type ProductModel = {
  id: string;
  userId: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  name: string;
  description?: string;
  countryCode: string;
  region?: string;
  avaliableQuantity: number;
  price: number;
  isOnSale: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateProductDto = {
  category: ProductCategory;
  subCategory: ProductSubCategory;
  name: string;
  description?: string;
  countryCode: string;
  region?: string;
  avaliableQuantity: number;
  price: number;
  currency: Currency;
  isOnSale: boolean;
};

export const CreateProductDtoSchema = {
  type: 'object',
  properties: {
    category: {
      nullable: false,
      enum: [Object.values(ProductCategory)],
    },
    subCategory: {
      nullable: false,
      enum: [Object.values(ProductSubCategory)],
    },
    name: {
      type: 'string',
      nullable: false,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    description: {
      type: 'string',
      nullable: true,
      maxLength: CONSTANTS.DESCRIPTION_MAX_STRING_SIZE,
    },
    countryCode: CountryCodeSchema,
    region: {
      type: 'string',
      nullable: true,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    availableQuantity: {
      type: 'integer',
      nullable: false,
      min: 0,
      max: CONSTANTS.MAX_AVAILABLE_QUANTITY,
    },
    price: {
      type: 'integer',
      nullable: false,
      min: 1,
      max: CONSTANTS.MAX_PRICE_IN_CENTS,
    },
    currency: {
      enum: [Object.values(Currency)],
      nullable: false,
    },
    isOnSale: {
      type: 'boolean',
      nullable: false,
    },
  },
  required: [
    'category',
    'subCategory',
    'name',
    'countryCode',
    'availableQuantity',
    'price',
    'currency',
    'isOnSale',
  ],
  additionalProperties: false,
};
