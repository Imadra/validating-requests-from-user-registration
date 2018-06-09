require('module-alias/register')

const url = require('url')
const micro = require('micro')
const process = require('process')
const cluster = require('cluster')
const config = require('config')
const ClickHouse = require('@apla/clickhouse')

const processData = require('@app/processData')
const integrityCheck = require('@app/integrityCheck')
const validator = require('@app/validator')

;(async function(){

/*const db = await require('@driver/postgres')
  .init(config.get('DB'))
  .catch(console.error)*/

//validator.setDB(db)

const Store = require('@app/store')

if (cluster.isMaster) {
  const numCPUs = require('os').cpus().length
  const ch = new ClickHouse ({
    host: config.get('CLICKHOUSE').host,
    port: config.get('CLICKHOUSE').port
  })
  const store = new Store(
    ch,
    config.get('CLICKHOUSE').shedding_interval
  )
  const errorStore = new Store(
    ch,
    config.get('CLICKHOUSE').shedding_interval
  )

  for (let i = 0; i < numCPUs; i++) {
    const worker = cluster.fork()

    worker.on('message', function(msg) {
      switch (msg.type) {
        case 'newRecord': return store.push(msg.record)
        case 'newErrorRecord': return errorStore.push(msg.record)
      }
    })

    console.log('Started worker #' + i)
  }
} else {
  const { send, createError } = micro

  function addCORS(res) {
    res.setHeader('Access-Control-Allow-Origin', '*')
  }

  function checkEndpoint(pathname) {
    if (pathname !== config.get('SERVER').endpoint) {
      throw createError(404, 'Resource not found')
    }
  }

  function checkMethod(req) {
    if (req.method !== 'GET') {
      throw createError(405, 'Method not allowed')
    }
  }

  function errorHandler(err, res) {
    if (!err.statusCode) {
      console.error(err)
      err.statusCode = 500
      err.message = 'Internal Server Error'
    }
    send(res, err.statusCode, err.message)
  }

  const server = micro(async (req, res) => {
    const { pathname, query } = url.parse(req.url, true)

    try {
      addCORS(res)
      checkEndpoint(pathname)
      checkMethod(req)

      processData(pathname, query, req)
        .then(validator.validateSite)
        .then(integrityCheck)
        .then(function(record) {
          if (record.valid) {
            //   if (record.ip === 'xx.xx.xx.xx') console.log(record)
            process.send({ type: 'newRecord', record })
          }
          else {
            process.send({ type: 'newErrorRecord', record})
          }
        })
        .catch(console.error)

      send(res, 204)
    } catch (err) {
      errorHandler(err, res)
    }
  })
  
  server.listen(config.get('SERVER').port)
}

})();