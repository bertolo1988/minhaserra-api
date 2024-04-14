// TODO: implement these tests

describe('DELETE /api/shopping_cart_items/:id', () => {
  describe('should return 400', () => {
    test('when id is not a valid uuid', async () => {});
  });

  describe('should return 401', () => {
    test('if authorization is not provided', async () => {});
  });

  describe('should return 403', () => {
    test('if user is a seller, endpoint is only for buyers', async () => {});
  });

  describe('should return 404', () => {
    test('when item is not found', async () => {});
  });

  describe('should return 200', () => {
    test('when item is successfully removed', async () => {});
  });
});
