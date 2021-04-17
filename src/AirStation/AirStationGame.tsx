import React, { useState } from "react";
import "../App.css";
import { AirshipGame } from "./GameEngine"
import Map from "./UIMap/UIMap";
import ControlPanel from "./ControlPanel"
import { MapFactoryProps } from "./GameEngine/map";
import "./airStation.css"
import { AirStation1 } from "./StaticGameSetup/SavedMaps";
import { alertMarked } from "./utils/UIMapUtils";

const Q_LENGTH = 25
const R_LENGTH = 15

const MAP_PROPS: MapFactoryProps = {
  qLength: Q_LENGTH,
  rLength: R_LENGTH,
  mapLayout: AirStation1
}

const AirStationGame = () => {
  const [markedHexIndex, setMarkedHexIndex] = useState(-1);
  const GameEngine = AirshipGame.initialize(MAP_PROPS, {})

  const markedHexContent = GameEngine.map[markedHexIndex]

  return (
    <div>
      <ControlPanel
        content={
          <div>
            {markedHexIndex > -1 ? <div>
              <p>Coordinates: q {markedHexContent.position.q}, r {markedHexContent.position.r}, s {markedHexContent.position.s}</p>
              <p>Terrain: {markedHexContent.groundType || "regular"}</p>
              <p></p>
            </div> : "No hex chosen"}
          </div>
        }
      />
      <button onClick={() => alertMarked(markedHexIndex === -1 ? [] : [GameEngine.map[markedHexIndex].position])}>
        Get Marked
      </button>
      <hr />
      <Map
        game={GameEngine}
        markedHex={markedHexIndex}
        setMarkedHex={setMarkedHexIndex}
      />
    </div>
  );
};

export default AirStationGame;
