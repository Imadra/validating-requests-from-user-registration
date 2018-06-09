const ClickHouse = require('@apla/clickhouse')

module.exports = class Store {
  constructor(ch, SHEDDING_INTERVAL) {
    this.ch = ch
    this.STORE = []
    this._isLocked = false
    setInterval(() => this.save(), SHEDDING_INTERVAL)
  }

  push(record) {
    this.STORE.push(record)
  }

  save() {
    if (this._isLocked || !this.STORE.length) { return }
    this._isLocked = true

    const stream = this.ch.query(
      'INSERT INTO pings',
      {
        format: 'JSONEachRow',
        //queryOptions: { database: 'counter' }
      },
      (err, result) => {
        if (err) { console.log(err) }
        this._isLocked = false
      }
    )

    for (let record of this.STORE) {
      stream.write(JSON.stringify(record))
    }

    stream.end()
    this.STORE = []
  }
}
