const express = require('express');
const app = express();
const cors = require('cors');
const Web3 = require('web3');
const mongoose = require('mongoose');
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
console.log(response1);



// const responses = await Promise.all(
//     data.map((res)=>{
//         return {
//             from: res.topics[1],
//             to: res.topics[2],
//             tokenId: Number(res.topics[3]),
//         };
//     })
// );
// responses.forEach(dbsend)

// function dbsend(item, index, arr){
//     const event = new Transfer(arr[index]);
//     event.save()
//         .then((result)=>console.log(`Submitted ${index} data to db`))
//         .catch((err)=>{console.log(err)});
// }


 }
catch(error){
    console.log(error);
}
}

//db connect 
const dbURI = `mongodb+srv://jason:${process.env.passwd}@block-event.vs7ol.mongodb.net/nft-event-data?retryWrites=true&w=majority`;
mongoose.connect(dbURI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then((result)=> (console.log('connected to db'), datapull())) //app.listen()
    .catch((err)=> console.log(err));

async function getval(hash){
   const logs = await web3.eth.getTransaction(hash);
   //console.log(logs)
   const eth_price = web3.utils.fromWei(logs.value);
   //console.log(eth_price)
   return eth_price;
}



async function fetchprice(timestamp, tosymbol){

    const Param ={
        fsym: 'eth', 
        tsyms: tosymbol,
        ts:timestamp,
       // api_key: process.env.cryptoapi
    };
    const returnval = await axios.get('https://min-api.cryptocompare.com/data/pricehistorical',{params:Param,});
    // if(tosymbol ==='matic')
    //     console.log( returnval.data.ETH.MATIC);
    // else if (tosymbol ==='usd')
    //     console.log(returnval.data.ETH.USD)
    // else
    //     console.log('errr' + returnval.data);
    return returnval.data;
}

//fetchprice(1651737007, 'usd');