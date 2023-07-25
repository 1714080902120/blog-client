
const { app } = useRuntimeConfig();
export function genUrl (relativePath: string) {
  return `${app.apiBase}/${relativePath}`
}
