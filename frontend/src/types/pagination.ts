export interface PaginationMeta {
  page: number;
  pages: number;
  count: number;
  limit: number;
  next: number | null;
  prev: number | null;
}
