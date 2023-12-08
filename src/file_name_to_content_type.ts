export function fileNameToContentType(fileName: string) {
  return fileName.endsWith('.jsx')
    ? 'text/jsx'
    : fileName.endsWith('.tsx')
    ? 'text/tsx'
    : fileName.endsWith('.js') || fileName.endsWith('.mjs')
    ? 'text/javascript'
    : fileName.endsWith('.ts')
    ? 'text/typescript'
    : fileName.endsWith('.json')
    ? 'application/json'
    : fileName.endsWith('.wasm')
    ? 'application/wasm'
    : 'text/plain'
}
