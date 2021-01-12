import createDataContext from './createDataContext';
import defikarteBackendMock from '../api/defikarteBackend';

const reducer = (state, action) => {
  switch (action.type) {
    case 'get':
      return { ...state, defibrillators: action.payload };
    case 'set_nearLocation':
      return { ...state, defisNearLocation: action.payload };
    case 'update_error':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const getDefibrillators = dispatch => {
  return async () => {
    try {
      const response = await defikarteBackendMock.get('/defibrillator');
      dispatch({ type: 'get', payload: response.data });
    } catch (error) {
      dispatch({ type: 'update_error', payload: 'Defibrillatoren konnten nicht geladen werden.' })
      console.log(error);
    }
  };
};

const setDefisNearLocation = dispatch => {
  return defibrillators => {
    dispatch({ type: 'set_nearLocation', payload: defibrillators });
  }
};

const addDefibrillator = dispatch => {
  return async (defibrillator, callback) => {
    try {
      const response = await defikarteBackendMock.post('/defibrillator', defibrillator);
      console.log(response.data);
      if (callback) {
        callback();
      }
    } catch (error) {
      dispatch({ type: 'update_error', payload: 'Defibrillatoren konnten nicht hinzugefügt werden.' });
      console.log(error);
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { getDefibrillators, addDefibrillator, setDefisNearLocation },
  { defibrillators: [], defisNearLocation: [] }
);