import { useEffect, useState } from 'react';
// import  Transfer from './components/Transfer';
// import  Pricehis from './components/Pricehis';
import './App.css';


function App() {
  const  [tokenPrices, setTokenprice] = useState([]);
  const [mongoEventdatas, setMongodata]= useState([]);
  window.onscroll = function(){scrollfucntion()};
  function scrollfucntion(){
    var winScroll = document.body.scrollTop ||
    document.documentElement.scrollTop;
    var height = document.documentElement.scrollHeight -
    document.documentElement.clientHeight;
  }
  useEffect(()=>{
          async function getter(){
            //const response1 = await fetch('http://localhost:5000/token');
            const response2 = await fetch('http://localhost:5000/events');

            //const tokenPrices = await response1.json();
            const mongoEventdatas = await response2.json();

            setTokenprice(tokenPrices);
            setMongodata(mongoEventdatas);
          }
          getter();
  },[]);

  return (
    <div className="overlay">
    <div className="App">
       <h1 className="nft-name" style={{textAlign: 'centre',color:'#66ff66'}}>Degen Ninja Turtles (DNT token)</h1>
       <h3> Mint your turtle nft <a href='https://degenninjaturtles.com/' target="_blank"> here.</a></h3>
       <div className="eventCol" id="col" >
          <ul>
            {
              mongoEventdatas.map(mongoEventdata =>(
                <li key={mongoEventdata.tokenId}>
                  <p>From:{mongoEventdata.from}</p>
                  <p>To:{mongoEventdata.to}</p>
                  <p>tokenId:{mongoEventdata.tokenId}</p>

                </li>
              ))
            }
          </ul>
       </div>
      
      <div className="priceCol">
          {/* <input type={search token price}>
          <button onclick></button> */}
        <ul>
          {
            tokenPrices.map(tokenPrice =>(
              <li key={tokenPrice.tokenId}>

              </li>              
            ))
          }
        </ul>
      </div>
    </div>
    <div className="moving-background"></div>
    </div>
  );
}

export default App;
