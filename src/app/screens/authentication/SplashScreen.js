// src/screens/SplashScreen.js
import React, { useEffect } from 'react';
import { StyleSheet, View, Dimensions } from 'react-native';
import { Video } from 'expo-av';

export default function SplashScreen({ onFinish }) {
  useEffect(() => {
    // Quando o vídeo terminar, chama a função onFinish
    const timeout = setTimeout(() => {
      onFinish(); // Chama o callback para ocultar a splash
    }, 4000); // Tempo de duração do splash (em ms)

    return () => clearTimeout(timeout); // Limpa o timeout
  }, [onFinish]);

  return (
    <View style={styles.container}>
      <Video
        source={require('../../../../assets/splash.mp4')} // Coloque o vídeo splash.mp4 em assets
        style={styles.video}
        shouldPlay
        resizeMode="cover"
        isLooping={false} // Não repetir o vídeo
      />
    </View>
  );
}

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#7E57C2',
  },
  video: {
    width: width,
    height: 800,
  },
});
