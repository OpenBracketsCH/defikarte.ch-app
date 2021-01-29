// restricts which defis are displayed, if not the map will block the ui
function currentDefisOnMap(defibrillators, region) {
  return defibrillators.filter(defibrillator => {
    const lat = defibrillator.lat;
    const lon = defibrillator.lon;

    const maxLat = region.latitude + region.latitudeDelta;
    const minLat = region.latitude - region.latitudeDelta;
    const maxLon = region.longitude + region.longitudeDelta;
    const minLon = region.longitude - region.longitudeDelta;

    return lat > minLat && lat < maxLat && lon > minLon && lon < maxLon;
  });
};

export default currentDefisOnMap;
