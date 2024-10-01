// SearchChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity } from 'react-native';


// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDcQU6h9Hdl_iABchuS3OvK-xKB44Gt43Y",
    authDomain: "erroops-93c8a.firebaseapp.com",
    projectId: "erroops-93c8a",
    storageBucket: "erroops-93c8a.appspot.com",
    messagingSenderId: "694707365976",
    appId: "1:694707365976:web:440ace5273d2c0aa4c022d"
  };
  
  // Inicializa o Firebase
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

const SearchChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [users, setUsers] = useState([]);
  const [loggedUser, setLoggedUser] = useState(null); // Exemplo para pegar o usuário logado

  useEffect(() => {
    // Simular a recuperação do usuário logado
    setLoggedUser({ id: '123', email: 'usuario@exemplo.com' });

    if (search) {
      db.collection('usuarios')
        .where('email', '>=', search)
        .where('email', '<=', search + '\uf8ff')
        .get()
        .then(querySnapshot => {
          const usuarios = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(usuarios);
        });
    } else {
      setUsers([]);
    }
  }, [search]);

  const startChat = (otherUser) => {
    navigation.navigate('ChatScreen', { userId: loggedUser.id, otherUserId: otherUser.id });
  };

  return (
    <View>
      <TextInput
        placeholder="Procurar por email"
        value={search}
        onChangeText={(text) => setSearch(text)}
        style={{ padding: 10, borderWidth: 1, margin: 10 }}
      />
      <FlatList
        data={users}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => startChat(item)}>
            <Text style={{ padding: 10 }}>{item.email}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default SearchChatScreen;
