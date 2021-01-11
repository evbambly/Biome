
import './App.css';
import BiomeMap from './BiomeMap'
import {Biome1} from './MapOptions'


function App() {
  return (
    <div className="App">
      <header className="App-header">
     <BiomeMap qLength={25} rLength={15} mapLayout={Biome1} />
      </header>
    </div>
  );
}

export default App;
