import React from 'react';
import { SafeAreaView, StatusBar } from "react-native";
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { Provider as DefibrillatorProvider } from './src/context/DefibrillatorContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import { Provider as InfoProvider } from './src/context/InfoContext';
import CreateScreen from './src/screens/CreateScreen';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';
import DetailScreen from './src/screens/DetailScreen';

const navigator = createStackNavigator({
  Main: { screen: MainScreen, navigationOptions: { title: 'Karte', headerShown: false } },
  List: { screen: ListScreen, navigationOptions: { title: 'In deiner Nähe', headerShown: true } },
  Create: { screen: CreateScreen, navigationOptions: { title: 'Defibrillator melden', headerShown: true } },
  Detail: { screen: DetailScreen, navigationOptions: { title: 'Detailansicht', headerShown: true } },
}, {
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    title: 'Defikarte.ch',
    headerShown: false,
  }
});

const App = createAppContainer(navigator);

export default () => {
  return (
    <DefibrillatorProvider>
      <LocationProvider>
        <InfoProvider>
          <StatusBar backgroundColor='rgba(255, 255, 255, 0)' barStyle={'dark-content'} />
          <SafeAreaView style={{ flex: 1 }}>
            <App />
          </SafeAreaView>
        </InfoProvider>
      </LocationProvider>
    </DefibrillatorProvider>
  );
};
