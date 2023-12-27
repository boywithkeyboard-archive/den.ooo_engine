export async function getText(url) {
  return await (await fetch(url)).text()
}
