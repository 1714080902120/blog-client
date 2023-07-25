
export function genUrl (url: string) {
    const { app } = useRuntimeConfig();
    return `${app.apibase}${url}`
}