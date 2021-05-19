/**
 * Static file configs
 */

import path from 'path'
import { StaticFileConfig } from '@interfaces/staticFileConfig'

/**
 * Static file config list
 */
export const staticFileConfigs: StaticFileConfig[] = [
  // Default static files config
  {
    urlPath: '/static',
    folderPsth: path.join(__dirname, '../../static')
  },

  // Frontend app files config
  {
    urlPath: '',
    folderPsth: path.join(__dirname, '../../frontendApp'),
    options: {
      index: 'index.html'
    }
  }
]
