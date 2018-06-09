const useragent = require('useragent')
const geoip = require('geoip-lite')

function queryParser(query) {
  query.j = query.j? query.j * 1 : -1
  query.k = query.k? query.k * 1 : -1
  return {
    id: query.a || '',
    order: query.b * 1,
    siteId: query.c || '',
    visitorId: query.d || '',
    url: query.e || '',
    userAgent: query.f || '',
    language: query.g || '',
    referrer: query.h || '',
    timezone: query.i &&
              Number.isInteger(query.i * 100) &&
              Number.isInteger(query.i * 60) &&
              (query.i * 1) <= 24 &&
              (query.i * 1) >= -24 ? query.i * 60 : -1,
    width: (Number.isInteger(query.j) && query.j > 0 && query.j < 65535)? query.j : -1,
    height: (Number.isInteger(query.k) && query.k > 0 && query.k < 65535)? query.k : -1
  }
}

function extractIp(req) {
  const nat = (req.headers['x-forwarded-for'] || '').split(', ')
  const real = req.headers['x-real-ip']
  return { real, nat }
}

module.exports = async (pathname, query, req) => {
  const clientData = queryParser(query)
  const ip = extractIp(req)
  const userAgentHeader = req.headers['user-agent'] || ''
  const urlHeader = req.headers['referer'] || ''
  const userAgent = useragent
    .lookup(userAgentHeader || clientData.userAgent)
    .toJSON()
  const geoIp = ip ? geoip.lookup(ip.real) : null
  const time = new Date().toISOString().slice(0, 19).replace('T', ' ')

  const data = {
    ...clientData,
    time,
    date: time.slice(0, 10),
    clientTime: (parseInt(clientData.id.slice(24), 16) - 62167219200000) || 0,
    urlHeader: urlHeader.startsWith('http') ? urlHeader : '',
    ip: ip ? ip.real : '',
    nat: ip ? ip.nat : '',
    userAgentHeader,
    browser: userAgent.family,
    browserVersion:
      userAgent.major + '.' + userAgent.minor + '.' + userAgent.patch,
    os: userAgent.os.family,
    osVersion:
      userAgent.os.major + '.' + userAgent.os.minor + '.' + userAgent.os.patch,
    geoipCity: geoIp ? geoIp.city : '',
    geoipCountry: geoIp ? geoIp.country : '',
    valid : true,
    softwareType: 'browser'
  }

  return data
}
