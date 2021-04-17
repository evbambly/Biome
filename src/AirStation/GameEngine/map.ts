import { Hexagon, Route } from "./hexagon";
import { GroundType } from "../constants/terrain";
import { HexCoords } from "./hexagon";
import { FindConflictingPropertyGroups, ModifyGrid } from "../utils/UIMapUtils";
import { SavedMap } from "../StaticGameSetup/SavedMaps";

export enum PropertyChange {
  groundType ="groundType",
  route = "route",
  height = "height"
}

export type HexPropertyGroup = {
    groundType?: GroundType,
    route?: Route,
    height?: number,
    hexes: HexCoords[],
    propertyChange: PropertyChange
}

export const InitializeRectangularMap = (qLength: number, rLength: number): Hexagon[] => {
  let hexGrid: Hexagon[] = [];
  let s = 0;
  for (let r = 0; r < rLength; r++) {
    for (let q = 0 - Math.floor(r / 2); q < qLength - Math.floor(r / 2); q++) {
      hexGrid.push({
        position: { ...{ q, r, s } },
        groundType: GroundType.PLAIN,
      });
      s--;
    }
    s += qLength - 1;
    if (r % 2 === 1) s++;
  }

  return hexGrid;
};

export interface MapFactoryProps {
    qLength?: number, 
    rLength?: number, 
    mapLayout: SavedMap
}

export const MapFactory = ({qLength = 50, rLength = 30, mapLayout} : MapFactoryProps): Hexagon[] => {
  const plainGrid = InitializeRectangularMap(qLength, rLength);

  let customGrid = plainGrid;

  FindConflictingPropertyGroups(mapLayout.properties, mapLayout.name);
  
  mapLayout.properties?.forEach((group) => {
    customGrid = ModifyGrid(customGrid, group);
  });

  return customGrid;
};
