import CONSTANTS from '../../constants';
import { ImageBase64Utils } from '../../utils/image-base-64-utils';

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

export type CreateProductImageDto = {
  name: string;
  description?: string;
  base64Image: string;
};

export const CreateProductImageDtoSchema = {
  type: 'object',
  properties: {
    name: { type: 'string', nullable: false },
    description: { type: 'string', nullable: true },
    base64Image: {
      type: 'string',
      nullable: false,
      maxLength: CONSTANTS.MAX_BASE64_IMAGE_SIZE,
      errorMessage: `'base64Image' must be a string with a maximum length of ${CONSTANTS.MAX_BASE64_IMAGE_SIZE} characters, about ${ImageBase64Utils.reverseEstimateBase64Size(CONSTANTS.MAX_BASE64_IMAGE_SIZE) / 1000000} megabytes of original image size.`,
    },
  },
  required: ['name', 'base64Image'],
  additionalProperties: false,
};
