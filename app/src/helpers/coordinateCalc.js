function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

function distanceBetweenPoints(lat1, lon1, lat2, lon2) {
  let R = 6371000; // Radius of the earth in m
  let dLat = deg2rad(lat2 - lat1);
  let dLon = deg2rad(lon2 - lon1);
  let a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  let d = R * c; // Distance in m
  return parseInt(d);
}

export default distanceBetweenPoints;
