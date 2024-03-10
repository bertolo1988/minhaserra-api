describe('PUT /api/users/:id', () => {
  describe('should return 400', () => {
    test.skip('if url param id is not valid uuid', async () => {});

    test.skip('if user tries to update his own id', async () => {});

    test.skip('if user tries to update his own role', async () => {});

    test.skip('if user tries to update email, should use PATCH /users/:id/email', async () => {});

    test.skip('if user tries to update password, should use POST /password-resets', async () => {});

    test.skip('if user tries to update isEmailVerified', async () => {});

    test.skip('if user tries to update isActive', async () => {});

    test.skip('if user tries to update isDeleted', async () => {});

    test.skip('if user tries to update passwordHash', async () => {});

    test.skip('if user tries to update passwordSalt', async () => {});

    test.skip('if user tries to update passwordIterations', async () => {});
  });

  describe('should return 404', () => {
    test.skip('if admin tries to update non existing user data', async () => {});
  });

  describe('should return 401', () => {
    test.skip('if soft deleted user tries to update his own data, fails at authentication', async () => {});
  });

  describe('should return 403', () => {
    test.skip('if inactive user tries to update his own data', async () => {});

    test.skip('if active verified buyer tries to update other user data', async () => {});

    test.skip('if active verified seller tries to update other user data', async () => {});

    test.skip('if active verified moderator tries to update other user data', async () => {});
  });

  describe('should return 200', () => {
    test.skip('if active and verified user tries to update his organizationName', async () => {});

    test.skip('if active and verified user tries to update his firstName', async () => {});

    test.skip('if active and verified user tries to update his lastName', async () => {});

    test.skip('if active and verified user tries to update his termsVersion', async () => {});

    test.skip('if admin tries to update other user data', async () => {});
  });
});
