/**
 * Static file config interface
 */

import { ServeStaticOptions } from 'serve-static'

export interface StaticFileConfig {
  urlPath: string
  folderPsth: string
  options?: ServeStaticOptions
}
