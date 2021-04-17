import { Hexagon, HexCoords } from "../GameEngine/hexagon";
import { HexPropertyGroup, PropertyChange } from "../GameEngine/map";

const hexCoordsToString = (hexCoords: HexCoords[]) => {
  let result = "[";

  hexCoords.forEach((hex) => {
    const { q, r, s } = hex;
    result += `{ q: ${q}, r: ${r}, s: ${s} },`;
  });

  result += "]";

  return result;
};

export const alertMarked = (markedHexagons: HexCoords[]) => {
  alert(hexCoordsToString(markedHexagons));
};

export const compareHexPositions = (a: Hexagon, b: Hexagon) => {
  const { q: aQ, r: aR, s: aS } = a.position;
  const { q: bQ, r: bR, s: bS } = a.position;

  return aQ === bQ && aR === bR && aS === bS;
};
export const GetHexCoordsFromRectangleGrid = (
  index: number,
  qLength: number
): HexCoords => {
  const r = Math.floor(index / qLength);
  const q = (index % qLength) - Math.floor(r / 2);
  const s = -(r + q);

  return { q, r, s };
};

export const ModifyGrid = (
  hexGrid: Hexagon[],
  modificationGroup: HexPropertyGroup
) => {
  const { hexes, propertyChange } = modificationGroup;

  const nextHexGrid = JSON.parse(JSON.stringify(hexGrid));

  if (!modificationGroup[propertyChange]) {
    throw new Error(`No property change detected. Expected ${propertyChange}`);
  }

  hexes.forEach((modifiedHex: HexCoords) => {
    const modifiedHexIndex = GetHexIndex(
      hexGrid.map(({ position }) => position),
      modifiedHex
    );

    if (modifiedHexIndex !== -1) {
      nextHexGrid[modifiedHexIndex][propertyChange] =
        modificationGroup[propertyChange];
    }
  });

  return nextHexGrid;
};

export const GetHexIndex = (hexGrid: HexCoords[], findHex: HexCoords) => {
  const hexIndex = hexGrid?.findIndex((hex) => {
    return hex.q === findHex.q && hex.r === findHex.r && hex.s === findHex.s;
  });
  return hexIndex;
};

export const FindConflictingPropertyGroups = (
  propertyGroups: HexPropertyGroup[],
  name?: string
) => {
  let duplicatedHexes: { hex: HexCoords; reason: PropertyChange }[] = [];

  let groupsByProperty: { [property: string]: HexPropertyGroup[] } = {};

  propertyGroups.forEach((group) => {
    if (groupsByProperty[group.propertyChange]) {
      groupsByProperty[group.propertyChange].push(group);
    } else {
      groupsByProperty[group.propertyChange] = [group];
    }
  });

  Object.keys(groupsByProperty).forEach((property) => {
    let nextConflictingHexes: { hex: HexCoords; reason: PropertyChange }[];
    if (property === PropertyChange.route) {
      nextConflictingHexes = getConflictingHexesByRoute(
        groupsByProperty[property]
      );
    } else {
      nextConflictingHexes = getConflictingHexesByProperty(
        groupsByProperty[property]
      );
    }
    duplicatedHexes = [...duplicatedHexes, ...nextConflictingHexes];
  });

  if (duplicatedHexes.length > 0) {
    throw new Error(
      `The following hexes are duplicated in this map: ${hexCoordsToString(
        duplicatedHexes.map(({hex})=> hex)
      )}. 
      The map name is ${name}.
      Conflicting properties: ${duplicatedHexes.map(({reason})=> reason).filter((value, index, self)=>{
        return self.indexOf(value) === index;
      }).join(", ")}`
    );
  }
};

const getConflictingHexesByProperty = (
  propertyGroups: HexPropertyGroup[]
) => {
  let conflictingHexes: { hex: HexCoords; reason: PropertyChange }[] = [];

  let nonConflictingHexes: HexCoords[] = [];

  propertyGroups.forEach((group) => {
    group.hexes.forEach((hex) => {
      if (doesGroupContainHex(nonConflictingHexes, hex)) {
        if (!doesGroupContainHex(conflictingHexes.map(({hex})=> hex), hex)) {
          conflictingHexes.push({hex, reason: group.propertyChange});
        }
      } else {
        nonConflictingHexes.push(hex);
      }
    });
  });

  return conflictingHexes;
};

const getConflictingHexesByRoute = (
  propertyGroups: HexPropertyGroup[]
) => {
  let conflictingHexes: { hex: HexCoords; reason: PropertyChange }[] = [];

  let nonConflictingHexes: { [name: string]: HexCoords } = {};

  propertyGroups.forEach((group) => {
    group.hexes.forEach((hex) => {
      const hexName = `q:${hex.q},r:${hex.r},s:${hex.s},routeId:${group.route?.id}`;
      if (Object.keys(nonConflictingHexes).includes(hexName)) {
        if (!doesGroupContainHex(conflictingHexes.map(({hex})=> hex), hex)) {
          conflictingHexes.push({hex, reason: PropertyChange.route});
        }
      } else {
        nonConflictingHexes[hexName] = hex;
      }
    });
  });

  return conflictingHexes;
};

const doesGroupContainHex = (group: HexCoords[], hex: HexCoords) => {
  let groupContainsHex = false;

  group.forEach((groupHex) => {
    if (groupHex.q === hex.q && groupHex.r === hex.r && groupHex.s === hex.s) {
      groupContainsHex = true;
    }
  });

  return groupContainsHex;
};
