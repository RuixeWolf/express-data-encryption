const chalk = require('chalk')

/**
 * Print log message
 * @param {string} message - Printed message
 * @param {string} [detail = ''] - Message detail
 * @param {number} [level = 0] - Message level
 * + 0: Information
 * + 1: Done
 * + 2: Warning
 * + 3: Error
 */
function printLog (message, detail = '', level = 0) {
  // Init data
  let messageType
  const timeStr = `[${new Date().toLocaleTimeString()}]`

  // Handle message level
  switch (level) {
    case 0:
      // Information
      messageType = chalk.black.bgBlue(' INFO ')
      message = chalk.cyanBright(message)
      detail = chalk.cyan(detail)
      break

    case 1:
      // Done
      messageType = chalk.black.bgGreen(' DONE ')
      message = chalk.greenBright(message)
      detail = chalk.green(detail)
      break

    case 2:
      // Warning
      messageType = chalk.black.bgYellow(' WARN ')
      message = chalk.yellowBright(message)
      detail = chalk.yellow(detail)
      break

    case 3:
      // Error
      messageType = chalk.black.bgRed(' ERROR ')
      message = chalk.redBright(message)
      detail = chalk.red(detail)
      break

    default:
      // Default message type is Information
      messageType = chalk.black.bgBlue(' INFO ')
      message = chalk.cyanBright(message)
      detail = chalk.cyan(detail)
      break
  }

  // Print log message
  const content = `${messageType} ${timeStr} ${message} ${detail}`
  console.log(content)
}

module.exports = printLog
