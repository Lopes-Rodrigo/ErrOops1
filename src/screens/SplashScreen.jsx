import React, { useEffect, useRef } from 'react';
import { View, Image, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const textOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animação de escala e opacidade para o logo e opacidade para o texto
    Animated.parallel([
      Animated.timing(logoScale, {
        toValue: 1,
        duration: 1000, // duração de 1 segundo
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 1000, // duração de 1 segundo
        useNativeDriver: true,
      }),
      Animated.timing(textOpacity, {
        toValue: 1,
        duration: 1500, // duração de 1.5 segundos para o texto aparecer suavemente
        useNativeDriver: true,
      }),
    ]).start();

    // Navegação após 2 segundos
    const timer = setTimeout(() => {
      navigation.replace('Welcome');
    }, 2000); // tempo reduzido para 2 segundos

    return () => clearTimeout(timer);
  }, [logoScale, logoOpacity, textOpacity]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={{ uri: 'https://your-logo-url.com/logo.png' }} // Substitua pela URL do seu logo
        style={[
          styles.logo,
          { transform: [{ scale: logoScale }], opacity: logoOpacity },
        ]}
      />
      <Animated.Text style={[styles.appName, { opacity: textOpacity }]}>
        ErrOops
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#8a0b07', // Cor de fundo da tela de splash
  },
  logo: {
    width: 150,
    height: 150,
  },
  appName: {
    marginTop: 20,
    fontSize: 32,
    fontWeight: 'bold',
    color: '#ffffff', // Cor do texto ErrOops
  },
});
