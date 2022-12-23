const {Flex, Token, Market, Trader} = require('flex-sdk-js');
const {TonClient} = require('@eversdk/core');
const {libNode} = require("@eversdk/lib-node");

TonClient.useBinaryLibrary(libNode);

const FLEX_CONFIG = {
    evr: {
        sdk: {
            network: {
                endpoints: ["https://test.flex.everos.dev/graphql"]
            },
        },
    },
    superRoot: "0:7a6d3ab04ab26333d6e0523410b60d9f4bc55913e4c0291010c8314e9e47d169",
};

(async () => {
    try {
        const flex = new Flex(FLEX_CONFIG);
        //console.log("Tokens", await Token.queryTokens(flex));
        //console.log("Markets", await Market.queryMarkets(flex));
        const everUsdc = "0:e8cd39e975cf4e62f329c564b51eebff74837e7f819fb26a9afec1af2c007041"
        //console.log("Market Order Book", await Market.queryOrderBook(flex, everUsdc));
        //console.log("Market Price", await Market.queryPrice(flex, tbtcEver));
        const f_clientAddress = "0:ea5af8268f5d3c3223e27c83be179154e68b9eab63bede9372587ece0c6ce81f";
        const f_traderId = "8dd4cee96ad641dafe7d0fac3f8aeed338eb7e5431482ddf9ea27cc8b14a90eb";
        const f_signeer = "x";

        const clientAddress = "0:c212bcae25391c3104b3accc7b24780e9f06e6959e209ead38b991a325374ade";
        const traderId = "f5cd56387a780d892c80cd57e2057fbac6fee825f4f659de327bf4a10c2ad41b";
        const signeer = "x";
        //fill queue
        let price = 1.49;
        console.log("len",(await Market.queryOrderBook(flex, everUsdc)).asks);
        for(let i =0; i<1; i++){
            console.log("iteration:",i)
            let res = await Trader.makeOrder(
                flex,
                {
                    clientAddress: f_clientAddress,
                    trader: {
                        id: f_traderId,
                        signer: f_signeer
                    },
                    marketAddress: everUsdc, // Trading pair address
                    sell: true,
                    price: price,
                    amount: 1,
                    orderId:1,
                    finishTime:1671702791
                },
            );
            if(res.status!=1) {
                console.log("res",JSON.stringify(res));
                exit(1);
            }
            //console.log("res",JSON.stringify(res));
            price+=0.01
        };
        //trade with every price
        price=1;
        for(let i =0; i<50; i++){
            console.log("iteration:",i)
            //console.log("len",(await Market.queryOrderBook(flex, everUsdc)).asks.length);
            if  ((await Market.queryOrderBook(flex, everUsdc)).asks.length != 50) {
                console.log("not 50");
                exit(1)
            }
            let res = await Trader.makeOrder(
                flex,
                {
                    clientAddress: clientAddress,
                    trader: {
                        id: traderId,
                        signer: signeer
                    },
                    marketAddress: everUsdc, // Trading pair address
                    sell: false,
                    price: price,
                    amount: 1,
                    orderId:1,
                    finishTime:1671702791
                },
            );
            console.log("status-1",res.status);
            if(res.status!=1) {
                console.log("res",JSON.stringify(res));
                exit(1);
            }
            if  ((await Market.queryOrderBook(flex, everUsdc)).asks.length != 49) {
                console.log("not 49");
                exit(1)
            }
            let res1 = await Trader.makeOrder(
                flex,
                {
                    clientAddress: f_clientAddress,
                    trader: {
                        id: f_traderId,
                        signer: f_signeer
                    },
                    marketAddress: everUsdc, // Trading pair address
                    sell: true,
                    price: price,
                    amount: 1,
                    orderId:1,
                    finishTime:1671702791
                },
            );
            if(res1.status!=1) {
                console.log("res",JSON.stringify(res));
                exit(1);
            }
            if  ((await Market.queryOrderBook(flex, everUsdc)).asks.length != 50) {
                console.log("not 50 1");
                exit(1)
            }
            price+=0.01
        };

        await flex.close();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
})();
