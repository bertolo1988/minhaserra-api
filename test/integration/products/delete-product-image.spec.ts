import { ImageUploadService } from '../../../src/services/image-upload-service';
import {
  inactiveUser,
  softDeletedUser,
  unverifiedUser,
  verifiedSeller1,
  verifiedSeller1SoftDeleteProduct2,
  verifiedSeller2,
  verifiedSeller2Product1,
  verifiedSeller2Product1Images,
} from '../../seeds/product-images.seed';
import {
  DatabaseSeedNames,
  getAuthorizationHeader,
  runSeedByName,
} from '../../test-utils';
import { getTestServerUrl } from '../integration-test-utils';
import TestServerSingleton from '../test-server-instance';

const VALID_UUID = 'fcc13b9f-13ac-4e04-9eca-ce7f79faa2cc';

describe('DELETE /api/products/:id/images/:imageId', () => {
  beforeAll(async () => {
    await TestServerSingleton.getInstance();
    await runSeedByName(DatabaseSeedNames.PRODUCTS_IMAGES);
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('should return 401', () => {
    test('if user is not authenticated', async () => {
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
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
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
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
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
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
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
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

    test('if user tries to delete an image from a product that he doesnt own', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${verifiedSeller2Product1.id}/images/${verifiedSeller2Product1Images[0].id}`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(403);
      const body = await response.json();
      expect(body.message).toBe('Forbidden');
    });
  });

  describe('should return 400', () => {
    test('if product id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${malformedUuid}/images/${VALID_UUID}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe("Invalid url parameter 'id': malformed-uuid");
    });

    test('if product image id is malformed uuid', async () => {
      const malformedUuid = 'malformed-uuid';
      const response = await fetch(
        getTestServerUrl(`/api/products/${VALID_UUID}/images/${malformedUuid}`)
          .href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(400);
      const body = await response.json();
      expect(body.message).toBe(
        `Invalid url parameter 'imageId': malformed-uuid`,
      );
    });
  });

  describe('should return 404', () => {
    test('when product does not exist', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${VALID_UUID}/images/${verifiedSeller2Product1Images[0].id}`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Product not found');
    });

    test('when product image does not exist', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${verifiedSeller2Product1.id}/images/${VALID_UUID}`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller2),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Image not found');
    });

    test('if product is soft deleted', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${verifiedSeller1SoftDeleteProduct2.id}/images/${VALID_UUID}`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller1),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(404);
      const body = await response.json();
      expect(body.message).toBe('Product not found');
    });
  });

  describe('should return 200', () => {
    let deleteProductImageSpy: jest.SpyInstance;

    beforeAll(async () => {
      deleteProductImageSpy = jest
        .spyOn(ImageUploadService.prototype, 'deleteImage')
        .mockResolvedValue(true);
    });

    afterEach(async () => {
      deleteProductImageSpy.mockClear();
    });

    afterAll(async () => {
      deleteProductImageSpy.mockReset();
    });

    test('when everything is correct', async () => {
      const response = await fetch(
        getTestServerUrl(
          `/api/products/${verifiedSeller2Product1.id}/images/${verifiedSeller2Product1Images[0].id}`,
        ).href,
        {
          method: 'DELETE',
          headers: {
            Authorization: getAuthorizationHeader(verifiedSeller2),
            'Content-Type': 'application/json',
          },
        },
      );
      expect(response.status).toBe(200);
      const body = await response.json();
      expect(body.message).toBe('Image deleted');
      expect(deleteProductImageSpy).toHaveBeenCalledTimes(1);
    });
  });
});
