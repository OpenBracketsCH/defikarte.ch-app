import React from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as DefibrillatorProvider } from './src/context/DefibrillatorContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import CreateScreen from './src/screens/CreateScreen';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';

const navigator = createStackNavigator({
  Main: MainScreen,
  List: ListScreen,
  Create: CreateScreen,
}, {
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    title: 'defikarte',
    headerShown: false,
  }
});

const App = createAppContainer(navigator);

export default () => {
  return (
    <DefibrillatorProvider>
      <LocationProvider>
        <App />
      </LocationProvider>
    </DefibrillatorProvider>
  );
};
