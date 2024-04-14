/**
 * Example:
 * {
    "length": 354,
    "name": "error",
    "severity": "ERROR",
    "code": "23505",
    "detail": "Key (user_id, product_id)=(a9ef0273-3a5d-40a0-ae63-0c075a18c10c, 537fd072-890b-46e2-88f6-21231acf65e0) already exists.",
    "schema": "public",
    "table": "shopping_cart_items",
    "constraint": "shopping_cart_items_user_id_product_id_unique",
    "file": "nbtinsert.c",
    "line": "666",
    "routine": "_bt_check_unique"
 */

export class DatabaseError extends Error {
  length: string;
  name: string;
  severity: string;
  code: string;
  detail: string;
  schema: string;
  table: string;
  constraint: string;
  file: string;
  line: string;
  routine: string;

  constructor(
    message: string,
    errorData: {
      length: string;
      name: string;
      severity: string;
      code: string;
      detail: string;
      schema: string;
      table: string;
      constraint: string;
      file: string;
      line: string;
      routine: string;
    },
  ) {
    super(message);
    this.length = errorData.length;
    this.name = errorData.name;
    this.severity = errorData.severity;
    this.code = errorData.code;
    this.detail = errorData.detail;
    this.schema = errorData.schema;
    this.table = errorData.table;
    this.constraint = errorData.constraint;
    this.file = errorData.file;
    this.line = errorData.line;
    this.routine = errorData.routine;
  }

  static isDatabaseError(err: unknown): boolean {
    return (
      err != null &&
      (err as DatabaseError).constructor.name === 'DatabaseError' &&
      (err as DatabaseError).code != null
    );
  }
}
