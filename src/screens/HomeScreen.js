import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../config/styles';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bem-vindo ao ErrOops</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ErrorExamples')}
      >
        <Text style={styles.buttonText}>Exemplos de Erros</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Search')}
      >
        <Text style={styles.buttonText}>Pesquisar</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Community')}
      >
        <Text style={styles.buttonText}>Comunidade</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HomeScreen;
