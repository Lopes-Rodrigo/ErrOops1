import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

// Configuração do Firebase
const firebaseConfig = {
   apiKey: "AIzaSyDcQU6h9Hdl_iABchuS3OvK-xKB44Gt43Y",
    authDomain: "erroops-93c8a.firebaseapp.com",
    projectId: "erroops-93c8a",
    storageBucket: "erroops-93c8a.appspot.com",
    messagingSenderId: "694707365976",
    appId: "1:694707365976:web:440ace5273d2c0aa4c022d"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const CommunityScreen = () => {
  const [errorText, setErrorText] = useState('');
  const [errors, setErrors] = useState([]);
  const [comments, setComments] = useState({});

  useEffect(() => {
    // Recuperar os erros postados do Firebase
    const unsubscribe = onSnapshot(collection(db, 'errors'), (snapshot) => {
      const errorsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setErrors(errorsData);
    });

    return () => unsubscribe();
  }, []);

  const postError = async () => {
    if (errorText.trim()) {
      try {
        await addDoc(collection(db, 'errors'), {
          username: '@usuario' + Math.floor(Math.random() * 1000),
          text: errorText,
        });
        setErrorText('');
      } catch (error) {
        console.error("Erro ao postar: ", error);
      }
    }
  };

  const postComment = async (errorId, commentText) => {
    if (commentText.trim()) {
      setComments((prev) => ({ ...prev, [errorId]: '' }));
      // Aqui você pode adicionar a funcionalidade de salvar o comentário no Firebase
    }
  };

  const renderError = ({ item }) => {
    return (
      <View style={styles.errorBox}>
        <Text style={styles.username}>{item.username}</Text>
        <Text>{item.text}</Text>
        <View style={styles.commentSection}>
          <TextInput
            placeholder="Comente aqui..."
            value={comments[item.id] || ''}
            onChangeText={(text) => setComments({ ...comments, [item.id]: text })}
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={() => postComment(item.id, comments[item.id])}>
            <Text style={styles.commentButton}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Poste seu erro aqui..."
        value={errorText}
        onChangeText={setErrorText}
        style={styles.input}
      />
      <Button title="Postar Erro" onPress={postError} color="#8a0b07" />
      <FlatList
        data={errors}
        renderItem={renderError}
        keyExtractor={(item) => item.id}
        style={styles.errorList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#8a0b07',
    padding: 10,
    marginBottom: 20,
    borderRadius: 5,
  },
  errorList: {
    marginTop: 20,
  },
  errorBox: {
    backgroundColor: '#8a0b07',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  commentSection: {
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  commentButton: {
    color: '#fff',
    marginTop: 5,
  },
});

export default CommunityScreen;
