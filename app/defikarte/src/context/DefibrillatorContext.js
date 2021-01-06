import createDataContext from './createDataContext';
import defikarteBackendMock from '../api/defikarteBackendMock';

const reducer = (state, action) => {
  switch (action.type) {
    case 'get':
      return action.payload;
  }
};

const getDefibrillators = dispatch => {
  return async () => {
    const response = await defikarteBackendMock.get('/defibrillator');

    dispatch({ type: 'get', payload: response.data })
  };
};

const addDefibrillator = () => {
  return async (defibrillator, callback) => {
    await defikarteBackendMock.post('/defibrillator', defibrillator)
    if (callback) {
      callback();
    }
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { getDefibrillators, addDefibrillator },
  []
);