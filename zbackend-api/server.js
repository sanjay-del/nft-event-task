const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const mongoose = require('mongoose');
const redis = require('ioredis');
const C_ADDRESS = require('./config');
const axios = require('axios').default;
const Transfer = require('./models/transfer');
const dotenv = require("dotenv");
dotenv.config();
app.use(cors());
app.use(express.json());

if (typeof web3 !== 'undefined') {
	var web3 = new Web3(web3.currentProvider);
} else {
	var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
}

//---db connect 
//--------

const dbURI = `mongodb+srv://jason:${process.env.passwd}@block-event.vs7ol.mongodb.net/nft-event-data?retryWrites=true&w=majority`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> (console.log('connected to db'), datapull())) //app.listen()
    .catch((err)=> console.log(err));


/**
 * Pulls event data from blockchain
 */
async function datapull(){

const Params = {
    module: "logs",
    action: "getlogs",
    fromBlock:14714345,
    toBlock:'latest',
    address:'0x491Cf9F48206D38568828C63623f4CC6607CC53d',
    topic0:'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    apikey:process.env.etherkey,
};
try{
const logs = await axios.get('https://api.etherscan.io/api',{params:Params,});


const data = logs.data.result;


/*to pull data for redis 

*/
const txhash = data;
const response1  = await Promise.all(
    txhash.map(async(res)=>{
        return {
            time: Number(res.timeStamp),
            hash: res.transactionHash,
            current_value:await getval(res.transactionHash),
            ts_matic_price: await fetchprice(Number(res.timeStamp),'matic'),
            ts_usd_price: await fetchprice(Number(res.timeStamp),'usd'),
           tokenId: Number(res.topics[3]),
        };
    })
)
// console.log(response1);
 rediscaching(response1);


/**
 * pull event and send to mongo db
 */
const responses = await Promise.all(
    data.map((res)=>{
        return {
            from: res.topics[1],
            to: res.topics[2],
            tokenId: Number(res.topics[3]),
        };
    })
);
responses.forEach(dbsend)

function dbsend(item, index, arr){
    const event = new Transfer(arr[index]);
    event.save()
        .then((result)=>console.log(`Submitted ${index} data to db`))
        .catch((err)=>{console.log(err)});
}
 }
catch(error){ console.log(error);}}



/**
 * 
 * @param {transaction hash } hash 
 * @returns 
 */
async function getval(hash){
   const logs = await web3.eth.getTransaction(hash);
   const eth_price = web3.utils.fromWei(logs.value);
   return eth_price;
}



/**
 * 
 * @param {unix time} timestamp 
 * @param {*conversion currency} tosymbol 
 * @returns 
 */
async function fetchprice(timestamp, tosymbol){

    const Param ={
        fsym: 'eth', 
        tsyms: tosymbol,
        ts:timestamp,
        api_key: process.env.cryptoapi
    };
    const returnval = await axios.get('https://min-api.cryptocompare.com/data/pricehistorical',{params:Param,});
    if(tosymbol ==='matic')
        return returnval.data.ETH.MATIC;
    else if (tosymbol ==='usd')
        return returnval.data.ETH.USD;
    else
        console.log('errr' + returnval.data);
    
}

//fetchprice(1651737007, 'usd');
/**
 * 
 * @param {array of json objects } data 
 */
 async function rediscaching(data){
    //  data =[{
    //     time: 1651727020,
    //     hash: '0xa2c4672fc52ae51a3d959d548d6581a0b34c2ce2a9828aa78ec65a77f5ad4cc5',
    //     current_value: '0.096',
    //     ts_matic_price: 2609.17,
    //     ts_usd_price: 2732.65,
    //     tokenId: 46
    //   },
    //   {
    //     time: 1651727020,
    //     hash: '0xa2c4672fc52ae51a3d959d548d6581a0b34c2ce2a9828aa78ec65a77f5ad4cc5',
    //     current_value: '0.096',
    //     ts_matic_price: 2607.07,
    //     ts_usd_price: 2759.37,
    //     tokenId: 47
    //   },
    //   {
    //     time: 1651727020,
    //     hash: '0xa2c4672fc52ae51a3d959d548d6581a0b34c2ce2a9828aa78ec65a77f5ad4cc5',
    //     current_value: '0.096',
    //     ts_matic_price: 2606.72,
    //     ts_usd_price: 2732.65,
    //     tokenId: 48
    //   },
    //   {
    //     time: 1651737007,
    //     hash: '0xf51071399e8d5991f608b9d33b77ee88f631f03a6ebe29df3de785bbb0268fb7',
    //     current_value: '0.024',
    //     ts_matic_price: 2606.72,
    //     ts_usd_price: 2755.49,
    //     tokenId: 49
    //   }];
    const redisClient = redis.createClient({
        host:'127.0.0.1',
        port: 6379,

    });
    redisClient.on('connect', function(){
        console.log('Connected to redis instance');
     });
     redisClient.on('error',(error) => {
        console.log('Redis connection error :', error);
    })
    const responses =  await Promise.all(
    data.map((res)=>{
        return{
            tokenId: res.tokenId,
            Historic_MATIC: res.ts_matic_price,
            Historic_USD: res.ts_usd_price,
        }
    })
    );
    console.log(responses);
    responses.forEach((item, index, arr)=>
     redisClient.set(arr[index].tokenId,    JSON.stringify(arr[index]))
        .then((result)=> console.log(`values are set for ${arr[index].tokenId}`))
        .catch((err)=>console.log(err))
    );

}

// rediscaching();