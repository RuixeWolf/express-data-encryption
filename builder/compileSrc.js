const child_process = require('child_process')

/**
 * 编译项目源码
 */
function compileSrc () {
  // 构建项目源码命令，tsc 路径相对于项目根目录的 package.json
  const buildSrcCmd = 'tsc --project ./'

  // 构建项目源码
  child_process.execSync(buildSrcCmd)
}

module.exports = compileSrc
