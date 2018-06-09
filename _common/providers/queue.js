const NATS = require('nats')

module.exports = {
  init (CONFIG) {
    const nats = NATS.connect(CONFIG)
    return nats
  }
}
