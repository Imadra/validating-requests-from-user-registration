const chalk = require('chalk')

const colors = {
  info: ['grey', 'cyan'],
  error: ['red', 'white']
}

function output (type, key, msg) {
  if (msg === undefined) { [key, msg] = [type, key] }
  const [keyColor, msgColor] = colors[type]
  console.log('  ' + chalk[keyColor](key) + ' : ' + chalk[msgColor](msg))
}

module.exports = console
module.exports.info = (key, msg) => output('info', key, msg)
module.exports.error = (key, msg) => output('error', key, msg)
