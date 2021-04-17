import { GroundType } from "../constants/terrain";
import { RouteType } from "../constants/airStation";
import { Airship } from "./airship";

export type HexCoords = {
    q: number,
    r: number,
    s: number
  }
  
 export type Route = {
    type: RouteType,
    id: string
  }
  
  export interface Hexagon {
    position: HexCoords,
    groundType: GroundType,
    height?: number,
    route?: Route,
    surface?: Surface
  }
  
  export type Surface = {
    assets: any[],
    ships: Airship[]
  }