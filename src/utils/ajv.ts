import Ajv from 'ajv';
import ajvErrors from 'ajv-errors';
import ajvFormats from 'ajv-formats';

const ajv = new Ajv({ allErrors: true });
ajvErrors(ajv);
ajvFormats(ajv);

export { ajv };
