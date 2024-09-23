import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';  // Ícone de voltar
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FontAwesome } from 'react-native-vector-icons'; // Ícone do Google

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = () => {
    setError(''); // Limpa o erro antes de tentar logar
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('Usuário logado:', user);
        navigation.navigate('Main'); // Navega para a página principal
      })
      .catch((error) => {
        const errorCode = error.code;
        switch (errorCode) {
          case 'auth/wrong-password':
            setError('Senha incorreta. Tente novamente.');
            break;
          case 'auth/user-not-found':
            setError('Usuário não encontrado. Verifique o email e tente novamente.');
            break;
          case 'auth/invalid-email':
            setError('O formato do email é inválido.');
            break;
          case 'auth/too-many-requests':
            setError('Muitas tentativas. Tente novamente mais tarde.');
            break;
          default:
            setError('Erro desconhecido. Tente novamente.');
        }
      });
  };
  
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        console.log('Usuário logado com Google:', result.user);
        navigation.navigate('Main'); // Redireciona para a página principal após login com Google
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar com ícone */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Ícone do Google com fundo branco e clicável */}
      <TouchableOpacity style={styles.googleButton} onPress={handleGoogleLogin}>
        <FontAwesome name="google" size={24} color="#8a0b07" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#ffffff',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginBottom: 15,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  button: {
    backgroundColor: '#8a0b07',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
  },
  googleButton: {
    backgroundColor: '#fff', // Fundo branco
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#8a0b07', // Borda para dar destaque
    borderWidth: 2,
    width: 60, // Largura e altura ajustadas
    height: 60,
    alignSelf: 'center',
    marginTop: 20,
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#8a0b07',
    padding: 10,
    borderRadius: 10,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
});
