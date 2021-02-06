export declare interface ResponseConfig<T> {
  code: number;
  msg?: string;
  data: T;
}

export declare interface ListResponseConfig<T> {
  list: T[];
  page: number;
  pageSize: number;
  total: number;
}

export declare interface ListRequestConfig {
  page: number;
  pageSize: number;
}
