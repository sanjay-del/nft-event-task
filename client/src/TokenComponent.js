import { Button, TextField,IconButton } from '@material-ui/core';
import { Card,CardHeader, CardContent} from '@material-ui/core';

import { useEffect,  useState} from 'react';
 const TokenComponent=()=>{
    const [searchquery, setSearchQuery] = useState();
    const [pricehistory,setPriceHistory] = useState({});
    const fetchhistory = async (e)=>{
        e.preventDefault();
        setPriceHistory({});
        const response = await fetch(`http://localhost:5000/token/${searchquery}`);
        const pricehistory=await response.json();
        setPriceHistory(pricehistory);
      }
    return(
        
        <Card variant="outlined">
        <CardHeader title='Search history'/>
        <form>
            <TextField
                id="search-bar"
                className="text"
                onInput={(e) => {
                    setSearchQuery(e.target.value);
                }}
                label="Enter tokenId"
                variant="outlined"
                placeholder="Search..."
                size="small"
            />
            <Button type="submit" aria-label="search" style={{color:'green'}} onClick={e=>fetchhistory(e)}>Search</Button>
            
        </form>
        <br/>
        {pricehistory.tokenId ? 
        <ul>
        <li>TokenId : {pricehistory.tokenId}</li>
        <li>Matic Price At Mint : {pricehistory.Historic_MATIC}</li>
        <li>USD Price At Mint : {pricehistory.Historic_USD}</li>
        <li>Ethereum Mint Amount:{pricehistory.curret_price}</li>
  
        </ul>:(<div>TokenId not found</div>)}
        </Card>
    );
 }

export default TokenComponent;