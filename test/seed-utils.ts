import moment from 'moment';

import { AddressModel } from '../src/controllers/addresses/addresses.types';
import {
  ProductCategory,
  ProductImageModel,
  ProductModel,
  ProductSubCategory,
} from '../src/controllers/products/products.types';
import { UserModel, UserRole } from '../src/controllers/users/users.types';

const now = moment();

export class SeedUtils {
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

  static getProduct(
    id: string,
    userId: string,
    softDeleted = false,
  ): ProductModel {
    return {
      id,
      userId,
      category: ProductCategory.FOOD,
      subCategory: ProductSubCategory.FOOD_HONEY,
      name: 'Product 1',
      description: 'Description 1',
      countryCode: 'PT',
      region: 'Leiria',
      avaliableQuantity: 5,
      price: 1000, // price in cents
      isOnSale: false,
      isDeleted: softDeleted,
      isApproved: true,
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }

  static getProductImage(id: string, productId: string): ProductImageModel {
    return {
      id,
      productId,
      url: `https://example.com/${id}.webp`,
      name: 'image_1',
      description: 'Some description',
      createdAt: now.toDate(),
      updatedAt: now.toDate(),
    };
  }
}
