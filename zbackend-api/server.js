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
//const redisscan = require('redisscan');
dotenv.config();
app.use(cors());
app.use(express.json());

//web3 provider
if (typeof web3 !== 'undefined') {
	var web3 = new Web3(web3.currentProvider);
} else {
	var web3 = new Web3(new Web3.providers.HttpProvider('https://mainnet.infura.io/v3/9aa3d95b3bc440fa88ea12eaa4456161'));
}

//---db connect 
//--------
const dbURI = `mongodb+srv://jason:${process.env.passwd}@block-event.vs7ol.mongodb.net/nft-event-data?retryWrites=true&w=majority`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> (console.log('connected to db'), datapull(),app.listen(5000), console.log('Listening on port 5000'))) 
    .catch((err)=> console.log(err));

//redis db connection
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



/**
 * Pulls event data from blockchain
 */
async function datapull(){

const Params = {
    module: "logs",
    action: "getlogs",
    fromBlock:14713904 ,
    toBlock:'latest',
    address:'0x491Cf9F48206D38568828C63623f4CC6607CC53d',
    topic0:'0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
    apikey:process.env.etherkey,
};
try{
const logs = await axios.get('https://api.etherscan.io/api',{params:Params,});


const data = logs.data.result;
datamanip(data);
}
catch(err){
    console.log(err);
}}

/**
 * 
 * @param {blockchain fetched data} data 
 */
async function datamanip(data){
//redis store
try{
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
        .then((result)=>console.log(`Submitted ${arr[index].tokenId} data to db`))
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

    const responses =  await Promise.all(
    data.map((res)=>{
        return{
            tokenId: res.tokenId,
            Historic_MATIC: res.ts_matic_price*Number(res.current_value),
            Historic_USD: (res.ts_usd_price*Number(res.current_value)).toPrecision(6),
            curret_price: Number(res.current_value),
        

        }
    })
    );
    // console.log(responses);
    responses.forEach((item, index, arr)=>
     redisClient.set(arr[index].tokenId,    JSON.stringify(arr[index]))
        .then((result)=> console.log(`values are set for ${arr[index].tokenId}`))
        .catch((err)=>console.log(err))
    );

}


/**
 * 
 * routes
 */
app.get('/events',(req,res)=>{
    Transfer.find()
        .then((result)=>{
            res.send(result);
        })
        .catch((err)=>{
            console.log(err);
        })
});



app.get('/token/:key', function (req, res) {
     redisClient.get(req.params.key)
     .then((result)=>{
    // console.log(JSON.parse(result));
    res.send(JSON.parse(result));
    })
    .catch((err)=>{
        console.log(err);
    })

});



