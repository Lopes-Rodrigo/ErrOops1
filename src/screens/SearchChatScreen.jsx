import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Importa expo-image
import { collection, query, getDocs, setDoc, doc, serverTimestamp, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase'; // Importa a configuração do Firebase

const SearchChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há um usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user);
      } else {
        // Redirecionar para tela de login caso necessário
        navigation.navigate('LoginScreen');
      }
    });
    return unsubscribe;
  }, []);

  // Carrega os usuários da coleção 'usuarios'
  useEffect(() => {
    if (loggedUser) {
      const fetchUsers = async () => {
        try {
          const q = query(collection(db, 'usuarios')); // Busca usuários da coleção 'usuarios'
          const querySnapshot = await getDocs(q);
          const userList = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(userList);
          setIsLoading(false);
        } catch (error) {
          console.log('Erro ao buscar usuários:', error);
        }
      };
      fetchUsers();
    }
  }, [loggedUser]);

  // Função para iniciar um novo chat ou navegar para um existente
  const startChat = async (otherUser) => {
    if (!otherUser || !otherUser.email) {
      console.error('Usuário inválido ao tentar iniciar o chat');
      return;
    }

    const chatId = getChatId(loggedUser.email, otherUser.email);

    const chatRef = doc(db, 'chats', chatId); // Atualizado para coleção 'chats'
    const chatDoc = await getDoc(chatRef);

    if (!chatDoc.exists()) {
      await setDoc(chatRef, {
        users: [loggedUser.email, otherUser.email],
        lastMessage: '',
        lastMessageTime: serverTimestamp(),
        lastMessageSender: '',
      });
    }

    navigation.navigate('ChatScreen', { userId: loggedUser.uid, otherUserId: otherUser.id });
  };

  // Função para gerar o ID do chat com base nos e-mails dos usuários
  const getChatId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  // Renderiza um item da lista de usuários
  const renderUser = ({ item }) => (
    <TouchableOpacity style={styles.conversationItem} onPress={() => startChat(item)}>
      <Image
        source={item.profileImageUrl ? { uri: item.profileImageUrl } : require('../../assets/ErrOops.png')} // Verifica se existe uma URL da imagem de perfil
        style={styles.profileImage}
        placeholder="blur" // Placeholder opcional para carregamento
        contentFit="cover"
        transition={1000} // Transição suave para carregar a imagem
      />
      <View style={styles.conversationText}>
        <Text style={styles.conversationName}>{item.nome || 'Usuário Desconhecido'}</Text>
        <Text style={styles.conversationEmail}>{item.email}</Text>
      </View>
    </TouchableOpacity>
  );

  // Função para filtrar usuários pela pesquisa
  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(search.toLowerCase()) || user.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="Procure por um usuário"
        value={search}
        onChangeText={(text) => setSearch(text)}
        style={styles.searchInput}
      />

      {isLoading ? (
        <Text>Carregando...</Text>
      ) : (
        <FlatList
          data={filteredUsers}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
  },
  searchInput: {
    padding: 10,
    borderWidth: 1,
    borderColor: '#8a0b07', // Borda e detalhes na cor #8a0b07
    borderRadius: 10,
    margin: 10,
    backgroundColor: '#f9f9f9',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eeeeee',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  conversationText: {
    flex: 1,
  },
  conversationName: {
    color: '#8a0b07', // Nome na cor #8a0b07
    fontWeight: 'bold',
    fontSize: 16,
  },
  conversationEmail: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
});

export default SearchChatScreen;
