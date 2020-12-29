import { HexUtils } from "react-hexgrid";

export const GROUND_TYPES = {
  RIVER: "river",
  MOUNTAIN: "mountain",
  FOREST: "forest",
  DESERT: "desert",
  CITY: "city",
};

export const getCoordinates = (index, qLength) => {
  const r = Math.floor(index / qLength);
  const q = (index % qLength) - Math.floor(r / 2);
  const s = -(r + q);

  return { q, r, s };
};

export const getHexData = (qLength, rLength) => {
  let hexGrid = [];
  let s = 0;
  for (let r = 0; r < rLength; r++) {
    for (let q = 0 - Math.floor(r / 2); q < qLength - Math.floor(r / 2); q++) {
      hexGrid.push({ q: q, r: r, s: s, isMarked: false });
      s--;
    }
    s += qLength - 1;
    if (r % 2 === 1) s++;
  }

  return hexGrid;
};

export const modifyGrid = (hexGrid, modifyHexes, modificationProperty) => {
  const nextHexGrid = JSON.parse(JSON.stringify(hexGrid));

  let modifiedHexes = JSON.parse(JSON.stringify(modifyHexes));

  if (
    typeof modificationProperty === "object" &&
    modificationProperty !== null &&
    Object.keys(modificationProperty).length === 1
  ) {
    modifiedHexes = modifiedHexes.map((hex) =>
      Object.assign(hex, modificationProperty)
    );
  }

  modifiedHexes.forEach((modifiedHex) => {
    const modifiedHexIndex = getHexIndex(hexGrid, modifiedHex);

    if (modifiedHexIndex !== -1) {
      nextHexGrid[modifiedHexIndex] = Object.assign(
        nextHexGrid[modifiedHexIndex],
        modifiedHex
      );
    }
  });

  return nextHexGrid;
};

export const getHexIndex = (hexGrid, findHex) => {
  const hexIndex = hexGrid.findIndex((hex) => {
    return hex.q === findHex.q && hex.r === findHex.r && hex.s === findHex.s;
  });
  return hexIndex;
};

const getFullHex = (hexGrid, hex) => {
  return hexGrid[getHexIndex(hexGrid, hex)]
}

export const getFlow = (grid) => {
  grid = cleanHexes(grid);
  const heightGroups = getHeightGroups(grid);
  const river = grid
    .filter((hex) => hex.groundType === GROUND_TYPES.RIVER)
    .map((hex) => getHexIndex(grid, hex));
  let nextGrid = JSON.parse(JSON.stringify(grid));
  flowRiver(nextGrid, river);
  heightGroups.sortedKeys.forEach((key) => {
    let heightGroup = JSON.parse(JSON.stringify(heightGroups.groups[key]));
    let index = 0;
    let iterations = 0;
    const MAX_ITERATIONS = 100;
    while (heightGroups.length > 0 && iterations < MAX_ITERATIONS) {
      if (flowHex(nextGrid, heightGroup[index])) heightGroup.splice(index, 1);

      index++;
      if (index === heightGroups.length) index = 0;
      iterations++;
    }
  });

  return nextGrid;
};

const getHeightGroups = (grid) => {
  let heightGroups = {};
  if (Array.isArray(grid)) {
    grid.forEach((hex) => {
      if (hex.height !== undefined) {
        if (Array.isArray(heightGroups[hex.height])) {
          heightGroups[hex.height].push(hex);
        } else {
          heightGroups[hex.height] = [hex];
        }
      }
    });
  }
  const sortedKeys = Object.keys(heightGroups).sort((a, b) => b - a);
  return {
    groups: heightGroups,
    sortedKeys,
  };
};

const flowRiver = (grid, riverIndexes) => {
  const MAX_ITERATIONS = 100 * riverIndexes.length;
  let index = 0;
  let iterations = 0;
  while (riverIndexes.length > 0 && iterations < MAX_ITERATIONS) {
    const riverHex = grid[riverIndexes[index]];
    if (riverHex.q === 1 && riverHex.r ===6 && riverHex.s === -7) {
      debugger
    }
    let weightedDestinations = getNeighbours(grid, riverHex).filter(
      (weighted) => weighted.neighbour.groundType === GROUND_TYPES.RIVER
    );
    let chosenDestination;
    let lowerRiver = weightedDestinations.find(
      (weighted) => weighted.neighbour.height < riverHex.height
    );
  
    if (lowerRiver) {
      chosenDestination = lowerRiver;
    } else {
      if (
        riverHex.waterOrigin &&
        riverHex.waterOrigin.find(
          (originHex) => getFullHex(grid, originHex).groundType === GROUND_TYPES.RIVER
        )
      ) {
        chosenDestination = weightedDestinations[0];
      }
    }
    if (chosenDestination) {
      flowGrid(
        grid,
        riverIndexes[index],
        chosenDestination.neighbourIndex
      );
      iterations--;
      riverIndexes.splice(index, 1);
      index--
    }
    index++;
    if (index === riverIndexes.length) {
      index = 0;
    }
    iterations++;
  }
};

