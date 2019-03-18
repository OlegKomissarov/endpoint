const express = require('express')
const prom = require('prom-client')
const router = express.Router()
const datastore = require('./datastore')
const url = require('url')
const { parseUrl } = require('./utils')
const Prometheus = require('prom-client')

router.get('/', (routerRequest, routerResponse) => {
  routerResponse.set('Content-Type', 'application/json')
  let parameters = parseUrl(url.parse(routerRequest.url).query)
  datastore.list(routerRequest.query.pageToken, parameters)
    .then(response => {
      routerResponse.json(response)
    })
    .catch(error => console.log('Rejected: ' + error))
})

router.get('/metrics', (routerRequest, routerResponse) => {
  routerResponse.set('Content-Type', Prometheus.register.contentType)
  routerResponse.end(prom.register.metrics())
})

/**
 * Errors on "/*" routes.
 */
router.use((error, routerRequest, routerResponse, next) => {
  error.response = error.message
  next(error)
})

module.exports = router
