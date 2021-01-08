import createDataContext from './createDataContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_location':
      return { ...state, location: action.payload };
    case 'update_enabled':
      return { ...state, enabled: action.payload };
    case 'update_locationTracker':
      return { ...state, locationTracker: action.payload };
    default:
      return state;
  }
};

const updateLocation = dispatch => {
  return (location) => {
    dispatch({
      type: 'update_location', payload: {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      }
    });
  };
};

const enableLocationTracking = dispatch => {
  return (enable) => {
    dispatch({ type: 'update_enabled', payload: enable });
  };
};

const setLocationTracker = dispatch => {
  return (tracker) => {
    dispatch({ type: 'update_locationTracker', payload: tracker });
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { updateLocation, enableLocationTracking, setLocationTracker },
  {
    location: null,
    enabled: false,
  }
);