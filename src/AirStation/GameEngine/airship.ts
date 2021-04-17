import {MagicPowder} from "./index"
import {HexCoords} from "./hexagon"

export type Airship = {
    magicStore: MagicPowder[];
    magicCapacity: number;
    supplies: any;
    suppliesCapacity: number;
    // in KGs
    wood: number;
    woodCapacity: number;
    location: HexCoords;
    docks: any[];
    tradingZone: any[];
  }

export const AirshipFactory = (airshipSettings?: Partial<Airship>): Airship => {
    return {
        magicStore: [],
        magicCapacity: 500,
        supplies: 30,
        suppliesCapacity: 100,
        wood: 20,
        woodCapacity: 50,
        location: {
          q: 5, r: 4, s: -9
        },
        docks: [],
        tradingZone: [],
        ...airshipSettings,
    }
  }