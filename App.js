import { NavigationContainer } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import 'react-native-gesture-handler';
import fonts from './src/app/config/fonts';
import Routes from './src/app/routes/Routes';
import Toast from 'react-native-toast-message';
import { LogBox, View } from 'react-native';
import { useEffect, useState } from 'react';
import SplashScreen from './src/app/screens/authentication/SplashScreen'; // Tela Splash animada

LogBox.ignoreLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews',
]);

export default function App() {
  const [fontsLoaded] = useFonts(fonts);
  const [isSplashVisible, setSplashVisible] = useState(true); // Estado para controlar a exibição da splash
  const [isReady, setIsReady] = useState(false); // Estado para controlar a prontidão do app

  useEffect(() => {
    // Simula a animação da splash e depois navega para o app
    const timeout = setTimeout(() => {
      setSplashVisible(false); // Após 4 segundos, oculta a splash
      setIsReady(true); // O aplicativo está pronto para ser exibido
    }, 4000); // Tempo de exibição da splash

    return () => clearTimeout(timeout); // Limpa o timeout se o componente desmontar
  }, []);

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
    return null; // Carregando fontes
  }

  // Se a splash estiver visível, retorna a tela splash
  if (isSplashVisible) {
    return <SplashScreen onFinish={() => setSplashVisible(false)} />;
  }

  // Retorna as rotas do app após a splash
  return (
    <>
      <NavigationContainer>
        <Routes handleNavigation={handleNavigation} />
        <Toast />
      </NavigationContainer>
    </>
  );
}
