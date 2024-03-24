import { ErrorObject, ValidateFunction } from 'ajv';
import Koa from 'koa';
import { ValidationError } from '../../types/errors';
import { ajv } from '../../utils/ajv';
import { ImageUtils } from '../../utils/image-utils';
import {
  CreateProductImageDto,
  CreateProductImageDtoSchema,
} from './products.types';

const createProductImageDtoValidator: ValidateFunction =
  ajv.compile<CreateProductImageDto>(CreateProductImageDtoSchema);

const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

export class ProductImagesValidator {
  static async validateCreateProductImage(ctx: Koa.Context, next: Koa.Next) {
    const validBody = createProductImageDtoValidator(ctx.request.body);
    if (!validBody)
      throw new ValidationError(
        createProductImageDtoValidator.errors as ErrorObject[],
      );
    const isImageValid = await ImageUtils.isValidBase64Image(
      ctx.request.body.base64Image,
    );
    if (!isImageValid) {
      throw new ValidationError(`'base64Image' is not a valid base64 image`);
    }
    const imageExtension = ImageUtils.getBase64ImageExtension(
      ctx.request.body.base64Image,
    );
    if (!ALLOWED_IMAGE_EXTENSIONS.includes(imageExtension)) {
      throw new ValidationError(
        `'base64Image' extension is not allowed. Allowed extensions are: ${ALLOWED_IMAGE_EXTENSIONS.join(', ')}`,
      );
    }
    await next();
  }
}
