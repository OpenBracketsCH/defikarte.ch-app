import { useState, useEffect } from 'react';
import {
  Accuracy,
  requestForegroundPermissionsAsync,
  watchPositionAsync,
} from 'expo-location';

export default (userLocation, callback, enableLocationTracking, setLocationTracker) => {
  const [err, setErr] = useState(null);

  const startWatching = async () => {
    try {
      const { granted } = await requestForegroundPermissionsAsync();
      if (!granted) {
        throw new Error('Location permission not granted');
      }

      const sub = await watchPositionAsync(
        {
          accuracy: Accuracy.BestForNavigation,
          timeInterval: 20000,
          distanceInterval: 10,
        },
        callback
      );

      setLocationTracker(sub);
    } catch (e) {
      enableLocationTracking(false);
      setErr(e);
    }
  };

  useEffect(() => {
    if (userLocation.enabled && !userLocation.locationTracker) {
      startWatching();
    } else {
      if (userLocation.locationTracker) {
        userLocation.locationTracker.remove();
      }
      setLocationTracker(null);
    }
  }, [userLocation.enabled]);

  return [err, () => setErr(null)];
};
