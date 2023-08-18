export interface RtData<T> {
  success: boolean;
  msg: string;
  rt: number | string;
  data: T;
}

export interface Article {
  id: string;
  title: string;
  modify_time: u64 | string;
  description: string;
  author_name: string;
  author_desc: string;
  author_id: string;
}

export type GetArticleData = RtData<{
  list: Article[];
}>;

export type SearchArticlesData = RtData<{
  Success: {
    list: Article[]
  }
}>

export interface ArticleDetail extends Article {
  content: string;
  [key: string]: any;
}
