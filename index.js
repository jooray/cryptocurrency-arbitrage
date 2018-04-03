var rp = require("request-promise")
var fx = require("money")
var oxr = require('open-exchange-rates')
oxr.set({ app_id: 'XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX' })

function get_coinbase_price(pair) {
  var options = { method: 'GET',
  url: 'https://api.coinbase.com/v2/prices/' + pair +'/sell',
  headers: { 'Cache-Control': 'no-cache' },
  json: true }

  return rp(options)
}

function get_korbit_price(pair) {
  var options = { method: 'GET',
  url: 'https://api.korbit.co.kr/v1/ticker/detailed',
  qs: { currency_pair: pair },
  headers: { 'Cache-Control': 'no-cache' },
  json: true }

  return rp(options)
}

function get_kraken_prices(pairs) {
var options = { method: 'GET',
  url: 'https://api.kraken.com/0/public/Ticker',
  qs: { pair: pairs },
  headers: { 'Cache-Control': 'no-cache' },
  json: true }

  return rp(options)
}

var currency_pairs = [
  { name: "BCH",
    kraken_pair: "BCHEUR",
    kraken_currency: "EUR",
    korbit_pair: "bch_krw",
    korbit_currency: "KRW",
    coinbase_pair: "BCH-EUR",
    coinbase_currency: "EUR"
  },
  { name: "BTC",
    kraken_pair: "XXBTZEUR",
    kraken_currency: "EUR",
    korbit_pair: "btc_krw",
    korbit_currency: "KRW",
    coinbase_pair: "BTC-EUR",
    coinbase_currency: "EUR"
  },
  { name: "ETH",
    kraken_pair: "XETHZEUR",
    kraken_currency: "EUR",
    korbit_pair: "eth_krw",
    korbit_currency: "KRW",
    coinbase_pair: "ETH-EUR",
    coinbase_currency: "EUR"
  }
]

var exchanges = [ 'korbit', 'kraken', 'coinbase' ]


oxr.latest(() => { // called after exchange rates are updated
	fx.rates = oxr.rates;
	fx.base = oxr.base;

  var price_promises = []
  var prices = {}
  for (var exchange of exchanges) { prices[exchange] = {} }

  // fetch prices from all the exchanges

  var kraken_pair_names = []
  for (var pair of currency_pairs) {
    price_promises.push(
      get_korbit_price(pair['korbit_pair']).then( ((name, r) => {
        prices['korbit'][name] = fx.convert(parseFloat(r['last']),
          {from: pair['korbit_currency'], to: pair['kraken_currency']})
      }).bind(null, pair['name'])))
    price_promises.push(
      get_coinbase_price(pair['coinbase_pair']).then( ((name, r) => {
        prices['coinbase'][name] = fx.convert(parseFloat(r['data']['amount']),
          {from: pair['coinbase_currency'], to: pair['kraken_currency']})
      }).bind(null, pair['name'])))
    kraken_pair_names.push(pair['kraken_pair'])
  }

  price_promises.push(
    get_kraken_prices(kraken_pair_names.join(',')).then ( (r) => {
      for (var pair of currency_pairs) {
        prices['kraken'][pair['name']] = parseFloat(r['result'][pair['kraken_pair']]['a'][0])
      }
    })
  )

  // act on the exchange rates
  Promise.all(price_promises).then( () => {
    for (var e1 = 0; e1 < exchanges.length-1; e1++) {
      for (var e2 = e1+1; e2 < exchanges.length; e2++) {
        console.log(exchanges[e1] + " vs " + exchanges[e2] + ":")
        for (var pair of currency_pairs) {
          var ex1name = exchanges[e1]
          var ex2name = exchanges[e2]
          var p1 = prices[ex1name][pair['name']]
          var p2 = prices[ex2name][pair['name']]
          if (p1 > p2) { // make sure that p1 < p2, normalize
            var tname = ex1name
            var t = p1
            p1 = p2
            ex1name = ex2name
            p2 = t
            ex2name = tname
          }
          console.log('  ' + pair['name'] + ' Buy on ' + ex1name + ' for ' +
            +p1.toFixed(2) + ' sell on ' + ex2name + ' for ' + p2.toFixed(2) + ' and get ' +
            +( ((p2/p1)-1) * 100 ).toFixed(2) + '% profit')
        }
      }
    }
  })

}); // end of oxr.rates callback