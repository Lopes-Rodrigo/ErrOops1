import React from 'react';
import { View, Text } from 'react-native';
import Navbar from '../components/Navbar'; // Importa a Navbar
import styles from '../config/styles'; // Supondo que você tenha um arquivo de estilos

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      
      <Text style={styles.heading}>Bem-vindo ao ErrOops</Text>
    </View>
  );
};

export default HomeScreen;
