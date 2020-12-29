import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';

const navigator = createStackNavigator({
  Main: MainScreen,
  List: ListScreen,
}, {
  initialRouteName: 'Main',
  defaultNavigationOptions: {
    title: 'defikarte',
    headerShown: false,
  }
});

export default createAppContainer(navigator);
