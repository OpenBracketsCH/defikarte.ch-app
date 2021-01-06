import createDataContext from './createDataContext';
import * as Location from 'expo-location';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_location':
      console.log(action.payload)
      return { ...state, location: action.payload, enabled: true };
    case 'update_errorMessage':
      return { ...state, errorMessage: action.payload };
    case 'update_enabled':
      return { ...state, enabled: action.payload };
    default:
      return state;
  }
};

const enableLocationTracking = dispatch => {
  return (enable) => {
    dispatch({ type: 'update_enabled', payload: enable })
  }
}

const getUserLocation = dispatch => {
  return async () => {
    try {
      let { status } = await Location.requestPermissionsAsync();
      if (status !== "granted") {
        dispatch({ type: 'update_errorMessage', payload: "Permission to access location was denied" });
        return;
      }

      dispatch({ type: 'update_enabled', payload: true });

      const location = await Location.getCurrentPositionAsync({});

      dispatch({
        type: 'update_location', payload: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
        }
      });
    } catch (err) {
      console.log({ err });
      dispatch({ type: 'update_errorMessage', payload: "Cannot access location" });
      dispatch({ type: 'update_enabled', payload: false });
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { getUserLocation, enableLocationTracking },
  {
    location: null,
    enabled: false,
    errorMessage: '',
  }
);