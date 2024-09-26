import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import Icon from 'react-native-vector-icons/Ionicons';  // Ícone de voltar
import { FontAwesome } from 'react-native-vector-icons'; // Ícone do Google
import { auth } from '../config/firebase';
import { getFirestore, collection, addDoc, getDoc, doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Instância do Firestore
  const db = getFirestore();

  // Função para registrar novo usuário com email e senha
  const handleRegister = () => {
    if (password !== confirmPassword) {
      setError('As senhas não coincidem');
      return;
    }

    createUserWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;

        // Adicionar o usuário na coleção 'usuarios'
        try {
          await setDoc(doc(db, 'usuarios', user.uid), {
            uid: user.uid,
            name: name,
            email: user.email,
            createdAt: new Date(),
          });
          console.log('Usuário registrado e salvo no Firestore:', user);
        } catch (firestoreError) {
          console.error('Erro ao salvar usuário no Firestore:', firestoreError);
        }

        navigation.navigate('Main'); // Redireciona para a página principal após o registro
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  // Função para login e cadastro via Google
  const handleGoogleLogin = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then(async (result) => {
        const user = result.user;

        // Verificar se o usuário já existe no Firestore
        const userDoc = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userDoc);

        if (!userSnap.exists()) {
          // Se o usuário não existir, adiciona no Firestore
          try {
            await setDoc(userDoc, {
              uid: user.uid,
              name: user.displayName,
              email: user.email,
              createdAt: new Date(),
            });
            console.log('Usuário Google salvo no Firestore:', user);
          } catch (firestoreError) {
            console.error('Erro ao salvar usuário Google no Firestore:', firestoreError);
          }
        }

        navigation.navigate('Main'); // Redireciona para a página principal após login com Google
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={name}
        onChangeText={setName}
      />
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Registrar</Text>
      </TouchableOpacity>

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
  backButton: {
    position: 'absolute',
    top: 40,
    left: 20,
    backgroundColor: '#8a0b07',
    padding: 10,
    borderRadius: 10,
  },
  backButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    marginBottom: 15,
    textAlign: 'center',
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
    marginTop: 20,
  },
});
