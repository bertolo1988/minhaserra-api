import moment from 'moment';
import tk from 'timekeeper';

import CONFIG from '../../../src/config';
import { ImageUploadService } from '../../../src/controllers/products/image-upload-service';
import { CreateProductImageDto } from '../../../src/controllers/products/products.types';
import { ImageUtils } from '../../../src/utils/image-utils';
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

const TARGET_DATE = moment('2021-01-01T00:00:00Z');

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
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
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

    test('if image name has characters like . (we dont want extensions in the image name)', async () => {
      const fileName = `test/integration/products/example_image_2_5_MB.jpg`;
      const data = {
        name: 'image.png',
        description: 'Image description',
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
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
        `'name' can only contain letters, numbers, underscores, and dashes`,
      );
    });

    test('if image name has a question mark', async () => {
      const fileName = `test/integration/products/example_image_2_5_MB.jpg`;
      const data = {
        name: 'image?',
        description: 'Image description',
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
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
        `'name' can only contain letters, numbers, underscores, and dashes`,
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
      expect(body.message).toEqual(
        `'base64Image' extension is not allowed. Allowed extensions are: jpg, jpeg, png, gif, webp`,
      );
    });
  });

  describe('should return 201', () => {
    var putObjectSpy: jest.SpyInstance;

    beforeAll(() => {
      tk.freeze(TARGET_DATE.toDate());
      putObjectSpy = jest
        .spyOn(ImageUploadService.prototype, 'putObjectS3')
        .mockResolvedValue({
          ETag: '"3d4389fbbc04cda7cc458f2234398d57"',
          ServerSideEncryption: 'AES256',
        });
    });

    afterAll(() => {
      tk.reset();
      putObjectSpy.mockClear();
    });

    test('if everything is correct and image is not over 3MB', async () => {
      const fileName = `test/integration/products/example_image_2_5_MB.jpg`;
      const data: CreateProductImageDto = {
        name: 'myimage_1',
        description: 'Image description',
        base64Image: await ImageUtils.getFileImageInBase64(fileName),
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
      expect(body).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          url: `https://${CONFIG.aws.productImagesBucketName}.s3.${CONFIG.aws.region}.amazonaws.com/userId_${verifiedSeller.id}/productId_${verifiedSellerProduct1.id}/${TARGET_DATE.valueOf()}-${data.name}.jpg`,
        }),
      );
    });
  });
});
