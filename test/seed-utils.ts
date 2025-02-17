import moment from 'moment';

import { AddressModel } from '../src/controllers/addresses/addresses.types';
import { ProductImageModel } from '../src/controllers/products/product-images.types';
import {
  ProductCategory,
  ProductModel,
  ProductSubCategory,
} from '../src/controllers/products/products.types';
import { ShoppingCartItemModel } from '../src/controllers/shopping-cart-items/shopping-cart-items.types';
import { UserModel, UserRole } from '../src/controllers/users/users.types';
import { Language } from '../src/types';

const now = moment();

export class SeedUtils {
  static getShoppingCartItem({
    id,
    productId,
    userId,
    quantity = 1,
  }: {
    id: string;
    productId: string;
    userId: string;
    quantity?: number;
  }): ShoppingCartItemModel {
    return {
      id,
      productId,
      userId,
      quantity,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getVerifiedUserPassword(): string {
    return '9awj26AyDB%';
  }

  static getVerifiedUser(
    id: string = 'dbd2199f-fda4-42dc-b2d4-c73051abd786',
    role: UserRole = UserRole.BUYER,
  ): UserModel {
    return {
      id,
      email: `${id}@minhaserra.com`,
      role,
      firstName: 'Jude',
      lastName: 'Law',
      birthDate: moment('1990-01-01').toDate(),
      isActive: true,
      isEmailVerified: true,
      isDeleted: false,
      passwordHash:
        '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
      passwordSalt:
        '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
      passwordIterations: 128,
      termsVersion: 1,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getSoftDeletedUserPassword(): string {
    return '9awj26AyDB%';
  }

  static getSoftDeletedUser(): UserModel {
    return {
      id: '22043ca6-9246-4182-9e9b-4aeb536abd42',
      email: 'soft-deleted-user1@minhaserra.com',
      role: UserRole.BUYER,
      firstName: 'Adam',
      lastName: 'Bell',
      birthDate: moment('1990-01-01').toDate(),
      isActive: true,
      isEmailVerified: true,
      isDeleted: true,
      passwordHash:
        '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
      passwordSalt:
        '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
      passwordIterations: 128,
      termsVersion: 1,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getNonVerifiedUserPassword(): string {
    return '9awj26AyDB%';
  }

  static getNonVerifiedUser(): UserModel {
    return {
      id: '42a00510-bbad-4538-825d-0d983bdec9e2',
      email: 'non-verified-user-1@minhaserra.com',
      role: UserRole.BUYER,
      firstName: 'John',
      lastName: 'Bell',
      birthDate: moment('1990-01-01').toDate(),
      isActive: true,
      isEmailVerified: false,
      isDeleted: false,
      passwordHash:
        '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
      passwordSalt:
        '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
      passwordIterations: 128,
      termsVersion: 1,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getInactiveUserPassword(): string {
    return '9awj26AyDB%';
  }

  static getInactiveUser(): UserModel {
    return {
      id: '97e7b37f-c1ae-44b2-a68f-df476fbeec8b',
      email: 'inactive-user-1@minhaserra.com',
      role: UserRole.BUYER,
      firstName: 'Martin',
      lastName: 'Bell',
      birthDate: moment('1990-01-01').toDate(),
      isActive: false,
      isEmailVerified: true,
      isDeleted: false,
      passwordHash:
        '25994d71c411e6c679bfc5974669fe97972055817bbc02d94c99058405597fdb27a99017c86886ebafff0ff1185cce7ce4b32561333f1fa711e167bae66c972c802eee978747c025cb642950d21d6855294486d0a3a7ba6b6aa296ea8ac35a2df63e9aa703f368c047c9702bae5afb3ad83573243faf683052333254efcd8339',
      passwordSalt:
        '28666637e639d87832b19346772c2deeb22468b2ca3c95cc332f68bc04b2be07',
      passwordIterations: 128,
      termsVersion: 1,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getUserAddress(id: string, user: UserModel): AddressModel {
    return {
      id,
      userId: user.id,
      label: 'My first home',
      name: 'John Doe',
      lineTwo: 'n 99',
      lineOne: 'Xihu Road',
      city: 'Guangzhou',
      region: 'Yuexiu District',
      postalCode: '510030',
      countryCode: 'CN',
      phoneNumber: '1234567890',
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getProduct({
    id,
    userId,
    category = ProductCategory.FOOD,
    subCategory = ProductSubCategory.FOOD_HONEY,
    name = 'Mel da Serra de Aire e Candeeiros',
    nameEnglish = 'Honey from Serra de Aire e Candeeiros',
    description = 'Mel biológico, à base de alecrim e alfazema, produzido no alto das Serras do parque natural da Serra de Aire e Candeeiros.',
    descriptionEnglish = 'Organic honey, based on rosemary and lavender, produced in the mountain range of the Serra de Aire e Candeeiros natural park.',
    price = 1000,
    availableQuantity = 5,
    softDeleted = false,
    isOnSale = true,
    isApproved = true,
  }: {
    id: string;
    userId: string;
    category?: ProductCategory;
    subCategory?: ProductSubCategory;
    name?: string;
    nameEnglish?: string;
    description?: string;
    descriptionEnglish?: string;
    price?: number;
    availableQuantity?: number;
    softDeleted?: boolean;
    isOnSale?: boolean;
    isApproved?: boolean;
  }): Omit<ProductModel, 'searchDocument'> {
    return {
      id,
      userId,
      category,
      subCategory,
      language: Language.PORTUGUESE,
      name,
      nameEnglish,
      description,
      descriptionEnglish,
      countryCode: 'PT',
      region: 'Leiria',
      availableQuantity,
      price,
      isOnSale,
      isDeleted: softDeleted,
      isApproved,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getProductImage(
    id: string,
    productId: string,
    url?: string,
  ): ProductImageModel {
    return {
      id,
      productId,
      url: url || `https://via.placeholder.com/${id}`,
      name: 'image_1',
      description: 'Some description',
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }
}
