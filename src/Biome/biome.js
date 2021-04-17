import { HexUtils } from "react-hexgrid";
import {
  GetFullHex,
  GetHexIndex,
  ReduceHex,
  CleanHexes,
} from "../utils/HexUtils";
import {GROUND_TYPES} from "../AirStation/constants/terrain"


const Biome = {
  GetFlow: (grid) => {
    grid = CleanHexes(grid, ["groundType", "height"]);
    const heightGroups = Biome.GetHeightGroups(grid);
    const river = grid
      .filter((hex) => hex.groundType === GROUND_TYPES.RIVER)
      .map((hex) => GetHexIndex(grid, hex));
    let nextGrid = JSON.parse(JSON.stringify(grid));
    Biome.FlowRiver(nextGrid, river);
    heightGroups.sortedKeys.forEach((key) => {
      let heightGroup = JSON.parse(JSON.stringify(heightGroups.groups[key]));
      let index = 0;
      let iterations = 0;
      const MAX_ITERATIONS = 100;

      while (heightGroup.length > 0 && iterations < MAX_ITERATIONS) {
        if (Biome.FlowHex(nextGrid, heightGroup[index]))
          heightGroup.splice(index, 1);

        index++;
        if (index >= heightGroup.length) index = 0;
        iterations++;
      }
    });

    return nextGrid;
  },
  GetHeightGroups: (grid) => {
    let heightGroups = {};
    if (Array.isArray(grid)) {
      grid.forEach((hex) => {
        if (hex.height !== undefined && hex.groundType !== GROUND_TYPES.RIVER) {
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
  },
  FlowRiver: (grid, riverIndexes) => {
    const MAX_ITERATIONS = 100 * riverIndexes.length;
    let index = 0;
    let iterations = 0;
    while (riverIndexes.length > 0 && iterations < MAX_ITERATIONS) {
      const riverHex = grid[riverIndexes[index]];

      let weightedDestinations = Biome.GetFlowPossibilities(
        grid,
        riverHex
      ).filter(
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
            (originHex) =>
              GetFullHex(grid, originHex).groundType === GROUND_TYPES.RIVER
          )
        ) {
          chosenDestination = weightedDestinations[0];
        }
      }
      if (chosenDestination) {
        Biome.FlowGrid(
          grid,
          riverIndexes[index],
          chosenDestination.neighbourIndex
        );
        iterations--;
        riverIndexes.splice(index, 1);
        index--;
      }
      index++;
      if (index === riverIndexes.length) {
        index = 0;
      }
      iterations++;
    }
  },
  FlowHex: (grid, hex) => {
    let weightedDestinations = Biome.GetFlowPossibilities(grid, hex);

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
      Biome.FlowGrid(
        grid,
        GetHexIndex(grid, hex),
        chosenDestination.neighbourIndex
      );
    }

    return chosenDestination !== undefined;
  },
  FlowGrid: (grid, fromIndex, toIndex) => {
    grid[fromIndex].flowedTo = ReduceHex(grid[toIndex]);

    let waterOrigin = [];
    if (grid[fromIndex].waterOrigin) {
      waterOrigin = grid[fromIndex].waterOrigin;
    }
    waterOrigin.push(ReduceHex(grid[fromIndex]));

    if (grid[toIndex].waterOrigin) {
      waterOrigin = waterOrigin.concat(grid[toIndex].waterOrigin);
    }

    grid[toIndex].waterOrigin = waterOrigin;
  },
  GetFlowPossibilities: (grid, hex) => {
    const possibleNeighbourCoords = HexUtils.neighbours(hex);
    let possibleNeighbours = [];

    possibleNeighbourCoords.forEach((neighbour) => {
      const nextIndex = GetHexIndex(grid, neighbour);
      if (nextIndex !== -1) {
        possibleNeighbours.push(grid[nextIndex]);
      }
    });

    let weightedNeighbours = [];

    possibleNeighbours.forEach((neighbour) => {
      const neighbourIndex = GetHexIndex(grid, neighbour);

      const waterOrigin = grid[GetHexIndex(grid, hex)].waterOrigin;
      let isNotOrigin = true;
      if (Array.isArray(waterOrigin)) {
        isNotOrigin = GetHexIndex(waterOrigin, neighbour) === -1;
      }
      const isNeighbourHigher =
        grid[neighbourIndex].height === undefined ||
        grid[neighbourIndex].height > hex.height;

      if (!isNeighbourHigher && isNotOrigin) {
        weightedNeighbours.push({ neighbour, neighbourIndex });
      }
    });
    return weightedNeighbours;
  },
};

export default Biome;
