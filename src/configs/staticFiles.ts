/**
 * Static file configs
 */

import path from 'path'
import { StaticFileConfig } from '@interfaces/staticFileConfig'

/**
 * Static file config list
 */
export const staticFileConfigs: Array<StaticFileConfig> = [
  // Default static files config
  {
    urlPath: '/static',
    folderPath: process.env.NODE_ENV === 'production'
      // 生产环境的路径（生产环境只有一个 bundle 文件：dist/src/main.js）
      ? path.join(__dirname, '../static')
      // 开发环境的路径
      : path.join(__dirname, '../../static')
  },

  // Frontend app files config
  {
    urlPath: '',
    folderPath: process.env.NODE_ENV === 'production'
      ? path.join(__dirname, '../frontendApp')
      : path.join(__dirname, '../../frontendApp'),
    options: {
      index: 'index.html'
    }
  }
]
