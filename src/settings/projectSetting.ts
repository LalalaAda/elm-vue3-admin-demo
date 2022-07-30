import type { ProjectConfig } from '/#/config'

import { StorageTypeEnum } from '/@/enums/storgeEnum'

const settings: ProjectConfig = {
  permissionStorageType: StorageTypeEnum.LOCAL,
  useErrorHandle: false,
  grayMode: false,
  colorWeak: false,
  // themeColor: '#1890ff'
  themeColor: ''
}

export default settings
