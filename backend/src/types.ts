export type Req<T> = {
  body: T;
};

export type Res<T> = {
  body: T;
  status?: number;
};
