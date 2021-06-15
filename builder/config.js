/**
 * App builder config
 */

module.exports = {
  /**
   * 需要新建在 dist 目录下的文件夹
   */
  mkdirs: [
    'static'
  ],

  /**
   * 从项目根目录复制到 dist 目录的文件夹或文件
   */
  duplicate: [
    'keys',
    'frontendApp'
  ]
}
