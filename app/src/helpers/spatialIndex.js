import RBush from 'rbush';

/**
 * Creates a spatial index (R-tree) from an array of defibrillators
 * This enables O(log n) spatial queries instead of O(n) linear filtering
 * @param {Array} defibrillators - Array of defibrillator objects with lat/lon properties
 * @returns {RBush} R-tree spatial index
 */
export function createDefiIndex(defibrillators) {
  const tree = new RBush();

  // Convert defibrillators to bounding boxes for R-tree
  const items = defibrillators.map((defi) => ({
    minX: defi.lon,
    minY: defi.lat,
    maxX: defi.lon,
    maxY: defi.lat,
    defi: defi, // Store reference to original object
  }));

  tree.load(items);
  return tree;
}

/**
 * Query defibrillators within a map region using spatial index
 * This is significantly faster than filtering the entire array
 * @param {RBush} tree - Spatial index created by createDefiIndex
 * @param {Object} region - Map region with latitude, longitude, and deltas
 * @returns {Array} Defibrillators within the region
 */
export function queryDefisInRegion(tree, region) {
  const maxLat = region.latitude + region.latitudeDelta;
  const minLat = region.latitude - region.latitudeDelta;
  const maxLon = region.longitude + region.longitudeDelta;
  const minLon = region.longitude - region.longitudeDelta;

  const results = tree.search({
    minX: minLon,
    minY: minLat,
    maxX: maxLon,
    maxY: maxLat,
  });

  return results.map((item) => item.defi);
}
