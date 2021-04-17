import {ROUTE_TYPES} from "../constants/airStation"
const AirStation = {
  staticRoutePaths: [
    {
      type: { routeId: 1, routeType: ROUTE_TYPES.MAIN_ROUTE },
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
      type: { routeId: 1, routeType: ROUTE_TYPES.SIDE_ROUTE },
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

export default AirStation