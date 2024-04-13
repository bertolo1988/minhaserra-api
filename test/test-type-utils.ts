import iso3311a2 from 'iso-3166-1-alpha-2';
import _ from 'lodash';

import {
  ProductCategory,
  ProductSubCategory,
} from '../src/controllers/products/products.types';
import { Language } from '../src/types';

export function testValidPublicProductModel(input: unknown) {
  expect(input).toEqual(
    expect.objectContaining({
      id: expect.any(String),
      userId: expect.any(String),
      category: expect.stringMatching(Object.values(ProductCategory).join('|')),
      subCategory: expect.stringMatching(
        Object.values(ProductSubCategory).join('|'),
      ),
      language: expect.stringMatching(Object.values(Language).join('|')),
      name: expect.any(String),
      nameEnglish: expect.any(String),
      description: expect.any(String),
      descriptionEnglish: expect.any(String),
      countryCode: expect.stringMatching(iso3311a2.getCodes().join('|')),
      region: expect.any(String),
      availableQuantity: expect.any(Number),
      price: expect.any(String),
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      images: expect.arrayContaining([]),
    }),
  );
  expect(_.isArray((input as any).images)).toBe(true);
}
