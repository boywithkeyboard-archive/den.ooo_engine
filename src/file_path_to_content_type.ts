export function filePathToContentType(str: string) {
  return str.endsWith('.jsx')
    ? 'text/jsx'
    : str.endsWith('.tsx')
    ? 'text/tsx'
    : str.endsWith('.js') || str.endsWith('.mjs')
    ? 'text/javascript'
    : str.endsWith('.ts')
    ? 'text/typescript'
    : str.endsWith('.json')
    ? 'application/json'
    : str.endsWith('.wasm')
    ? 'application/wasm'
    : 'text/plain'
}
