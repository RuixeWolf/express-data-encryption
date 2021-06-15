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
    folderPath: path.join(__dirname, '../../static')
  },

  // Frontend app files config
  {
    urlPath: '',
    folderPath: path.join(__dirname, '../../frontendApp'),
    options: {
      index: 'index.html'
    }
  }
]
