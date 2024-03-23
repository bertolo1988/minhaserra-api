import tk from 'timekeeper';

import { ImageBase64Utils } from '../../../src/utils/image-base-64-utils';
import {
  verifiedSeller,
  verifiedSellerProduct1,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

const EXAMPLE_IMAGE_PATH =
  '/home/tiago/code/minhaserra-api/test/integration/products/create-product-image.spec.ts';

describe('POST /api/products/:id/images', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.clearAllMocks();
    tk.reset();
  });

  describe('should return 400', () => {
    test('if product id is not a valid uuid', async () => {
      const productId = 'not-valid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${productId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid id: ${productId}`);
    });

    test('if image is too big to be accepted', async () => {
      const fileName = `test/integration/products/example_image_3_2_MB.jpg`;
      const data = {
        name: 'image',
        description: 'Image description',
        base64Image: await ImageBase64Utils.getImageInBase64(fileName),
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `'base64Image' must be a string with a maximum length of 4000000 characters, about 3 megabytes of original image size.`,
      );
    });
  });

  describe('should return 201', () => {
    test.only('if everything is correct', async () => {
      const fileName = `test/integration/products/example_image_2_5_MB.jpg`;
      const data = {
        name: 'image',
        description: 'Image description',
        base64Image: await ImageBase64Utils.getImageInBase64(fileName),
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSellerProduct1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(201);
      const body = await response.json();
      console.log(111, body);
    });
  });
});
