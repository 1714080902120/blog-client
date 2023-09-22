export const ON_SYSTEM_THEME_CHANGE = "onSystemThemeChange";
export const ON_SCROLL_REACH_ASIDE = "onScrollReachAside";

export const SHOW_BACK_TOP_BTN = 'showBackTopBtn'

export const ON_POPUP_OUT = "onPopupOut";
export const ON_POPUP_CLOSE = "onPopupClose";
export const ON_LOGIN_POPUP = "onLoginPopup";
export const ON_REGISTRY_POPUP = "onRegistryPopup";
export const ON_POPUP_INPUT_ENTER = "onPopupInputEnter";
export const IS_LOGIN = "isLogin";
export const IS_REGISTRY = "isRegistry";
export const IS_FORGET_PWD = "isForgetPwd";
export const ON_POPUP = "onPopup";
export const ON_ALERT_SHOW = "onAlertShow";
export const ON_ALERT_HIDE = "onAlertHide";

export const POPUP_TITLE: Record<string, any> = {
  [IS_LOGIN]: "登录",
  [IS_REGISTRY]: "注册",
  [IS_FORGET_PWD]: "修改密码",
};

export const AIM = ["bottom", "top"];

export const TOKEN_KEY = `_token`;

export const SHOW_TOAST = `showToast`;
export const HIDE_TOAST = `hideToast`;

export const CACHE_IS_PUBLISH = "cacheIsPublish";

export const UPLOAD_MD = 0;
export const UPLOAD_ARTICLE_IMG = 1;
export const UPLOAD_USER_IMG = 2;

export const MD_CONTENT_MAX_LENGTH = 10000 * 10;
export const UPLOAD_SINGLE_FILE_SIZE = 5 * 1024 * 1024;
export const CHUNK_NUM = 8;
export const UPLOAD_FILE_MAX_SIZE = 1024 * 1024 * 100;
export const PER_MB = 1024 * 1024;

export const SHOW_IMAGE_EDITOR = "showImageEditor";
export const HIDE_IMAGE_EDITOR = "hideImageEditor";
export const ON_CANCEL_IMAGE_EDITOR = "onCancelImageEditor";

export const PROFILE_ARTICLE_LIST = "article-list";
export const PROFILE_ARTICLE_EDIT = "article-edit";

export const INTERAL_ERROR_RETURN = {
  success: false,
  rt: "Fail",
  data: null,
  msg: "内部错误",
};

export const ARTICLE_EDITOR_TOOLBARS = [
  "bold",
  "underline",
  "italic",
  "-",
  "title",
  "strikeThrough",
  "sub",
  "sup",
  "quote",
  "unorderedList",
  "orderedList",
  "task",
  "-",
  "codeRow",
  "code",
  "link",
  "image",
  "table",
  "mermaid",
  "katex",
  "-",
  "revoke",
  "next",
  "save",
  "=",
  "pageFullscreen",
  "fullscreen",
  "preview",
  "htmlPreview",
  "catalog",
];


export const ON_SHOW_FEEDBACK_POPUP = 'onShowFeedbackPopup';
