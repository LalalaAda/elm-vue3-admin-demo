import { formatToDateTime } from '/@/utils/dateUtils'
import projectSetting from '/@/settings/projectSetting'
import { App } from 'vue'

enum ErrorTypeEnum {
  VUE = 'vue',
  SCRIPT = 'script',
  RESOURCE = 'resource',
  AJAX = 'ajax',
  PROMISE = 'promise'
}

interface ErrorLogInfo {
  type: ErrorTypeEnum
  file: string
  name?: string
  message: string
  stack?: string
  detail: string
  url: string
  time?: string
}

class ErrorStack {
  private errorLogInfoList
  private errorLogListCount

  constructor() {
    this.errorLogInfoList = []
    this.errorLogListCount = 0
  }

  getErrorLogInfoList() {
    return this.errorLogInfoList || []
  }

  getErrorLogListCount() {
    return this.errorLogListCount
  }

  addErrorLogInfo(info: ErrorLogInfo) {
    const item = {
      ...info,
      time: formatToDateTime(new Date())
    }
    const list = [item, ...(this.errorLogInfoList || [])]
    this.errorLogInfoList = list
    this.errorLogListCount = list.length
  }

  setErrorLogListCount(count: number): void {
    this.errorLogListCount = count
  }

  addAjaxErrorInfo(error) {
    const errorInfo: Partial<ErrorLogInfo> = {
      message: error.message,
      type: ErrorTypeEnum.AJAX
    }
    if (error.response) {
      const {
        config: { url = '', data: params = '', method = 'get', headers = {} } = {},
        data = {}
      } = error.response
      errorInfo.url = url
      errorInfo.name = 'Ajax Error!'
      errorInfo.file = '-'
      errorInfo.stack = JSON.stringify(data)
      errorInfo.detail = JSON.stringify({ params, method, headers })
      this.addErrorLogInfo(errorInfo as ErrorLogInfo)
    }
  }
}

const errorStore = new ErrorStack()

function processStackMsg(error: Error) {
  if (!error.stack) {
    return ''
  }
  let stack = error.stack
    .replace(/\n/gi, '') // Remove line breaks to save the size of the transmitted content
    .replace(/\bat\b/gi, '@') // At in chrome, @ in firefox
    .split('@') // Split information with @
    .slice(0, 9) // The maximum stack length (Error.stackTraceLimit = 10), so only take the first 10
    .map((v) => v.replace(/^\s*|\s*$/g, '')) // Remove extra spaces
    .join('~') // Manually add separators for later display
    .replace(/\?[^:]+/gi, '') // Remove redundant parameters of js file links (?x=1 and the like)
  const msg = error.toString()
  if (stack.indexOf(msg) < 0) {
    stack = msg + '@' + stack
  }
  return stack
}

function formatComponentName(vm: any) {
  if (vm.$root === vm) {
    return {
      name: 'root',
      path: 'root'
    }
  }

  const options = vm.$options as any
  if (!options) {
    return {
      name: 'anonymous',
      path: 'anonymous'
    }
  }

  const name = options.name || options._componentTag
  return {
    name,
    path: options.__file
  }
}

function vueErrorHandler(err: Error, vm: any, info: string) {
  const { name, path } = formatComponentName(vm)
  errorStore.addErrorLogInfo({
    type: ErrorTypeEnum.VUE,
    name,
    file: path,
    message: err.message,
    stack: processStackMsg(err),
    detail: info,
    url: window.location.href
  })
}

function scriptErrorHandler(
  event: Event | string,
  source?: string,
  lineno?: number,
  colno?: number,
  error?: Error
) {
  if (event === 'Script error.' && !source) {
    return false
  }
  const errorInfo: Partial<ErrorLogInfo> = {}
  colno = colno || (window.event && (window.event as any).errorCharacter) || 0
  errorInfo.message = event as string
  if (error?.stack) {
    errorInfo.stack = error.stack
  } else {
    errorInfo.stack = ''
  }
  const name = source ? source.substring(source.lastIndexOf('/')) : 'script'
  errorStore.addErrorLogInfo({
    type: ErrorTypeEnum.SCRIPT,
    name,
    file: source as string,
    detail: 'lineno' + lineno,
    url: window.location.href,
    ...(errorInfo as Pick<ErrorLogInfo, 'message' | 'stack'>)
  })
  return true
}

function registerPromiseErrorHandler() {
  window.addEventListener(
    'unhandledrejection',
    function (event) {
      errorStore.addErrorLogInfo({
        type: ErrorTypeEnum.PROMISE,
        name: 'Promise Error!',
        file: 'none',
        detail: 'promise error!',
        url: window.location.href,
        stack: 'promise error!',
        message: event.reason
      })
    },
    true
  )
}

function registerResourceErrorHandler() {
  // Monitoring resource loading error(img,script,css,and jsonp)
  window.addEventListener(
    'error',
    function (e: Event) {
      const target = e.target ? e.target : (e.srcElement as any)
      errorStore.addErrorLogInfo({
        type: ErrorTypeEnum.RESOURCE,
        name: 'Resource Error!',
        file: (e.target || ({} as any)).currentSrc,
        detail: JSON.stringify({
          tagName: target.localName,
          html: target.outerHTML,
          type: e.type
        }),
        url: window.location.href,
        stack: 'resource is not found',
        message: (e.target || ({} as any)).localName + ' is load error'
      })
    },
    true
  )
}

export function setupErrorHandle(app: App) {
  const { useErrorHandle } = projectSetting
  if (!useErrorHandle) {
    return
  }

  // Vue exception monitoring;
  app.config.errorHandler = vueErrorHandler

  // script error
  window.onerror = scriptErrorHandler

  //  promise exception
  registerPromiseErrorHandler()

  // Static resource exception
  registerResourceErrorHandler()
}
