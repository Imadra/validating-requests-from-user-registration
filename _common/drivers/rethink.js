const rethinkdb = require('rethinkdbdash')({
  pool: false
})

module.exports = {
  async init (CONFIG) {
    const connection = await rethinkdb.connect(CONFIG)
    return { connection, r: rethinkdb }
  }
}