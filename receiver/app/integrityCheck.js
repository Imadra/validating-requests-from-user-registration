const isUUID = require('is-uuid')

module.exports = (record) => {
  if (!record) { return }
  const validRecord = (
    /^[0-9a-f]{36}$/.test(record.id) &&
    Number.isInteger(record.clientTime) &&
    record.clientTime >= -62167219200000 &&
    Number.isInteger(record.order) &&
    record.order >= 0 &&
    record.order <= 4 &&
    isUUID.v4(record.siteId) &&
    /^[0-9a-f]{36}$/.test(record.visitorId) &&
    (record.urlHeader || record.url.startsWith('http'))
  ) ? record : null

  if (!validRecord) { 
    validRecord = record
    validRecord.valid = false
  }

  return validRecord
}
