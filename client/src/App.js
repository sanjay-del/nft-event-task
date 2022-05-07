import { useEffect, useState } from 'react';
import './App.css';
import ScrolllComponent from "./ScrollComponent";
import TokenComponent from "./TokenComponent";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import {styled} from '@material-ui/core/styles';
function App() {

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
  return (
    <div className="overlay">
    <div className="App">
       <h1 className="nft-name" style={{textAlign: 'centre',color:'#66ff66'}}>Degen Ninja Turtles (DNT token)</h1>
       <h3> Mint your turtle nft <a href='https://degenninjaturtles.com/' target="_blank"> here.</a></h3>
      <h3 style={{textAlign:'Left',color:'#66ff66', paddingLeft:'50px'}}>Contract Transfer Event</h3>
    <Grid container spacing = {2}>
      <Grid item xs={8}><Item><ScrolllComponent /></Item></Grid>
      <Grid item xs={4}><Item><TokenComponent /></Item></Grid>
      </Grid>
    
    </div>
    <div className="moving-background"></div>
    </div>
  );
}

export default App;
