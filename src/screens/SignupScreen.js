import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import styles from '../config/styles';


const SignupScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    auth.createUserWithEmailAndPassword(email, password)
      .then(() => {
        Alert.alert("Sucesso", "Conta criada com sucesso!");
        navigation.navigate('Login');
      })
      .catch(error => {
        Alert.alert("Erro", error.message);
      });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Cadastro</Text>
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
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={{ color: '#8a0b07' }}>Já tem uma conta? Faça login</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SignupScreen;
