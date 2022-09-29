import AES from 'crypto-js/aes'
import SHA256 from 'crypto-js/sha256'
import encUtf8 from 'crypto-js/enc-utf8'
import encHex from 'crypto-js/enc-hex'

/** AES 加解密允许的超时时间，单位为毫秒 */
// 允许超时的时间在 1 分钟内
const AES_TIMEOUT = 60 * 1000

/** 验证 AES 数字签名选项 */
interface VerifyAesSignatureOptions {
  data: Record<string, unknown>
  signature: string
  aesSecretKey: string
}

/**
 * 验证 AES 数字签名
 * @description 验证算法：通过 AES 密钥解密数字签名，获取数据 SHA256 哈希值，
 * 将现有数据 key 按照 a-z 排序，将 Record 转为 JSON 字符串，
 * 计算字符串 SHA256 哈希值，与通过数字签名解密出来的哈希值进行对比
 * @param {VerifyAesSignatureOptions} options - 选项
 * @returns {boolean} 验证结果
 */
export function verifyAesSignature (
  options: VerifyAesSignatureOptions
): boolean {
  // 解密签名，获取原数据哈希值
  const currentHashStr: string = AES.decrypt(
    options.signature,
    options.aesSecretKey
  ).toString(encUtf8)
  if (!currentHashStr) return false

  // 计算现有数据的 SHA256 哈希值
  const record: Record<string, unknown> = {}
  Object.keys(options.data).sort().forEach(key => {
    record[key] = options.data[key]
  })
  const originalHashStr = SHA256(JSON.stringify(record)).toString(encHex)
  return currentHashStr === originalHashStr
}

/**
 * AES 解密与验证
 * @description 验证原文中的时间戳，防止中间人攻击时保存密文伪造请求。
 * 默认的加密原文格式：[数据]@#@#@[时间戳]
 * @param {string} cipherText - 包含时间戳信息的密文
 * @param {string} aesSecretKey - AES 密钥
 * @param {string} [delimiter = '@#@#@'] - 数据与时间戳的分隔符
 * @returns {string | false} 解密结果
 */
export function aesDecryptWithTimestamp (
  cipherText: string,
  aesSecretKey: string,
  delimiter: string = '@#@#@'
): string | false {
  // AES 解密
  let decryptedText: string
  try {
    decryptedText = AES.decrypt(
      cipherText,
      aesSecretKey
    ).toString(encUtf8)
  } catch (error) {
    return false
  }

  // 解析原数据与时间戳
  const [originalData, timestampStr] = decryptedText.split(delimiter)
  const timestamp = Number.parseInt(timestampStr)

  // 验证时间戳
  if (!timestamp || Date.now() - timestamp > AES_TIMEOUT) return false

  // 验证通过
  return originalData
}
