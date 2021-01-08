import createDataContext from './createDataContext';
import defikarteBackendMock from '../api/defikarteBackend';

const reducer = (state, action) => {
  switch (action.type) {
    case 'get':
      return { ...state, defibrillators: action.payload };
    case 'set_nearLocation':
      return { ...state, defisNearLocation: action.payload };
  }
};

const getDefibrillators = dispatch => {
  return async () => {
    const response = await defikarteBackendMock.get('/defibrillator');

    dispatch({ type: 'get', payload: response.data });
  };
};

const setDefisNearLocation = dispatch => {
  return defibrillators => {
    dispatch({ type: 'set_nearLocation', payload: defibrillators });
  }
};

const addDefibrillator = dispatch => {
  return async (defibrillator, callback) => {
    const response = await defikarteBackendMock.post('/defibrillator', defibrillator);
    console.log(response.data);
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { getDefibrillators, addDefibrillator, setDefisNearLocation },
  { defibrillators: [], defisNearLocation: [] }
);