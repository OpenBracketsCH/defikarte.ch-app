import { t } from 'i18next';
import 'intl-pluralrules';
import { StatusBar } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import ErrorBoundary from './src/components/ErrorBoundary';
import { Provider as DefibrillatorProvider } from './src/context/DefibrillatorContext';
import { Provider as InfoProvider } from './src/context/InfoContext';
import { Provider as LocationProvider } from './src/context/LocationContext';
import './src/i18n/i18n';
import AboutScreen from './src/screens/AboutScreen';
import CreateScreen from './src/screens/CreateScreen';
import DetailScreen from './src/screens/DetailScreen';
import ListScreen from './src/screens/ListScreen';
import MainScreen from './src/screens/MainScreen';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

// Navigation structure changes significantly
function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Main">
        <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false, title: t('map') }} />
        <Stack.Screen name="List" component={ListScreen} options={{ title: t('close_to_you') }} />
        <Stack.Screen name="Create" component={CreateScreen} options={{ title: t('create_aed') }} />
        <Stack.Screen name="Detail" component={DetailScreen} options={{ title: t('detail_view') }} />
        <Stack.Screen name="About" component={AboutScreen} options={{ title: t('about') }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <DefibrillatorProvider>
      <LocationProvider>
        <InfoProvider>
          <SafeAreaProvider>
            <StatusBar backgroundColor="rgba(255, 255, 255, 0)" barStyle={'dark-content'} />
            <ErrorBoundary>
              <AppNavigator />
            </ErrorBoundary>
          </SafeAreaProvider>
        </InfoProvider>
      </LocationProvider>
    </DefibrillatorProvider>
  );
};
