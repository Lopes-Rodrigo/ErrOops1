import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../config/styles';



const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    auth.signInWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Sucesso", "Login realizado com sucesso!");
        navigation.navigate('Home');
      })
      .catch(error => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
        <Text style={{ color: '#8a0b07' }}>Não tem uma conta? Cadastre-se</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;
