import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet } from 'react-native';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [recado, setRecado] = useState('');

  const user = auth.currentUser;

  useEffect(() => {
    // Puxa os dados do Firestore
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'users', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.displayName || '');
        setPhotoURL(userData.photoURL || '');
        setRecado(userData.recado || '');
      }
    };
    
    fetchUserData();
  }, []);

  const updateProfile = async () => {
    try {
      // Atualiza os dados no Firestore
      await setDoc(doc(db, 'users', user.uid), {
        displayName,
        photoURL,
        recado,
      });

      // Atualiza o perfil no Firebase Authentication
      await user.updateProfile({
        displayName,
        photoURL,
      });

      alert('Perfil atualizado com sucesso!');
    } catch (error) {
      console.error('Erro ao atualizar perfil: ', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Editar Perfil</Text>

      <Image
        source={{ uri: photoURL || 'https://placekitten.com/200/200' }} // Imagem padrão
        style={styles.profileImage}
      />

      <TextInput
        placeholder="URL da foto"
        value={photoURL}
        onChangeText={setPhotoURL}
        style={styles.input}
      />

      <TextInput
        placeholder="Nome"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />

      <TextInput
        placeholder="Deixe um recado"
        value={recado}
        onChangeText={setRecado}
        style={styles.input}
        multiline
      />

      <Button title="Salvar" onPress={updateProfile} color="#8a0b07" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#8a0b07',
    marginBottom: 20,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
    alignSelf: 'center',
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#8a0b07',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default ProfileScreen;
