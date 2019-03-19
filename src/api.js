const express = require('express')
const prom = require('prom-client')
const router = express.Router()
const datastore = require('./datastore')
const Prometheus = require('prom-client')

router.get('/', (routerRequest, routerResponse) => {
  routerResponse.set('Content-Type', 'application/json')
  datastore.list(routerRequest.query.pageToken, routerRequest.query)
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
