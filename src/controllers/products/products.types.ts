import CONSTANTS from '../../constants';
import { CountryCodeSchema } from '../../schemas/shared-schemas';
import { Currency, Language, SortDirection } from '../../types';
import { AjvCustomFormats } from '../../utils/ajv';

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

export type ProductModel = {
  id: string;
  userId: string;
  category: ProductCategory;
  subCategory: ProductSubCategory;
  language: Language;
  name: string;
  nameEnglish: string;
  description: string;
  descriptionEnglish: string;
  countryCode: string;
  region?: string;
  availableQuantity: number;
  price: number;
  isOnSale: boolean;
  isDeleted: boolean;
  isApproved: boolean;
  searchDocument: string;
  createdAt: Date;
  updatedAt: Date;
};

export type PublicProductModel = Omit<
  ProductModel,
  'isOnSale' | 'isDeleted' | 'isApproved' | 'searchDocument'
> & { images: string[] };

export type OwnerProductModel = Omit<ProductModel, 'searchDocument'>;

export type CreateProductModel = Omit<
  ProductModel,
  | 'id'
  | 'isDeleted'
  | 'isApproved'
  | 'searchDocument'
  | 'createdAt'
  | 'updatedAt'
>;

export type CreateProductDto = {
  category: ProductCategory;
  subCategory: ProductSubCategory;
  language: Language;
  name: string;
  description: string;
  countryCode: string;
  region?: string;
  availableQuantity: number;
  price: number;
  currency: Currency;
  isOnSale: boolean;
};

export const CreateProductDtoSchema = {
  type: 'object',
  properties: {
    category: {
      nullable: false,
      type: 'string',
      enum: Object.values(ProductCategory),
    },
    subCategory: {
      nullable: false,
      type: 'string',
      enum: Object.values(ProductSubCategory),
    },
    language: {
      nullable: false,
      type: 'string',
      enum: Object.values(Language),
    },
    name: {
      type: 'string',
      nullable: false,
      minLength: 2,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    description: {
      type: 'string',
      nullable: false,
      minLength: 2,
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
      minimum: 0,
      maximum: CONSTANTS.MAX_AVAILABLE_QUANTITY,
    },
    price: {
      type: 'integer',
      nullable: false,
      minimum: 1,
      maximum: CONSTANTS.MAX_PRICE_IN_CENTS,
    },
    currency: {
      type: 'string',
      enum: Object.values(Currency),
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
    'language',
    'name',
    'description',
    'countryCode',
    'availableQuantity',
    'price',
    'currency',
    'isOnSale',
  ],
  additionalProperties: false,
};

export type UpdateProductDto = {
  category?: ProductCategory;
  subCategory?: ProductSubCategory;
  name?: string;
  description?: string;
  countryCode?: string;
  region?: string;
  availableQuantity?: number;
  price?: number;
};

export const UpdateProductDtoSchema = {
  type: 'object',
  properties: {
    category: {
      nullable: true,
      type: 'string',
      enum: Object.values(ProductCategory),
    },
    subCategory: {
      nullable: true,
      type: 'string',
      enum: Object.values(ProductSubCategory),
    },
    name: {
      type: 'string',
      nullable: true,
      minLength: 2,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    description: {
      type: 'string',
      nullable: true,
      minLength: 2,
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
      nullable: true,
      minimum: 0,
      maximum: CONSTANTS.MAX_AVAILABLE_QUANTITY,
    },
    price: {
      type: 'integer',
      nullable: true,
      minimum: 1,
      maximum: CONSTANTS.MAX_PRICE_IN_CENTS,
    },
    currency: {
      type: 'string',
      enum: Object.values(Currency),
      nullable: true,
    },
    isOnSale: {
      type: 'boolean',
      nullable: true,
    },
  },
  required: [],
  additionalProperties: false,
};

export enum ProductSeachOrderByFields {
  NAME = 'name',
  PRICE = 'price',
}

export type ProductsSearchDto = {
  text?: string;
  category?: ProductCategory;
  subCategory?: ProductSubCategory;
  maxPrice?: string;
  minPrice?: string;
  countryCode?: string;
  region?: string;
  orderBy?: ProductSeachOrderByFields;
  orderDirection?: SortDirection;
};

export const ProductsSearchDtoSchema = {
  type: 'object',
  properties: {
    text: {
      type: 'string',
      nullable: true,
      minLength: 1,
      maxLength: CONSTANTS.MAX_PRODUCT_SEARCH_STRING_SIZE,
    },
    category: {
      nullable: true,
      type: 'string',
      enum: Object.values(ProductCategory),
    },
    subCategory: {
      nullable: true,
      type: 'string',
      enum: Object.values(ProductSubCategory),
    },
    minPrice: {
      type: 'string',
      nullable: true,
      errorMessage: 'must be a natural number bigger than 0',
      format: AjvCustomFormats.NATURAL_NUMBERS_EXCLUDING_ZERO,
    },
    maxPrice: {
      type: 'string',
      nullable: true,
      errorMessage: 'must be a natural number bigger than 0',
      format: AjvCustomFormats.NATURAL_NUMBERS_EXCLUDING_ZERO,
    },
    countryCode: {
      type: 'string',
      format: AjvCustomFormats.COUNTRY_CODE,
      nullable: true,
      minLength: 2,
      maxLength: 2,
      errorMessage: `must have two characters and be valid according to ISO 3166-1 alpha-2`,
    },
    region: {
      type: 'string',
      nullable: true,
      minLength: 1,
      maxLength: CONSTANTS.DEFAULT_MAX_STRING_SIZE,
    },
    offset: {
      type: 'string',
      nullable: true,
    },
    limit: {
      type: 'string',
      nullable: true,
    },
    orderBy: {
      nullable: true,
      type: 'string',
      enum: Object.values(ProductSeachOrderByFields),
    },
    orderDirection: {
      nullable: true,
      type: 'string',
      enum: Object.values(SortDirection),
    },
  },
  required: [],
  additionalProperties: false,
};
