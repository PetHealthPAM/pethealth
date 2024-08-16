import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import fonts from './src/app/config/fonts';
import Routes from './src/app/routes/Routes';
import Toast from 'react-native-toast-message';

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