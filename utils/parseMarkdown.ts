// @ts-ignore
import markdownParser from '@nuxt/content/transformers/markdown';


export const parseMarkdown = (md: any) => markdownParser.parse('custom.md', md);
