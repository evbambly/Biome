import React, { useEffect, useState } from "react";
import { HexGrid, Layout, Hexagon, Text, Path } from "react-hexgrid";
import MapUtils from "./utils/MapUtils";
import configs from "./configurations";
// import { GetHexIndex } from "./utils/HexUtils";

const Map = ({ logicalGrid, canMarkMultiple, setMarkedHexes, markedHexes }) => {
  const [hexagons, setHexagons] = useState([]);
  // const [previousHexagons, setPreviousHexagons] = useState(hexagons);

  const config = configs["rectangle"];
  const layout = config.layout;
  const size = { x: layout.width, y: layout.height };

  useEffect(() => {
    setHexagons(logicalGrid?.map((hex) => MapUtils.setClassnames(hex)));
  }, [logicalGrid]);

  useEffect(() => {
    const hexElements = document.getElementsByClassName("editable");

    if (hexElements instanceof HTMLCollection) {
      for (let i = 0; i < hexElements.length; i++) {
        const element = hexElements.item(i);
        element.onclick = (e) => {
          markHex(i);
        };
      }
    }
  });

  const paths = [];

  const markHex = (chosenHexIndex) => {
    let nextHexagons = JSON.parse(JSON.stringify(hexagons));
    let nextMarkedHexes = JSON.parse(JSON.stringify(markedHexes));

    markedHexes.forEach((markedHex) => {
      if (markedHex > -1) {
        nextHexagons[markedHex].isMarked = false;
      }
    });

    if (!canMarkMultiple) {
      nextMarkedHexes = markedHexes.includes(chosenHexIndex)
        ? []
        : [chosenHexIndex];
    } else {
      if (markedHexes.includes(chosenHexIndex)) {
        nextMarkedHexes = nextMarkedHexes.filter(
          (hexIndex) => hexIndex !== chosenHexIndex
        );
      } else {
        nextMarkedHexes.push(chosenHexIndex);
      }
    }

    nextMarkedHexes.forEach((markedHex) => {
      if (markedHex > -1) {
        nextHexagons[markedHex].isMarked = true;
      }
    });

    setMarkedHexes(nextMarkedHexes);
    setHexagons(nextHexagons.map((hex) => MapUtils.setClassnames(hex)));
  };

  const getHexText = (hex) => {
    return hex.height ?? "";
    //  return `${hex.q}${hex.r}${hex.s}`;
  };

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
          hexagons?.map((hex, i) => {
            return (
              <Hexagon
                className={hex.className}
                key={config.mapProps + i}
                q={hex.q}
                r={hex.r}
                s={hex.s}
                id={config.mapProps + i}
              >
                <Text id={config.mapProps + i * 10}>{getHexText(hex)}</Text>
              </Hexagon>
            );
          })
        }
        {paths?.map((path) => (
          <Path start={path?.from} end={path?.to} />
        ))}
      </Layout>
    </HexGrid>
  );
};
export default Map;
