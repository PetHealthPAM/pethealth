import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import fonts from './src/app/config/fonts';
import Routes from './src/app/routes/Routes';
import Toast from 'react-native-toast-message';
import { LogBox } from 'react-native';

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);


export default function App() {
  const [fontsLoaded] = useFonts(fonts);

  if (!fontsLoaded) {
    return null;
  }
  return (
    <>
    <NavigationContainer>
      <Routes />
      <Toast />
    </NavigationContainer>
    </>
  );
}