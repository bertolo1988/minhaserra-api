describe('GET /products/:id/images', () => {
  describe('should return 404', () => {
    test('if product id does not exist', async () => {
      // TODO: Implement test
    });
  });

  describe('should return 400', () => {
    test('if product id is malformed uuid', async () => {
      // TODO: Implement test
    });
  });

  describe('without authentication, should return 200', () => {
    test('and a list of images for a product', async () => {
      // TODO: Implement test
    });

    test('and an empty list of images if product has no images', async () => {
      // TODO: Implement test
    });
  });
});
