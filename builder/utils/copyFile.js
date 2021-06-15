const fs = require('fs')
const path = require('path')

/**
 * Sync copy file or directory
 * @param {string} copiedPath - Source file path
 * @param {string} resultPath - Destination path
 */
function copySync (copiedPath, resultPath) {
  const isDir = fs.statSync(copiedPath).isDirectory()

  // Copy directory
  if (isDir) {
    // Create result directory
    fs.mkdirSync(resultPath, { recursive: true })

    // Get files from copiedPath
    const fileList = fs.readdirSync(copiedPath)

    // Copy files or directories
    for (const file of fileList) {
      const src = path.join(copiedPath, file)
      const dest = path.join(resultPath, file)
      copySync(src, dest)
    }
    return
  }

  // Copy file
  fs.copyFileSync(copiedPath, resultPath)
}

module.exports = { copySync }
