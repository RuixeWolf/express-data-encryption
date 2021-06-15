/**
 * Static file config interface
 */

import { ServeStaticOptions } from 'serve-static'

export interface StaticFileConfig {
  urlPath: string
  folderPath: string
  options?: ServeStaticOptions
}
