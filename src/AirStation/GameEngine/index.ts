import { Airship, AirshipFactory } from "./airship";
import { Hexagon, Surface } from "./hexagon";
import { MapFactory, MapFactoryProps } from "./map";

export type MagicPowder = {
  // 0-30 days
  expiry: number;
  // In grams
  quantity: number;
  // 1-100 purity rating (?)
  quality?: number;
};

type AirshipGameSettings = {
  initialShipSettings: Partial<Airship>;
};

export const settingsFactory = () => {};

export class AirshipGame {
  map: Hexagon[];
  surfaceMap: Surface[];
  airship: Airship;

  private constructor(map: Hexagon[], surfaceMap: Surface[], airship: Airship) {
    this.map = map;
    this.surfaceMap = surfaceMap;
    this.airship = airship;
  }

  static initialize(
    mapProps: MapFactoryProps,
    settings: Partial<AirshipGameSettings>
  ): AirshipGame {
    const map = MapFactory(mapProps)
    const airship = AirshipFactory(settings.initialShipSettings)

    return new AirshipGame(
      map,
      [],
      airship,
    );
  }

  executeTurn(actions: any[]): void {
    if (Array.isArray(actions)) {
      actions.forEach((action) => {});
    }
  }
  saveState() {};
}

