export const GetEmptyHexFromRectangleGrid = (index, qLength) => {
  const r = Math.floor(index / qLength);
  const q = (index % qLength) - Math.floor(r / 2);
  const s = -(r + q);

  return { q, r, s };
};

export const InitializeRectangularGrid = (qLength, rLength) => {
  let hexGrid = [];
  let s = 0;
  for (let r = 0; r < rLength; r++) {
    for (let q = 0 - Math.floor(r / 2); q < qLength - Math.floor(r / 2); q++) {
      hexGrid.push({ q, r, s, isMarked: false });
      s--;
    }
    s += qLength - 1;
    if (r % 2 === 1) s++;
  }

  return hexGrid;
};

export const ModifyGrid = (hexGrid, modifyHexes, modificationProperty) => {
  const nextHexGrid = JSON.parse(JSON.stringify(hexGrid));

  let modifiedHexes = JSON.parse(JSON.stringify(modifyHexes));

  if (
    typeof modificationProperty === "object" &&
    modificationProperty !== null
  ) {
    modifiedHexes = modifiedHexes.map((hex) =>
      Object.assign(hex, modificationProperty)
    );
  }

  modifiedHexes.forEach((modifiedHex) => {
    const modifiedHexIndex = GetHexIndex(hexGrid, modifiedHex);

    if (modifiedHexIndex !== -1) {
      nextHexGrid[modifiedHexIndex] = Object.assign(
        nextHexGrid[modifiedHexIndex],
        modifiedHex
      );
    }
  });

  return nextHexGrid;
};

export const GetHexIndex = (hexGrid, findHex) => {
  const hexIndex = hexGrid.findIndex((hex) => {
    return hex.q === findHex.q && hex.r === findHex.r && hex.s === findHex.s;
  });
  return hexIndex;
};

export const CleanHexes = (grid, keepProperties) => {
  return grid.map((hex) => ReduceHex(hex, keepProperties));
};

export const ReduceHex = (hex, keepProperties = []) => {
  const { q, r, s } = hex;
  let reducedHex = { q, r, s };
  if (Array.isArray(keepProperties)) {
    keepProperties.forEach((property) => {
      reducedHex[property] = hex[property];
    });
  }
  return reducedHex;
};

export const GetFullHex = (hexGrid, hex) => {
  return hexGrid[GetHexIndex(hexGrid, hex)];
};

export const FindConflictingLayout = (layout) => {
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