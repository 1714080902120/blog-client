export function genUrl(url: string) {
  const { app } = useRuntimeConfig();
  return `${app.apibase}${url}`;
}

export function wrapDivForCode(content: any) {
  for (let i = 0; i < content?.body?.children?.length || 0; i++) {
    const el = content.body.children[i];
    if (el.type == "element" && el.tag == "code") {
      const div = {
        props: el.props, // 直接继承
        tag: "div",
        type: "element",
        children: el.children,
      };
      el.children = [div];
    }
  }
  return content;
}

export function timestamp2Date(timestep: number): string {
  const date = new Date(timestep * 1000);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();

  return `${year}.${month}.${day}`;
}

export function debounce(
  func: Function,
  wait: number = 250,
  immediate: boolean = true
) {
  let timeout: NodeJS.Timeout | undefined | null;
  return function () {
    /* @ts-ignore */
    const context = this,
      args = arguments;
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout as NodeJS.Timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}
