# validating-requests-from-user-registration
This is only the part of big application.
Node.js language is used along with clickhouse database system

In this part I am validating through requests came from the user registrations.
Requests can be suspicious, and such data should be sent to separate database collection

Suspicious request can be of many types:
clienttime differs from real time to more than 3 days
url is not starting from http or https, as well as referrer
Data written contains apostrophes: ', ''

And many other validating strategies are done in this repository
