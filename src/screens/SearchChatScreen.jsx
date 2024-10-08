import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Image } from 'expo-image'; // Importa expo-image
import { collection, query, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase'; // Importa sua configuração Firebase

const SearchChatScreen = ({ navigation }) => {
  const [search, setSearch] = useState('');
  const [loggedUser, setLoggedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [chats, setChats] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Verifica se há um usuário autenticado
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setLoggedUser(user);
      } else {
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
        } catch (error) {
          console.log('Erro ao buscar usuários:', error);
        }
      };
      fetchUsers();
    }
  }, [loggedUser]);

  // Carrega os chats onde o usuário autenticado trocou mensagens
  useEffect(() => {
    if (loggedUser) {
      const q = query(
        collection(db, 'chats'),
        orderBy('lastMessageTime', 'desc')
      );
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const chatList = querySnapshot.docs
          .filter((doc) => {
            const chatUsers = doc.data().users || [];
            return chatUsers.includes(loggedUser.email); // Verifica se o usuário autenticado está na lista
          })
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        setChats(chatList);
        setIsLoading(false);
      });
      return unsubscribe;
    }
  }, [loggedUser]);

  // Função para iniciar um novo chat ou navegar para um existente
  const startChat = async (otherUser) => {
    navigation.navigate('ChatScreen', { userId: loggedUser.uid, otherUserId: otherUser.id });
  };

  // Renderiza a lista de chats com última mensagem e horário
  const renderChat = ({ item }) => {
    const otherUserEmail = item.users.find((email) => email !== loggedUser.email); // Encontra o outro usuário
    const otherUser = users.find((user) => user.email === otherUserEmail);

    if (!otherUser) return null;

    return (
      <TouchableOpacity style={styles.conversationItem} onPress={() => startChat(otherUser)}>
        <Image
          source={otherUser.profileImageUrl ? { uri: otherUser.profileImageUrl } : require('../../assets/ErrOops.png')}
          style={styles.profileImage}
          placeholder="blur"
          contentFit="cover"
          transition={1000}
        />
        <View style={styles.conversationText}>
          <Text style={styles.conversationName}>{otherUser.nome || 'Usuário Desconhecido'}</Text>
          <Text style={styles.lastMessage}>{item.lastMessage || 'Sem mensagens'}</Text>
          <Text style={styles.messageTime}>
            {item.lastMessageTime?.toDate().toLocaleString('pt-BR') || 'Data desconhecida'}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // Função para filtrar chats pela pesquisa
  const filteredChats = chats.filter((chat) =>
    chat.users.some((email) => email.toLowerCase().includes(search.toLowerCase()))
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
          data={filteredChats}
          keyExtractor={(item) => item.id}
          renderItem={renderChat} // Atualiza para exibir os chats filtrados
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
  lastMessage: {
    color: '#666',
    fontSize: 14,
    marginTop: 5,
  },
  messageTime: {
    color: '#999',
    fontSize: 12,
    marginTop: 2,
  },
});

export default SearchChatScreen;
