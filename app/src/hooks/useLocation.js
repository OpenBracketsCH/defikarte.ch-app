import { Accuracy, requestForegroundPermissionsAsync, watchPositionAsync } from 'expo-location';
import { useEffect, useState } from 'react';

export default (userLocation, callback, enableLocationTracking, setLocationTracker) => {
  const [err, setErr] = useState(null);

  useEffect(() => {
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

    if (userLocation.enabled && !userLocation.locationTracker) {
      startWatching();
    } else {
      if (userLocation.locationTracker) {
        userLocation.locationTracker.remove();
      }
      setLocationTracker(null);
    }
  }, [callback, enableLocationTracking, setLocationTracker, userLocation.enabled, userLocation.locationTracker]);

  return [err, () => setErr(null)];
};