const flowHex = (grid, hex) => {
  let weightedDestinations = getNeighbours(grid, hex);

  let likelihoodSum = 0;

  weightedDestinations.forEach((weighted) => {
    let likelihood =
      weighted.neighbour.groundType === GROUND_TYPES.RIVER ? 40 : 10;
    likelihood += 10 * (hex.height - weighted.neighbour.height);
    likelihoodSum += likelihood;
    weighted.likelihood = likelihood;
  });

  let randomPath = Math.floor(Math.random() * Math.floor(likelihoodSum));

  let chosenDestination;
  for (const weighted of weightedDestinations) {
    randomPath -= weighted.likelihood ?? 0;
    if (randomPath <= 0) {
      chosenDestination = weighted;
      break;
    }
  }

  if (chosenDestination) {
    flowGrid(grid, getHexIndex(grid, hex), chosenDestination.neighbourIndex);
  }

  return chosenDestination !== undefined;
};

const flowGrid = (grid, fromIndex, toIndex) => {
  const { q, r, s } = grid[toIndex];

  grid[fromIndex].flowedTo = { q, r, s };

  let waterOrigin = [];
  if (grid[fromIndex].waterOrigin) {
    waterOrigin = grid[fromIndex].waterOrigin;
  }
  waterOrigin.push({ q, r, s });

  if (grid[toIndex].waterOrigin) {
    waterOrigin = waterOrigin.concat(grid[toIndex].waterOrigin);
  }

  grid[toIndex].waterOrigin = waterOrigin;
};

const getNeighbours = (grid, hex) => {
  const possibleNeighbourCoords = HexUtils.neighbours(hex);
  let possibleNeighbours = [];

  possibleNeighbourCoords.forEach((neighbour) => {
    const nextIndex = getHexIndex(grid, neighbour);
    if (nextIndex !== -1) {
      possibleNeighbours.push(grid[nextIndex]);
    }
  });

  let weightedNeighbours = [];

  possibleNeighbours.forEach((neighbour) => {
    const neighbourIndex = getHexIndex(grid, neighbour);
    const waterOrigin = hex.waterOrigin;
    let isNotOrigin = true;
    if (Array.isArray(waterOrigin)) {
      isNotOrigin = getHexIndex(waterOrigin, neighbour) === -1;
    }
    const isNeighbourHigher =
      !grid[neighbourIndex].height || grid[neighbourIndex].height > hex.height;

    if (!isNeighbourHigher && isNotOrigin) {
      weightedNeighbours.push({ neighbour, neighbourIndex });
    }
  });
  return weightedNeighbours;
};

export const findConflictingLayout = (layout) => {
  let duplicatedHexes = [];

  if (Array.isArray(layout)) {
    let layoutWithoutLayer = JSON.parse(JSON.stringify(layout));
    layout.forEach((layer) => {
      layoutWithoutLayer = removeLayer(layoutWithoutLayer, layer);
      layer.hexes.forEach((hex) => {
        if (areSimilarHexesInLayout(hex, layoutWithoutLayer, layer.type)) {
          duplicatedHexes.push(hex);
        }
      });
    });
  }

  if (duplicatedHexes.length > 0) {
    throw new Error(
      `The following hexes are duplicated in this layout: ${JSON.stringify(
        duplicatedHexes
      )}`
    );
  }
};

const removeLayer = (layout, layer) => {
  let nextLayout = [];

  const modification = Object.keys(layer.type)[0];
  const value = layer.type[modification];
  layout.forEach((testLayer) => {
    const testModification = Object.keys(testLayer.type)[0];
    const testValue = testLayer.type[testModification];

    if (modification !== testModification || value !== testValue) {
      nextLayout.push(testLayer);
    }
  });
  return nextLayout;
};

const areSimilarHexesInLayout = (compareHex, layout, type) => {
  let foundHex = false;
  layout.forEach((layer) => {
    if (Object.keys(layer.type)[0] === Object.keys(type)[0]) {
      const similarHex = layer.hexes.find(
        (hex) =>
          compareHex.q === hex.q &&
          compareHex.r === hex.r &&
          compareHex.s === hex.s
      );
      if (similarHex) {
        foundHex = true;
      }
    }
  });

  return foundHex;
};

const cleanHexes = (grid) => {
  return grid.map(({ q, r, s, groundType, height }) => {
    return { q, r, s, groundType, height };
  });
};
