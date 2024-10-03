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

  const handleNavigation = (pet) => {
    if (pet && pet.ownerId) {
      navigation.navigate('Chat', { pet, ownerId: pet.ownerId });
    } else if (pet && !pet.ownerId) {
      console.warn('OwnerId não definido para o pet:', pet);
    } else {
      console.warn('Pet não definido:', pet);
    }
  };

  if (!fontsLoaded) {
    return null;
  }
  
  return (
    <>
      <NavigationContainer>
        <Routes handleNavigation={handleNavigation} />
        <Toast />
      </NavigationContainer>
    </>
  );
}
