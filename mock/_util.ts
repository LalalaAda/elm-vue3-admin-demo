function pagination<T = any>(pageNo: number, pageSize: number, array: T[]): T[] {
  const offset = (pageNo - 1) * pageSize
  const endPoint = offset + pageSize
  const alength = array.length
  const ret = endPoint >= alength ? array.slice(offset, alength) : array.slice(offset, endPoint)
  return ret
}

export function resSuccess<T = Recordable>(data: T, { message = 'success' } = {}) {
  return {
    code: 0,
    data,
    message
  }
}
export function resPageSuccess<T = any>(
  page: number,
  pageSize: number,
  list: T[],
  { message = 'page success' } = {}
) {
  const pageData = pagination(page, pageSize, list)
  return {
    ...resSuccess({
      list: pageData,
      total: list.length
    }),
    message
  }
}
export function resError(message = 'error', { code = -1, data = null } = {}) {
  return {
    code,
    data,
    message
  }
}

interface requestParams {
  method: string
  body: any
  headers?: { authorization?: string }
  query: any
}

export function getRequestToken({ headers }: requestParams): string | undefined {
  return headers?.authorization
}
