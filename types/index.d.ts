export interface RtData<T> {
  success: boolean;
  msg: string;
  rt: number | string;
  data: T;
}

export interface DefaultArticleData {
  id: string;
  title: string;
  description: string;
  modify_time: u64 | string;
  head_pic: string;
}

export interface Article extends DefaultArticleData {
  author_name: string;
  author_desc: string;
  author_id: string;
  head_pic: string;
  [key: string]: any;
}

export interface UserArticle extends DefaultArticleData {
  is_publish: boolean;
  [key: string]: any;
}

export type GetArticleData = RtData<{
  list: Article[];
}>;

export type GetArticleDetail = RtData<null | { Success: ArticleDetail }>;

export type SearchArticlesData = RtData<{
  Success: {
    list: Article[];
  };
}>;

export interface ArticleDetail extends Article {
  content: string;
  author_pic: string;
  [key: string]: any;
}

type IS_LOGIN = "isLogin";
type IS_FORGET_PWD = "isForgetPwd";
type IS_REGISTRY = "isRegistry";

export type PopupState = IS_LOGIN | IS_FORGET_PWD | IS_REGISTRY;

export type OkFnType = {
  [key: string]: (formData: FormData) => Promise<RtData<any>>;
};
export type ValidateType = "email" | "pwd" | "secPwd";

export type FormData = {
  name: string;
  desc: string;
  pwd: string;
  secPwd: string;
  email: string;
  pic: string;
  // phone: string;
};

export type LoginRes = RtData<{
  Success: {
    name: string;
    description: string;
    user_id: string;
  };
}>;

export type RegistryRes = LoginRes;

export interface UserData {
  name: string;
  desc: string;
  email: string; // TODO 这个字段也该移除
  create_time: string;
  pic: string;
  user_id?: string;
  id?: string;
}

export type GetUserDataSuccess = {
  Success: UserData;
};

export type GetUserMsg = RtData<
  GetUserDataSuccess | "NoExist" | "Exist" | "Fail"
>;

export type GetUserArticleSuccess = {
  Success: UserArticle[];
};

export type GetUserArticle = RtData<GetUserArticleSuccess | null>;

export type DeleteArticleRes = RtData<null>;

export type UploadOptions = {
  file: File;
  type: 0 | 1 | 2;
  fileName?: string;
  fileSymbol?: string;
  fileType?: string;
};

export type SearchUserData = RtData<
  | {
      List: Array<{
        name: string;
        desc: string;
        email: string;
        create_time: u64;
        pic: string;
      }>;
    }
  | "Fail"
>;

export interface Categoires {
  id: string;
  name: string;
  description: string;
}

export interface SetArticleData {
  id: string;
  title: string;
  description: string;
  head_pic: string;
  is_publish: boolean;
  md_link: string;
}

export type route = { isMatched: boolean; fn: (nuxtApp: any) => void };
