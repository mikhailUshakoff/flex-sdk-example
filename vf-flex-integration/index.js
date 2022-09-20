const {Flex, Token, Market, Trader} = require('flex-sdk-js');
const {TonClient} = require('@eversdk/core');
const {libNode} = require("@eversdk/lib-node");
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers')

TonClient.useBinaryLibrary(libNode);

argv = yargs(hideBin(process.argv))
  .command('makeOrder url clientAddress traderId signer marketAddress sell price amount', 'make an order', (yargs) => {
    return yargs
      .positional('url', { type: 'string' })
      .positional('clientAddress', { type: 'string' })
      .positional('traderId', { type: 'string' })
      .positional('signer', { type: 'string' })
      .positional('marketAddress', { type: 'string' })
      .positional('sell', { type: 'boolean' })
      .positional('price', { type: 'number' })
      .positional('amount', { type: 'number' })
  }, (argv) => {
    console.log(argv);
    /*
    // Quick debug output:
    console.log("ORDER");
    console.log(JSON.stringify(
        {
          orderId: '0xffffdff85c4c46a8',
          transactionId: 'b1de7b81dc5738d00a4b80cc7169e8a7928f5dada9d4593b2217a496db1707e2'
        }
    ));
    */
    const FLEX_CONFIG = {
        evr: {
            sdk: {
                network: {
                    endpoints: [argv.url]
                },
            },
        },
        // TODO:
        superRoot: "0:9120575adeae852d36b1ded9971281fa9907ac348fece95dea8a4e4328f77351",
    };
    (async () => {
        try {
            const flex = new Flex(FLEX_CONFIG);
            order = await Trader.makeOrder(
                flex,
                {
                    clientAddress: argv.clientAddress,
                    trader: {
                        id: argv.traderId,
                        signer: argv.signer,
                    },
                    sell: argv.sell,
                    marketAddress: argv.marketAddress,
                    price: argv.price,
                    amount: argv.amount,
                },
            );
            console.log("ORDER");
            console.log(JSON.stringify(order));
            await flex.close();
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })();

  })

  .command('cancelOrder url clientAddress traderId signer marketAddress price orderId', 'cancel the order', (yargs) => {
    return yargs
      .positional('url', { type: 'string' })
      .positional('clientAddress', { type: 'string' })
      .positional('traderId', { type: 'string' })
      .positional('signer', { type: 'string' })
      .positional('marketAddress', { type: 'string' })
      .positional('price', { type: 'number' })
      .positional('orderId', { type: 'string' })
  }, (argv) => {
    console.log(argv);
    const FLEX_CONFIG = {
        evr: {
            sdk: {
                network: {
                    endpoints: [argv.url]
                },
            },
        },
        // TODO:
        superRoot: "0:9120575adeae852d36b1ded9971281fa9907ac348fece95dea8a4e4328f77351",
    };
    (async () => {
        try {
            const flex = new Flex(FLEX_CONFIG);
            const cancelOptions = 
                {
                    clientAddress: argv.clientAddress,
                    trader: {
                        id: argv.traderId,
                        signer: argv.signer,
                    },
                    marketAddress: argv.marketAddress,
                    price: argv.price,
                    orderId: argv.orderId,
                };
            console.log("CANCEL OPTIONS:");
            console.log(cancelOptions);
            order = await Trader.cancelOrder(flex, cancelOptions);
            console.log("ORDER");
            console.log(JSON.stringify(order));
            await flex.close();
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    })();
  })
  .option('verbose', {
    alias: 'v',
    type: 'boolean',
    description: 'Run with verbose logging'
  })
  .parse();

