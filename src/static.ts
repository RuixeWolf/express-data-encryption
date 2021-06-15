/**
 * Main static files controller
 */

import epxress, { Express, static as expressStatic } from 'express'
import { staticFileConfigs } from '@configs/staticFiles'

const app: Express = epxress()

for (const staticFileConfig of staticFileConfigs) {
  app.use(
    staticFileConfig.urlPath,
    expressStatic(staticFileConfig.folderPath, staticFileConfig.options)
  )
}

export default app
