import createDataContext from './createDataContext';

const reducer = (state, action) => {
  switch (action.type) {
    case 'update_showInfo':
      return { ...state, showInfo: action.payload };
    default:
      return state;
  }
};

const updateShowInfo = dispatch => {
  return (show) => {
    dispatch({
      type: 'update_showInfo', payload: show
    });
  };
};

export const { Context, Provider } = createDataContext(
  reducer,
  { updateShowInfo },
  {
    showInfo: true,
  }
);