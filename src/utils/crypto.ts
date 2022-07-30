import { encrypt, decrypt } from 'crypto-js/aes'
import { parse } from 'crypto-js/enc-utf8'

import pkcs7 from 'crypto-js/pad-pkcs7'
import ECB from 'crypto-js/mode-ecb'
import md5 from 'crypto-js/md5'
import UTF8 from 'crypto-js/enc-utf8'
import Base64 from 'crypto-js/enc-base64'

export interface EncryptionParams {
  key: string
  iv: string
}

export class AesEncryption {
  private key
  private iv

  constructor(opt: Partial<EncryptionParams> = {}) {
    const { key, iv } = opt
    if (key) {
      this.key = parse(key)
    }
    if (iv) {
      this.iv = parse(iv)
    }
  }

  get getOptions() {
    return {
      mode: ECB,
      padding: pkcs7,
      iv: this.iv
    }
  }

  encryptByAES(text: string) {
    return encrypt(text, this.key, this.getOptions).toString()
  }

  decryptByAES(text: string) {
    return decrypt(text, this.key, this.getOptions).toString(UTF8)
  }
}

export function encryptByBase64(text: string) {
  return UTF8.parse(text).toString(Base64)
}
export function decodeByBase64(text: string) {
  return Base64.parse(text).toString(UTF8)
}

export function encryptByMd5(password: string) {
  return md5(password).toString()
}
