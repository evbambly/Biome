
import './App.css';
import Map from './Map'
import {mapOption1} from './groundData'


function App() {
  return (
    <div className="App">
      <header className="App-header">
     <Map qLength={25} rLength={15} mapLayout={mapOption1} />
      </header>
    </div>
  );
}

export default App;
