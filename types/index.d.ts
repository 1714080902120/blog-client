export interface RtData<T> {
  success: boolean;
  msg: string;
  rt: number | string;
  data: T;
}

export interface Article {
  id: string;
  title: string;
  modify_time: u64;
  description: string;
  author_name: string;
  author_desc: string;
  author_id: string;
}

export type GetArticleData = RtData<{
  list: Article[];
}>;
