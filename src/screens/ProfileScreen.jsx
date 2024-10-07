import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../config/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

const ProfileScreen = () => {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [isLoadingImage, setIsLoadingImage] = useState(false);

  const user = auth.currentUser;

  useEffect(() => {
    // Puxa os dados do Firestore da coleção 'usuarios'
    const fetchUserData = async () => {
      const userDoc = await getDoc(doc(db, 'usuarios', user.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setDisplayName(userData.nome || '');
        setEmail(userData.email || '');
        setPhotoURL(userData.profileImageUrl || '');
      }
    };

    fetchUserData();
  }, []);

  const updateProfile = async () => {
    try {
      // Atualiza os dados no Firestore da coleção 'usuarios'
      await setDoc(doc(db, 'usuarios', user.uid), {
        nome: displayName,
        email,
        profileImageUrl: photoURL,
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

  const pickImage = async () => {
    // Solicita permissão para acessar a galeria
    const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert('Permissão para acessar a galeria é necessária!');
      return;
    }

    // Abre a galeria para selecionar a imagem
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setPhotoURL(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Editar Perfil</Text>

      <TouchableOpacity onPress={pickImage}>
        <Image
          source={{ uri: photoURL || 'https://placekitten.com/200/200' }} // Imagem padrão
          style={styles.profileImage}
        />
      </TouchableOpacity>
      <Text style={styles.imageText}>Toque para atualizar a foto</Text>

      <TextInput
        placeholder="Nome"
        value={displayName}
        onChangeText={setDisplayName}
        style={styles.input}
      />

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
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
    marginBottom: 10,
    
  },
  imageText: {
    textAlign: 'center',
    color: '#8a0b07',
    marginBottom: 20,
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
