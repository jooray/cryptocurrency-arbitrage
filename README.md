# Cryptocurrency arbitrage finder

This simple script will use APIs of popular cryptocurrency exchanges in order to find arbitrage opportunities.

## Installation

First register for [openexchangerates.org](https://openexchangerates.org/signup/free) and write your API key in index.js (app_id).

Then run

```
npm install
node index.js
```

## Example results

```
korbit vs kraken:
  BCH Buy on kraken for 561.6 sell on korbit for 582.17 and get 3.66% profit
  BTC Buy on kraken for 5983.8 sell on korbit for 6167.79 and get 3.07% profit
  ETH Buy on kraken for 323.32 sell on korbit for 334.54 and get 3.47% profit
korbit vs coinbase:
  BCH Buy on coinbase for 553.36 sell on korbit for 582.17 and get 5.21% profit
  BTC Buy on coinbase for 5896.94 sell on korbit for 6167.79 and get 4.59% profit
  ETH Buy on coinbase for 319.6 sell on korbit for 334.54 and get 4.67% profit
kraken vs coinbase:
  BCH Buy on coinbase for 553.36 sell on kraken for 561.60 and get 1.49% profit
  BTC Buy on coinbase for 5896.94 sell on kraken for 5983.80 and get 1.47% profit
  ETH Buy on coinbase for 319.6 sell on kraken for 323.32 and get 1.16% profit
```

**Important**: By default, this script writes out prices in EUR, not USD. It is trivial to change it in the source code.

## Other exchanges

If you want to add another exchange, feel free to do so and I would love a *pull request*.

## License

Don't worry about licenses, this is a simple piece of code. I give you all the rights you can dream of by using [Unlicense](https://unlicense.org/). Enjoy your life and don't care about licenses for a while.

## Author

I'm [Juraj](juraj.bednar.io/about-me.html), nice to meet you.