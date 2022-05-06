import { useEffect, useState } from 'react';
// import  Transfer from './components/Transfer';
// import  Pricehis from './components/Pricehis';
import './App.css';


function App() {
  const  [tokenPrices, setTokenprice] = useState([]);
  const [mongoEventdatas, setMongodata]= useState([]);

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
       <h1 className="nft-name">Degen Ninja Turtles (DNT token)</h1>
       <h3> Mint your turtle nft <a href='https://degenninjaturtles.com/' target="_blank"> here.</a></h3>
       <div className="eventCol" style={{display: 'flex', justifyContent:'flex-end'}}>
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
          <button >Show Transfer Event</button>
       </div>
      
      <div className="priceCol">

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
