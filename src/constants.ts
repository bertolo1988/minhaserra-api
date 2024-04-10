// numeric limits in postgres https://www.postgresql.org/docs/current/datatype-numeric.html

const CONSTANTS = {
  PASSWORD_RESET_TOKEN_LENGTH: 32,
  PASSWORD_RESET_EXPIRY_HOURS: 2,
  CONTACT_VERIFICATION_EXPIRY_HOURS: 12,
  DEFAULT_AMOUNT_OF_SALT_ITERATIONS: 128,
  NO_REPLY_EMAIL_ADDRESS: 'no-reply@minhaserra.com',
  JWT_EXPIRATION_HOURS: 6,
  JWT_ALGORITHM: 'HS512',
  MAX_ADDRESSES_PER_USER: 10,
  JSON_BODY_LIMIT: '11mb',
  MAX_BASE64_IMAGE_SIZE: 8000000,
  DEFAULT_MAX_STRING_SIZE: 100,
  DESCRIPTION_MAX_STRING_SIZE: 1000,
  MAX_IMAGES_PER_PRODUCT: 7,
  MAX_AVAILABLE_QUANTITY: 2147483647,
  MAX_PRICE_IN_CENTS: Number.MAX_SAFE_INTEGER,
  MAX_PRODUCT_SEARCH_STRING_SIZE: 20,
  MAX_PAGINATION_LIMIT: 30,
};

export default CONSTANTS;
