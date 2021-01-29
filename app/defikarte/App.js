import React from 'react';
import { SafeAreaView, StatusBar } from "react-native";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as DefibrillatorProvider } from './src/context/DefibrillatorContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import CreateScreen from './src/screens/CreateScreen';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';
import DetailScreen from './src/screens/DetailScreen';

const navigator = createStackNavigator({
  Main: MainScreen,
  List: ListScreen,
  Create: CreateScreen,
  Detail: { screen: DetailScreen, navigationOptions: { title: 'Detailansicht', headerShown: true } },
}, {
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    title: '',
    headerShown: false,
  }
});

const App = createAppContainer(navigator);

export default () => {
  return (
    <DefibrillatorProvider>
      <LocationProvider>
        <StatusBar backgroundColor='transparent' barStyle={'dark-content'} />
        <SafeAreaView style={{ flex: 1 }}>
          <App />
        </SafeAreaView>
      </LocationProvider>
    </DefibrillatorProvider>
  );
};
