export interface LockInfo {
  pwd?: string | undefined
  isLock?: boolean
}

export interface UserInfo {
  userId: string | number
  username: string
  realName: string
  avatar: string
  desc?: string
  homePath?: string
}
