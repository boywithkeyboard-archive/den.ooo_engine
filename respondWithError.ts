const ERRORS = {
  BAD_MODULE: 400,
  BAD_VERSION: 400,
  UNINDEXED_MODULE: 404,
  NOT_FOUND: 404,
}

export function respondWithError(message: keyof typeof ERRORS) {
  return new Response(message, {
    status: ERRORS[message],
    headers: {
      'content-type': 'text/plain; charset=utf-8',
    },
  })
}
