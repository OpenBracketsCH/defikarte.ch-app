import createDataContext from './createDataContext';
import defikarteBackend from '../api/defikarteBackend';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_all':
      return {
        ...state, defibrillators: [...state.defibrillators.filter(d => {
          let inOsm = false;
          action.payload.forEach(n => {
            if (n.id == d.id) {
              inOsm = true;
            }
          })
          return d.new && !inOsm;
        }), ...action.payload]
      };
    case 'update_nearLocation':
      return { ...state, defisNearLocation: action.payload };
    case 'add_new':
      return { ...state, defibrillators: [action.payload, ...state.defibrillators] };
    case 'update_error':
      return { ...state, error: action.payload };
    case 'update_loading':
      return { ...state, loading: action.payload };
    case 'update_creating':
      return { ...state, creating: action.payload };
    default:
      return state;
  }
};

const getDefibrillators = dispatch => {
  return async () => {
    try {
      dispatch({ type: 'update_loading', payload: true });
      const response = await defikarteBackend.get('/defibrillator');
      dispatch({ type: 'update_all', payload: response.data });
    } catch (error) {
      dispatch({ type: 'update_error', payload: 'Defibrillatoren konnten nicht geladen werden.' });
    } finally {
      dispatch({ type: 'update_loading', payload: false });
    }
  };
};

const setDefisNearLocation = dispatch => {
  return defibrillators => {
    dispatch({ type: 'update_nearLocation', payload: defibrillators });
  }
};

const addDefibrillator = dispatch => {
  return async (defibrillator, callback) => {
    try {
      dispatch({ type: 'update_creating', payload: true });
      const response = await defikarteBackend.post('/defibrillator', defibrillator);
      let tags = {}
      // map osm to overpass model
      response.data.tags.forEach(d => {
        let attr = { [d.key]: d.value };
        tags = { ...tags, ...attr }
      });

      const defi = {
        ...response.data,
        lat: response.data.latitude,
        lon: response.data.longitude,
        new: true,
        tags: tags,
      }
      dispatch({ type: 'add_new', payload: defi });
      if (callback) {
        callback();
      }
    } catch (error) {
      console.log(error.message)
      dispatch({ type: 'update_error', payload: 'Defibrillator konnte nicht hinzugefügt werden.' });
    } finally {
      dispatch({ type: 'update_creating', payload: false });
    }
  };
};

const resetError = dispatch => {
  return () => {
    dispatch({ type: 'update_error', payload: '' })
  }
}

export const { Context, Provider } = createDataContext(
  reducer,
  { getDefibrillators, addDefibrillator, setDefisNearLocation, resetError },
  { defibrillators: [], defisNearLocation: [], loading: false, creating: false, error: '' }
);