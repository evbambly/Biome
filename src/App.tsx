import './App.css';
// import {AirStation1, Biome1} from './MapOptions'
import AirStationGame from "./AirStation/AirStationGame"
// import BiomeMap from "./Biome/BiomeMap"
import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        {/* <Map qLength={25} rLength={15} mapComponent={BiomeMap} mapLayout={AirStation1} /> */}
     {/* <BiomeMap qLength={25} rLength={15} mapLayout={Biome1} /> */}
     <AirStationGame />
      </header>
    </div>
  );
}

export default App;
