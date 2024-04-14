import moment from 'moment';
import tk from 'timekeeper';

import CONFIG from '../../../src/config';
import CONSTANTS from '../../../src/constants';
import { CreateProductImageDto } from '../../../src/controllers/products/product-images.types';
import { ImageUploadService } from '../../../src/services/image-upload-service';
import { ImageUtils } from '../../../src/utils/image-utils';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedSeller1,
  verifiedSeller1Product1,
  verifiedSeller1SoftDeleteProduct2,
  verifiedSeller2,
  verifiedSeller2Product1,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

const TARGET_DATE = moment('2021-01-01T00:00:00Z');

describe('POST /api/products/:id/images', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterAll(async () => {
    jest.resetAllMocks();
    tk.reset();
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/products/${addressId}/images`).href,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });

    test('if user is soft deleted', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/products/${addressId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(softDeletedUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(401);
      const body = await response.json();
      expect(body.message).toBe('Unauthorized');
    });
  });

  describe('should return 403', () => {
    test('if user is inactive', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/products/${addressId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(inactiveUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });

    test('if user is not verified', async () => {
      const addressId = 'b7604309-ba09-4057-8b76-2d4ff121dcb2';
      const response = await fetch(
        getTestServerUrl(`/api/products/${addressId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(unverifiedUser),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });

    test('if user tries to upload image to a product that he doesnt own', async () => {
      const data = {
        name: 'image2',
        description: 'Image description',
        base64Image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAMUlEQVR4nGKp+rWHARtIyt2AVZwJqygeMKqBGMAo4CKGVUJygTJ1bBjVQAwABAAA//80iQUXEjcPMwAAAABJRU5ErkJggg==',
      };
      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller2),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe(`Forbidden`);
    });
  });

  describe('should return 404', () => {
    test('if user tries to upload image to a product that is soft deleted', async () => {
      const data = {
        name: 'image2',
        description: 'Image description',
        base64Image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAMUlEQVR4nGKp+rWHARtIyt2AVZwJqygeMKqBGMAo4CKGVUJygTJ1bBjVQAwABAAA//80iQUXEjcPMwAAAABJRU5ErkJggg==',
      };
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${verifiedSeller1SoftDeleteProduct2.id}/images`,
        ).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller2),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe(`Product not found`);
    });
  });

  describe('should return 400', () => {
    test('if product id is not a valid uuid', async () => {
      const productId = 'not-valid-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${productId}/images`).href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Invalid url parameter 'id': not-valid-uuid`);
    });

    test('if image is too big to be accepted', async () => {
      const fileName = `test/integration/products/test-product-images/8_5_MB.jpeg`;
      const data = {
        name: 'image',
        description: 'Image description',
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `base64Image must be a string with a maximum length of 8000000 characters, about 6 megabytes of original image size.`,
      );
    });

    test('if image name has characters like . (we dont want extensions in the image name)', async () => {
      const data = {
        name: 'image.png',
        description: 'Image description',
        base64Image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAMUlEQVR4nGKp+rWHARtIyt2AVZwJqygeMKqBGMAo4CKGVUJygTJ1bBjVQAwABAAA//80iQUXEjcPMwAAAABJRU5ErkJggg==',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `name can only contain letters, numbers, underscores, and dashes and have a maximum length of ${CONSTANTS.DEFAULT_MAX_STRING_SIZE}`,
      );
    });

    test('if the seller reached the maximum amount of images for the same product', async () => {
      const data = {
        name: 'image',
        description: 'Image description',
        base64Image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAMUlEQVR4nGKp+rWHARtIyt2AVZwJqygeMKqBGMAo4CKGVUJygTJ1bBjVQAwABAAA//80iQUXEjcPMwAAAABJRU5ErkJggg==',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller2Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller2),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`Too many pictures for this product`);
    });

    test('if image name has a question mark', async () => {
      const data = {
        name: 'image?',
        description: 'Image description',
        base64Image:
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAIAAACQkWg2AAAAMUlEQVR4nGKp+rWHARtIyt2AVZwJqygeMKqBGMAo4CKGVUJygTJ1bBjVQAwABAAA//80iQUXEjcPMwAAAABJRU5ErkJggg==',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `name can only contain letters, numbers, underscores, and dashes and have a maximum length of ${CONSTANTS.DEFAULT_MAX_STRING_SIZE}`,
      );
    });

    test('if image is not valid base64 image', async () => {
      const data = {
        name: 'myimage',
        description: 'Image description',
        base64Image:
          'data:imagiVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAIAAAD8GO2jAAAAjElEQVR4nGI5GbeLARsoeXcZq3hZmR5W8bTEC1jFmbCKUhGMWjBqAeWAUbBEAKtE1F9hrOJrDwthFdcp7ccqPvSDaNSCEWABy4nXCdht3nYIq/h1n19Yxe2mfcJuDlnOIgGMWjBqAeWA0fUzP1YJtSc9WMVf8eRiFc8QmYFVfOgH0agFI8ACQAAAAP//RvQYf4MnINYAAAAASUVORK5CY',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(`'base64Image' is not a valid base64 image`);
    });

    test('if the image does not have an expected extension', async () => {
      const data: CreateProductImageDto = {
        name: 'myimage_2',
        description: 'Image description',
        base64Image:
          'iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAIAAAAlC+aJAAABy0lEQVR4nOzay4tSYRjH8ZQjBAc3JUgQkSAkdrMI0wg5gULkIihcWCsXRVhEmwpcqIE7wW5CtjCKolUQXXDhIgRr0VIQxrmgCA6zcoaZgZnR2cw/8N0/vPB8l593OMOPF+Qwo3Xk971DVLd2B714O4Xed3Lo9ucEeusE/7yTj6DvvnuG7kY1KB0gnQ6QTgdI56rEVvDAnd1DP5/KoDevtdCPr4bQh2c30J9uLaO/OexBN/4GdIB0OkA6HSCdNa8G8aCR5vf4L+2r6NH7m+gfqjvo8aGDni3X0O2hjW78DegA6XSAdDpAOsv/toQH4flXdE/pCXpx9A+9/C3Az7EX0ROFK+jd7R668TegA6TTAdLpAOms3GX+3D19qoNe/38S3TtdQz/WuIuen11A/xHg57dfxtCNvwEdIJ0OkE4HSGf9Wuf/+37v8Xt81O9HH/gu8m+InEOuPu+jJyv8nOSLn+jG34AOkE4HSKcDpHMNphM8ePXxE/qlOP+d/npwjB4a3UJ//MdBn50JoxceNNGNvwEdIJ0OkE4HSOd69JC/pzl5z5/HS5m/6LVOGX18w0H3+o6iv04voO/frKMbfwM6QDodIJ0OkO4gAAD//9jOWSJuW0xTAAAAAElFTkSuQmCC',
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toEqual(
        `'base64Image' extension is not allowed. Allowed extensions are: jpg, jpeg, png, gif, webp`,
      );
    });
  });

  describe('should return 201', () => {
    let putObjectSpy: jest.SpyInstance;

    beforeAll(() => {
      tk.freeze(TARGET_DATE.toDate());
      putObjectSpy = jest
        .spyOn(ImageUploadService.prototype, 'putObjectS3')
        .mockResolvedValue({
          ETag: '"3d4389fbbc04cda7cc458f2234398d57"',
          ServerSideEncryption: 'AES256',
        });
    });

    afterEach(async () => {
      putObjectSpy.mockClear();
      tk.reset();
    });

    afterAll(async () => {
      putObjectSpy.mockReset();
      tk.reset();
    });

    test('if everything is correct and image is not over the limit', async () => {
      const fileName = `test/integration/products/test-product-images/5_6_MB.jpg`;
      const data: CreateProductImageDto = {
        name: 'myimage_1',
        description: 'Image description',
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
      };

      const response = await fetch(
        getTestServerUrl(`/api/products/${verifiedSeller1Product1.id}/images`)
          .href,
        {
          method: 'POST',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        },
      );
      expect(response.status).toBe(201);
      const body = await response.json();
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          url: expect.any(String),
        }),
      );
      expect(
        body.url.startsWith(
          `https://${CONFIG.aws.productImagesBucketName}.s3.${CONFIG.aws.region}.amazonaws.com/productId_${verifiedSeller1Product1.id}/`,
        ),
      ).toBe(true);
      expect(body.url.endsWith(`.webp`)).toBe(true);
    });
  });
});
