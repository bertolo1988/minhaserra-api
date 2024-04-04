export class PaginationParams {
  offset: number;
  limit: number;

  constructor(
    offset: string | number | undefined,
    limit: string | number | undefined,
    defaultOffset: number = 0,
    defaultLimit: number = 10,
  ) {
    this.offset = offset != null ? parseInt(offset as string) : defaultOffset;
    this.limit = limit != null ? parseInt(limit as string) : defaultLimit;
  }

  getOffset(): number {
    return this.offset;
  }

  getLimit(): number {
    return this.limit;
  }
}
