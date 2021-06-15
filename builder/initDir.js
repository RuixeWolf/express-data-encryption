const fs = require('fs')
const path = require('path')
const config = require('./config')
const copyFile = require('./utils/copyFile')

/**
 * 初始化 dist 目录
 */
function initDistDir () {
  // 移除原有的 dist 目录
  fs.rmSync(path.join(__dirname, '../dist'), { recursive: true, force: true })

  // 新建 dist 目录
  fs.mkdirSync(path.join(__dirname, '../dist'))
}

/**
 * 新建 dist 目录下的子目录
 */
function mkSubDirs () {
  // 需要新建在 dist 下的子目录
  const dirList = config.mkdirs

  // 创建 dist 下的子目录
  for (const dir of dirList) {
    fs.mkdirSync(`${path.join(__dirname, '../dist')}/${dir}`)
  }
}

/**
 * 从项目根目录复制到 dist 目录的文件夹或文件
 */
function duplicateFiles () {
  // 需要从项目根目录复制到 dist 目录的文件夹或文件
  const fileList = config.duplicate

  // 复制目录或文件
  for (const file of fileList) {
    const src = path.join(__dirname, '../', file)
    const dest = path.join(__dirname, '../dist', file)
    copyFile.copySync(src, dest)
  }
}

/**
 * 初始化构建输出目录
 */
function initDir () {
  // 初始化 dist 目录
  initDistDir()

  // 新建 dist 目录下的子目录
  mkSubDirs()

  // 从项目根目录复制到 dist 目录的文件夹或文件
  duplicateFiles()
}

module.exports = initDir
