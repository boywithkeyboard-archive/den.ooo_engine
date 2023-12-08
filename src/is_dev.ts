export function isDev() {
  return Deno?.env.get('STAGE') === 'development'
}
