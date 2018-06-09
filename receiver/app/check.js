val = require('./validator');

val.validateSite({
	siteId: 1,
	time: '2018-06-08 18:36:04',
	timezone: -360,
	clientTime: new Date().getTime(),
	url: 'http://asdasdasdasd.com',
	referrer: 'http://asdasdasdasd.com',
  width: 768,
  height: 1024,
  os: 'iOS',
  valid: true,
  userAgent: 'iTunes-AppleTV/4.1',
  softwareType: 'browser',
}).then(function(record) {
  if (record) {
    //process.send({ type: 'newRecord', record })
    console.log(record);
  }
  else {
  	console.log('NULL');
  }
});
