export class QueryDto {
  readonly currentPage: number | string;
  readonly pageLimit?: number;
  readonly search?: string;
  readonly filterBy?: string;
  readonly sort?: string; // [-1, 1]
  readonly start?: Date;
  readonly end?: Date;
  readonly fieldsToSelect?: string;
}
