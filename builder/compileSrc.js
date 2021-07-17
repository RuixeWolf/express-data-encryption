const esbuild = require('esbuild')
const path = require('path')

/**
 * 编译项目源码
 */
function compileSrc () {
  // 使用 esbuild 打包项目
  esbuild.buildSync({
    entryPoints: {
      main: path.join(__dirname, '../src/main.ts')
    },
    outdir: path.join(__dirname, '../dist/src'),
    bundle: true,
    minify: true,
    platform: 'node',
    external: [
      // MongoDB 需要的可选库 mongodb-client-encryption、saslprep
      'mongodb-client-encryption',
      'saslprep'
    ],
    // 设置 NODE_ENV 为生产环境
    define: { 'process.env.NODE_ENV': '"production"' }
  })
}

module.exports = compileSrc
