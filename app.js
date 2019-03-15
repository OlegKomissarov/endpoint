require('dotenv').config()
const path = require('path')
const express = require('express')
const app = express()

const Prometheus = require('prom-client')
const metricsInterval = Prometheus.collectDefaultMetrics()
const httpRequestDuration = new Prometheus.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['route'],
  buckets: [0.10, 5, 15, 50, 100, 200, 300, 400, 500]
})

app.disable('etag')
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'pug')
app.set('trust proxy', true)

app.use((request, response, next) => {
  response.locals.startTime = Date.now()
  next()
})

app.use('/', require('./src/api'))

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

// ???
process.on('SIGTERM', () => {
  clearInterval(metricsInterval)
  // server.close(err => {
  //   if (err) {
  //     console.error(err)
  //     process.exit(1)
  //   }
  //   process.exit(0)
  // })
})

module.exports = app
