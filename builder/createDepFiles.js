const fs = require('fs')
const path = require('path')
const packageConfig = require('./fileTemplates/package.json')
const copyFile = require('./utils/copyFile')

/**
 * 创建 package.json 文件
 */
function createPackageConfig () {
  const packageFile = JSON.stringify(packageConfig, null, 2)
  fs.writeFileSync(path.join(__dirname, '../dist', 'package.json'), packageFile)
}

/**
 * 创建 README.md 文件
 */
function createReadme () {
  const readmeSrc = path.join(__dirname, './fileTemplates', 'README.md')
  const readmeDest = path.join(__dirname, '../dist', 'README.md')
  copyFile.copySync(readmeSrc, readmeDest)
}

/**
 * 创建依赖文件
 */
function createDepFiles () {
  // 创建 package.json
  createPackageConfig()

  // 创建 README.md
  createReadme()
}

module.exports = createDepFiles
