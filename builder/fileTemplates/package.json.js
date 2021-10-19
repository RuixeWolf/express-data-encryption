const fs = require('fs')
const path = require('path')

// 获取项目 package.json
const packageFile = fs.readFileSync(path.join(__dirname, '../../package.json')).toString()
const packageConfig = JSON.parse(packageFile)

// 生成并导出生产环境的 package.json
module.exports = {
  name: packageConfig.name,
  version: packageConfig.version,
  main: './src/main.js',
  type: 'commonjs',
  scripts: {
    start: 'node ./src/main.js'
  }
}
