// screens/WelcomeScreen.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export default function WelcomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.logo}>ErrOops</Text>
      <View style={styles.imagePlaceholder} />
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Entre</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.loginText}>Ainda não tem uma conta? Registre-se</Text>
      </TouchableOpacity>
    </View>
  );
}
const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#fff',
    },
    logo: {
      fontSize: 40,
      color: '#8a0b07',
      marginBottom: 20,
    },
    imagePlaceholder: {
      width: 100,
      height: 100,
      backgroundColor: '#8a0b07',
      borderRadius: 50,
      marginBottom: 50,
    },
    button: {
      backgroundColor: '#8a0b07',
      paddingVertical: 15,
      paddingHorizontal: 40,
      borderRadius: 25,
      marginBottom: 20,
    },
    buttonText: {
      color: '#fff',
      fontSize: 18,
    },
    loginText: {
      color: '#8a0b07',
      textDecorationLine: 'underline',
    },
  });