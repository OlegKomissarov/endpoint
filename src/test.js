const app = require('../app')
const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
chai.use(chaiHttp)

const parameters = {
  startDate: '03.14.2019',
  endDate: '03.18.2019',
  symbol: 'A'
}

// TODO: Add test of parameters compliance
describe('/GET', () => {
  it ('should GET data', done => {
    let url = '/?'
      + 'symbol=' + parameters.symbol
      + '&startDate=' + new Date(parameters.startDate)
      + '&endDate=' + new Date(parameters.endDate)
    chai.request(app)
      .get(url)
      .end((error, response) => {
        describe('response', () => {
          it ('should be 200', done => {
            response.should.have.status(200)
            done()
          })
          it ('should be an array', done => {
            response.body.should.be.a('array')
            done()
          })
        })
        response.body.forEach(company => {
          describe(company.symbol + ' symbol', () => {
            it ('should have all keys', done => {
              company.should.have.all.keys('symbol', 'prices', 'name', 'logo')
              done()
            })
            it ('its prices should be an array', () => {
              company.prices.should.be.a('array')
            })
            if (company.prices.length) {
              company.prices.forEach((priceObject, i) => {
                describe('price object №' + i + 1 + ' of company ' + company.symbol, () => {
                  it ('should have all keys', done => {
                    priceObject.should.have.all.keys('value', 'timestamp')
                    done()
                  })
                  it ('its price property should be a number', done => {
                    priceObject.value.should.be.a('number')
                    done()
                  })
                })
              })
            }
          })
        })
        done()
      })
  })
})
