import createDataContext from './createDataContext';
import defikarteBackendMock from '../api/defikarteBackend';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_all':
      return { ...state, defibrillators: action.payload };
    case 'update_nearLocation':
      return { ...state, defisNearLocation: action.payload };
    case 'update_error':
      return { ...state, error: action.payload };
    case 'update_loading':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

const getDefibrillators = dispatch => {
  return async () => {
    try {
      dispatch({ type: 'update_loading', payload: true })
      const response = await defikarteBackendMock.get('/defibrillator');
      dispatch({ type: 'update_all', payload: response.data });
    } catch (error) {
      dispatch({ type: 'update_error', payload: 'Defibrillatoren konnten nicht geladen werden.' })
    }
    finally {
      dispatch({ type: 'update_loading', payload: false })
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
      const response = await defikarteBackendMock.post('/defibrillator', defibrillator);
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch({ type: 'update_error', payload: 'Defibrillatoren konnten nicht hinzugefügt werden.' });
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { getDefibrillators, addDefibrillator, setDefisNearLocation },
  { defibrillators: [], defisNearLocation: [], loading: false, error: '' }
);