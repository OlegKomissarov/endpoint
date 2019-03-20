const express = require('express')
const router = express.Router()
const datastore = require('./datastore')
const prometheus = require('prom-client')

router.get('/', (routerRequest, routerResponse) => {
  datastore.list(routerRequest.query.pageToken, routerRequest.query)
    .then(response => {
      routerResponse.json(response)
    })
    .catch(error => console.log('Rejected: ' + error))
})

router.get('/metrics', (routerRequest, routerResponse) => {
  routerResponse.set('Content-Type', prometheus.register.contentType)
  routerResponse.end(prometheus.register.metrics())
})

/**
 * Errors on "/*" routes.
 */
router.use((error, routerRequest, routerResponse, next) => {
  error.response = error.message
  next(error)
})

module.exports = router
