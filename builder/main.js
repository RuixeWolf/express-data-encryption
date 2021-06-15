/**
 * App builder
 */

const printLog = require('./utils/printLog')
const initDir = require('./initDir')
const compileSrc = require('./compileSrc')
const createDepFiles = require('./createDepFiles')

// 开始构建
const startTime = Date.now()
printLog('Start building...')

// 初始化 dist 目录
printLog('Initializing output directory...')
initDir()

// 编译项目源码
printLog('Compiling source code...')
compileSrc()

// 创建所需文件
printLog('Creating dependency files...')
createDepFiles()

// 构建完成
const buildingTime = Date.now() - startTime
printLog(`Build complete in ${buildingTime} ms.`, 'The dist directory is ready to be deployed.', 1)
