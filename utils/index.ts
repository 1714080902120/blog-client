import DOMPurify from "isomorphic-dompurify";

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

export function genRandomStr(length = 36) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = Date.now().toString(36);
  for (let i = 0; i < length - result.length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// 由于sanitize会不管不顾的删掉任何涉及xss的东西，包括markdown code block里面的东西，所以这里需要做一下保护。
export function protectMdCodeBlockFromSanitize(content: string): string {
  // Define the regular expression to match markdown code blocks
  const regex = /```[\s\S]*?```/g;

  // The text to be sanitized

  // Find all markdown code blocks in the text
  let matches = content.match(regex);

  // If there are any matches, replace them with placeholders
  if (matches) {
    matches.forEach((match, i) => {
      content = content.replace(match, `{{CODE_BLOCK_${i}}}`);
    });
  }

  // Sanitize the text with DOMPurify
  let sanitizedText = DOMPurify.sanitize(content);

  // If there were any matches, replace the placeholders with the original code blocks
  if (matches) {
    matches.forEach((match, i) => {
      sanitizedText = sanitizedText.replace(`{{CODE_BLOCK_${i}}}`, match);
    });
  }

  return sanitizedText;
}
