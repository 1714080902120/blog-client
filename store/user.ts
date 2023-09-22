import { defineStore } from "pinia";
import { UserArticle } from "types";

// 由于nuxt序列化无法支持函数（包括构造函数），所以这个比较优雅的写法不支持
// class ProfileArticlePageState {
//   constructor(isPublish: boolean) {}
//   list: Array<UserArticle> = [];
//   isEnd: boolean = false;
//   pageNo: number = 0;
//   limit: number = 20;
//   setList (list: UserArticle[] = []) {
//     this.list.push(...list);
//   }
//   updatePageNo (num: number) {
//     this.pageNo = num;
//   }
//   setEnd (state: boolean) {
//     this.isEnd = state;
//   }
//   delArticle (id: string) {
//     const index = this.list.findIndex(item => item.id === id);
//     index !== -1 && (this.list.splice(index, 1));
//   }
// }

type ProfileArticlePageState = {
  list: Array<UserArticle>;
  isEnd: Boolean;
  pageNo: number;
  limit: number;
};

export const useUserMsg = defineStore("user_msg", () => {


  // 用户信息 start

  const msg = reactive({
    name: "",
    description: "这个人很懒，什么都没留下~",
    id: "",
    registry_time: -1,
    pic: "",
  });

  const isLogin = ref(false);

  function setUserMsg({
    name,
    description,
    desc,
    user_id,
    id,
    create_time,
    pic,
    user_pic,
  }: { [key: string]: any } = {}) {
    msg.name = name;
    msg.description = description || desc;
    msg.id = user_id || id;
    msg.registry_time = create_time;
    msg.pic = pic || user_pic;
    isLogin.value = true;
  }


  // 用户信息 end






  // 用户个人中心 start


  const isPub: Ref<boolean> = ref(true);

  const publish: ProfileArticlePageState = reactive({
    list: [],
    isEnd: false,
    pageNo: 0,
    limit: 20,
  });
  const draft: ProfileArticlePageState = reactive({
    list: [],
    isEnd: false,
    pageNo: 0,
    limit: 20,
  });

  const currInstance = computed(() => (isPub.value ? publish : draft));

  function setList(list: UserArticle[] = []) {
    currInstance.value.list.push(...list);
  }
  function updatePageNo(num: number) {
    currInstance.value.pageNo = num;
  }
  function setEnd(state: boolean) {
    currInstance.value.isEnd = state;
  }
  function delArticle(id: string) {
    const index = currInstance.value.list.findIndex((item) => item.id === id);
    index !== -1 && currInstance.value.list.splice(index, 1);
  }

  function setArticles(list: UserArticle[] = []) {
    if (currInstance.value.isEnd) return;
    updatePageNo(currInstance.value.pageNo + 1);
    setList(list);
    if (list.length <= 0) {
      setEnd(true);
    }
  }

  function getTargetArticlesList(isPublish: boolean) {
    return isPublish ? publish : draft;
  }

  function updateIsPubState(state: boolean) {
    isPub.value = state;
  }

  // 用户个人中心 end




  // 用户编辑数据 start
  const editFormData = reactive({
    id: "",
    title: "",
    description: "",
    mdContent: "",
    headPic: "",
    modify_time: ''
  });

  function updateEditFormData (opt: Record<string, string>) {
    const { title = '', description = '', head_pic = '', content = '', modify_time = '' } = opt || {};
    editFormData.title = title;
    editFormData.description = description;
    editFormData.mdContent = content;
    editFormData.headPic = head_pic;
    editFormData.modify_time = modify_time;
  }

  // 用户编辑数据 end













  return {
    // 用户基础数据
    msg,
    isLogin,
    setUserMsg,

    // 用户中心数据
    publish,
    draft,
    isPub,
    delArticle,
    setArticles,
    updateIsPubState,
    getTargetArticlesList,

    // 用户编辑页数据
    editFormData,
    updateEditFormData

  };
});
