import createDataContext from './createDataContext';
import * as Location from 'expo-location';
import LocationError from '../components/LocationError';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_location':
      return { ...state, location: action.payload, enabled: true };
    case 'update_errorMessage':
      return { ...state, errorMessage: action.payload };
    case 'update_enabled':
      return { ...state, enabled: action.payload };
    case 'add_locationTracker':
      return { ...state, locationTracker: action.payload };
    default:
      return state;
  }
};

const enableLocationTracking = dispatch => {
  return async () => {
    try {
      let locEnabled = await Location.hasServicesEnabledAsync();
      if (!locEnabled) {
        dispatch({ type: 'update_errorMessage', payload: "Location services are not enabled" });
        dispatch({ type: 'update_enabled', payload: false });
        LocationError({ title: "Standort deaktiviert", message: "Um die Standortfunktion zu nutzen, aktivieren diese in den Einstellungen." });
        return;
      }

      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        dispatch({ type: 'update_errorMessage', payload: "Permission to access location was denied" });
        dispatch({ type: 'update_enabled', payload: false });
        LocationError({ title: "Standort Zugriff verweigert", message: "Um die Standortfunktion zu nutzen, aktiviere den Zugriff in den Einstellungen für die Defikarte." });
        return;
      }

      dispatch({ type: 'update_enabled', payload: true });

      const locationTracker = Location.watchPositionAsync({
        distanceInterval: 15,
        timeInterval: 20,
      }, (location) => {
        dispatch({
          type: 'update_location', payload: {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          }
        });
      })

      dispatch({ type: 'add_locationTracker', payload: { locationTracker } });

    } catch (err) {
      console.log({ err });
      dispatch({ type: 'update_errorMessage', payload: "Cannot access location" });
      dispatch({ type: 'update_enabled', payload: false });
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { enableLocationTracking },
  {
    location: null,
    enabled: false,
    errorMessage: '',
  }
);