require('dotenv').config()
const express = require('express')
const app = express()
const api = require('./src/api')
const prometheus = require('prom-client')

const metricsInterval = prometheus.collectDefaultMetrics()
const httpRequestDuration = new prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

app.use((request, response, next) => {
  response.locals.startTime = Date.now()
  next()
})

app.use('/', api)

app.use((request, response, next) => {
  const responseTime = Date.now() - response.locals.startTime
  httpRequestDuration
    .labels(request.path)
    .observe(responseTime)
  next()
})

app.use((request, response) => {
  response.status(404).send('Not Found')
})

app.use((error, request, response) => {
  console.error(error)
  response.status(500).send(error.response || 'Something broke!')
})

const server = app.listen(process.env.PORT, () => {
  console.log('App listening on port ' + server.address().port)
})

process.on('SIGTERM', () => {
  clearInterval(metricsInterval)
})

module.exports = app
