import { useEffect, useState } from 'react';
import './App.css';
import ScrolllComponent from "./ScrollComponent";
import TokenComponent from "./TokenComponent";

function App() {
  const  [tokenPrices, setTokenprice] = useState([]);
  const [mongoEventdatas, setMongodata]= useState([]);
  
  // useEffect(()=>{
  //         async function getter(){
  //           //const response1 = await fetch('http://localhost:5000/token');
  //           const response2 = await fetch('http://localhost:5000/events');

  //           //const tokenPrices = await response1.json();
  //           const mongoEventdatas = await response2.json();

  //           setTokenprice(tokenPrices);
  //           setMongodata(mongoEventdatas);
  //         }
  //         getter();
  // },[]);

// const fetchData = () =>{};
  return (
    <div className="overlay">
    <div className="App">
       <h1 className="nft-name" style={{textAlign: 'centre',color:'#66ff66'}}>Degen Ninja Turtles (DNT token)</h1>
       <h3> Mint your turtle nft <a href='https://degenninjaturtles.com/' target="_blank"> here.</a></h3>
       {/* <InfiniteScroll
          dataLength={mongoEventdatas.length} 
          // next={fetchData}
          hasMore={true}
          loader={<h4>Loading...</h4>}
        >
                 <div className="container" id="col" >
                  <div className="row">
                    {mongoEventdatas.map((mongoEventdata) => {
                      return <div className="col-md-4" key={mongoEventdata.tokenId}>
                        <p><b>from :</b> {mongoEventdata.from}  <b> to :</b> {mongoEventdata.to}<b> TokenId:</b> {mongoEventdata.tokenId}</p>
                        {console.log(mongoEventdata)}
                        </div>;
                    })}
                  </div>
                  </div>

    </InfiniteScroll> */}
      
    <div className=''>
      <ScrolllComponent mongoEventdatas={mongoEventdatas} setMongodata={setMongodata}/>
      <TokenComponent />
    </div>
    </div>
    <div className="moving-background"></div>
    </div>
  );
}

export default App;
