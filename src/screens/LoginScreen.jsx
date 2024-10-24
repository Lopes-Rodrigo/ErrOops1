import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { signInWithEmailAndPassword, GoogleAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth } from '../config/firebase';
import { FontAwesome } from 'react-native-vector-icons';
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Firestore
import * as Google from 'expo-auth-session/providers/google'; // Biblioteca para login com Google

const db = getFirestore();

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  // Login com Google usando Expo Auth Session
  const [request, response, promptAsync] = Google.useAuthRequest({
    expoClientId: 'YOUR_EXPO_CLIENT_ID.apps.googleusercontent.com',
    iosClientId: 'YOUR_IOS_CLIENT_ID.apps.googleusercontent.com',  // Adicione o clientId para iOS aqui
    androidClientId: 'YOUR_ANDROID_CLIENT_ID.apps.googleusercontent.com',  // Adicione o clientId para Android aqui
  });

  const handleLogin = async () => {
    setError('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));

      if (userDoc.exists()) {
        const userData = userDoc.data();

        if (userData.autenticacao === 1 || userData.autenticacao === 2) {
          navigation.navigate('Main');
        } else if (userData.autenticacao === 3) {
          navigation.navigate('PainelAdm');
        } else {
          setError('Permissão inválida.');
        }
      } else {
        setError('Dados do usuário não encontrados.');
      }
    } catch (error) {
      const errorCode = error.code;
      if (errorCode === 'auth/wrong-password') {
        setError('Senha incorreta. Tente novamente.');
      } else if (errorCode === 'auth/user-not-found') {
        setError('Usuário não encontrado.');
      } else {
        setError('Erro desconhecido.');
      }
    }
  };

  // Função para login com Google
  useEffect(() => {
    if (response?.type === 'success') {
      const { id_token } = response.params;
      const credential = GoogleAuthProvider.credential(id_token);
      signInWithCredential(auth, credential)
        .then(async (result) => {
          const user = result.user;

          const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();

            if (userData.autenticacao === 1 || userData.autenticacao === 2) {
              navigation.navigate('Main');
            } else if (userData.autenticacao === 3) {
              navigation.navigate('PainelAdm');
            } else {
              setError('Permissão inválida.');
            }
          } else {
            setError('Dados do usuário não encontrados.');
          }
        })
        .catch((error) => setError(error.message));
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>
      <Text style={styles.title}>Entrar na sua conta</Text>
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
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Ou entre com</Text>
      <TouchableOpacity style={styles.googleButton} onPress={() => promptAsync()}>
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
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#8a0b07',
    textAlign: 'center',
  },
  input: {
    backgroundColor: '#f1f1f1',
    borderRadius: 10,
    padding: 15,
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
  orText: {
    textAlign: 'center',
    marginVertical: 20,
    color: '#888',
  },
  googleButton: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#8a0b07',
    borderWidth: 2,
    width: 60,
    height: 60,
    alignSelf: 'center',
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#8a0b07',
    padding: 10,
    borderRadius: 10,
  },
});
