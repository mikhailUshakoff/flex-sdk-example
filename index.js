const {Flex, Token, Market} = require('flex-sdk-js');
const {TonClient} = require('@eversdk/core');
const {libNode} = require("@eversdk/lib-node");

TonClient.useBinaryLibrary(libNode);

const FLEX_CONFIG = {
    evr: {
        sdk: {
            network: {
                endpoints: ["https://flex4.dev.tonlabs.io/graphql"]
            },
        },
    },
    superRoot: "0:9120575adeae852d36b1ded9971281fa9907ac348fece95dea8a4e4328f77351",
};

(async () => {
    try {
        const flex = new Flex(FLEX_CONFIG);
        console.log("Tokens", await Token.queryTokens(flex));
        console.log("Markets", await Market.queryMarkets(flex));
        const tbtcEver = "0:f1d8bbd96595df2f4e41d2d0c37044ae740782650c86db9c32d863080f802a4a";
        console.log("Market Order Book", await Market.queryOrderBook(flex, tbtcEver));
        console.log("Market Price", await Market.queryPrice(flex, tbtcEver));

        await flex.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
