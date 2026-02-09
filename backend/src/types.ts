export type Req<T> = {
  userId: string;
  body: T;
};

export type Res<T> = {
  body: T;
  status?: number;
};
