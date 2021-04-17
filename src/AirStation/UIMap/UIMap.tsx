import React, { useEffect } from "react";
import configs from "../../configurations.json";
import {  HexCoords } from "../GameEngine/hexagon"
import { AirshipGame } from "../GameEngine";
import UIHexagon from "./UIHexagon"
import { GetHexIndex } from "../utils/UIMapUtils";

const ReactHexGrid = require("react-hexgrid");

export type MapProps = {
  game: AirshipGame,
  markedHex: number,
  setMarkedHex: (nextMarkedHex: number) => void
}

const Map = ({ game, markedHex, setMarkedHex }: MapProps) => {

  const { HexGrid, Layout, Path, Pattern } = ReactHexGrid

  const config = configs["rectangle"];
  const layout = config.layout;
  const size = { x: layout.width, y: layout.height };

  useEffect(() => {
    const hexElements = document.getElementsByClassName("editable");

    interface ExtendedElement extends Element {
      onclick: () => void
    }

    if (hexElements instanceof HTMLCollection) {
      for (let i = 0; i < hexElements.length; i++) {
        const element = hexElements.item(i) as ExtendedElement;
        if (element) {
          element.onclick = () => {
            markHex(i);
          };
        }
      }
    }
  });

  type PathProps = {
    from: HexCoords,
    to: HexCoords
  }

  const paths: PathProps[] = [];

  const markHex = (chosenHexIndex: number) => {
    if (chosenHexIndex !== -1) {
      setMarkedHex(markedHex === chosenHexIndex ? -1 : chosenHexIndex);
    }
  };

  const airshipIndex = game.map && GetHexIndex(game.map.map(({position})=> position), game.airship.location)

  return (
    <HexGrid width={config.width} height={config.height}>
      <Layout
        size={size}
        flat={layout.flat}
        spacing={layout.spacing}
        origin={config.origin}
      >
        {
          // note: key must be unique between re-renders.
          // using config.mapProps+i makes a new key when the goal template chnages.
          game.map?.map((hex, i) => {
            return (
              <UIHexagon
                {...hex}
                key={config.mapProps.toString() + i}
                hasShip={i === airshipIndex}
                isMarked={i === markedHex}
              />
            );
          })
        }
        {paths?.map((path) => (
          <Path start={path?.from} end={path?.to} />
        ))}
        <Pattern id="airship" size={{x: size.x*.9, y: size.y*1.05}} link="data:image/png;base64,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"  />
      </Layout>
    </HexGrid>
  );
};
export default Map;
