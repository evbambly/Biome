import { RouteType } from "../constants/airStation";
import { GroundType } from "../constants/terrain";
import { HexPropertyGroup, PropertyChange } from "../GameEngine/map";

export type SavedMap = {
  name: string;
  description: string;
  properties: HexPropertyGroup[];
};

export const AirStation1: SavedMap = {
  name: "Forked River",
  description: "",
  properties: [
    {
      propertyChange: PropertyChange.groundType,
      groundType: GroundType.RIVER,
      hexes: [
        { q: 5, r: 0, s: -5 },
        { q: 4, r: 1, s: -5 },
        { q: 3, r: 2, s: -5 },
        { q: -1, r: 3, s: -2 },
        { q: 3, r: 3, s: -6 },
        { q: -1, r: 4, s: -3 },
        { q: 0, r: 4, s: -4 },
        { q: 1, r: 4, s: -5 },
        { q: 3, r: 4, s: -7 },
        { q: 1, r: 5, s: -6 },
        { q: 3, r: 5, s: -8 },
        { q: 1, r: 6, s: -7 },
        { q: 2, r: 6, s: -8 },
        { q: 1, r: 7, s: -8 },
        { q: 0, r: 8, s: -8 },
        { q: -1, r: 9, s: -8 },
        { q: 6, r: 7, s: -13 },
        { q: 6, r: 8, s: -14 },
        { q: 3, r: 9, s: -12 },
        { q: 4, r: 9, s: -13 },
        { q: 5, r: 9, s: -14 },
        { q: -1, r: 10, s: -9 },
        { q: 2, r: 10, s: -12 },
        { q: -1, r: 11, s: -10 },
        { q: 1, r: 11, s: -12 },
        { q: -1, r: 12, s: -11 },
        { q: 0, r: 12, s: -12 },
        { q: 0, r: 13, s: -13 },
        { q: 0, r: 14, s: -14 },
      ],
    },
    {
      propertyChange: PropertyChange.groundType,
      groundType: GroundType.FOREST,
      hexes: [
        { q: 5, r: 1, s: -6 },
        { q: 4, r: 2, s: -6 },
        { q: 5, r: 2, s: -7 },
        { q: 4, r: 3, s: -7 },
      ],
    },
    {
      propertyChange: PropertyChange.groundType,
      groundType: GroundType.CITY,
      hexes: [
        { q: 0, r: 11, s: -11 },
        { q: 0, r: 7, s: -7 },
      ],
    },
    {
      propertyChange: PropertyChange.groundType,
      groundType: GroundType.RESOURCE,
      hexes: [
        { q: 9, r: 3, s: -12 },
        { q: -2, r: 4, s: -2 },
        { q: 1, r: 14, s: -15 },
      ],
    },
    {
      propertyChange: PropertyChange.route,
      route: { id: "1", type: RouteType.MAIN_ROUTE },
      hexes: [
        { q: 9, r: 3, s: -12 },
        { q: 8, r: 4, s: -12 },
        { q: 7, r: 5, s: -12 },
        { q: 7, r: 6, s: -13 },
        { q: 7, r: 7, s: -14 },
        { q: 7, r: 8, s: -15 },
        { q: 6, r: 9, s: -15 },
        { q: 5, r: 10, s: -15 },
        { q: 4, r: 11, s: -15 },
        { q: 3, r: 12, s: -15 },
        { q: 2, r: 13, s: -15 },
        { q: 1, r: 14, s: -15 },
      ],
    },
    {
      propertyChange: PropertyChange.route,
      route: { id: "1", type: RouteType.SIDE_ROUTE },
      hexes: [
        { q: 8, r: 3, s: -11 },
        { q: 7, r: 4, s: -11 },
        { q: 9, r: 4, s: -13 },
        { q: 6, r: 5, s: -11 },
        { q: 8, r: 5, s: -13 },
        { q: 6, r: 6, s: -12 },
        { q: 8, r: 6, s: -14 },
        { q: 8, r: 7, s: -15 },
        { q: 8, r: 8, s: -16 },
        { q: 7, r: 9, s: -16 },
        { q: 4, r: 10, s: -14 },
        { q: 6, r: 10, s: -16 },
        { q: 3, r: 11, s: -14 },
        { q: 5, r: 11, s: -16 },
        { q: 2, r: 12, s: -14 },
        { q: 4, r: 12, s: -16 },
        { q: 1, r: 13, s: -14 },
        { q: 3, r: 13, s: -16 },
        { q: 2, r: 14, s: -16 },
      ],
    },
  ],
};
