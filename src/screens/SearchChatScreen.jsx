import React, { useState, useEffect } from 'react';
import { View, TextInput, FlatList, Text, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { Image } from 'expo-image'; // Importa expo-image
import { collection, query, getDocs, onSnapshot, orderBy } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { db, auth } from '../config/firebase'; // Importa sua configuração Firebase
import Icon from 'react-native-vector-icons/Ionicons';

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
          const q = query(collection(db, 'usuarios'));
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
            return chatUsers.includes(loggedUser.email);
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

  const startChat = async (otherUser) => {
    navigation.navigate('ChatScreen', { userId: loggedUser.uid, otherUserId: otherUser.id });
  };

  const calculateLastMessageTimeText = (lastMessageTime) => {
    if (!lastMessageTime) return 'Data desconhecida';

    const now = new Date();
    const messageTimeDate = lastMessageTime.toDate();
    const diffInMs = now - messageTimeDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 60) {
      return `${diffInMinutes} minutos atrás`;
    } else if (diffInHours < 24) {
      return `${diffInHours} horas atrás`;
    } else {
      return `${diffInDays} dias atrás`;
    }
  };

  const hasNewMessage = (chat) => {
    if (chat.lastMessage && chat.lastMessageSender !== loggedUser.email) {
      if (chat.lastMessageTime && chat.lastReadTime) {
        return chat.lastMessageTime.toDate() > chat.lastReadTime.toDate();
      }
      return true;
    }
    return false;
  };

  const renderChat = ({ item }) => {
    const otherUserEmail = item.users.find((email) => email !== loggedUser.email);
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
          <Text style={styles.lastMessage}>
            {item.lastMessage && item.lastMessage.trim() !== '' ? item.lastMessage : 'Sem mensagens'}
          </Text>
          <Text style={styles.messageTime}>
            {item.lastMessageTime ? calculateLastMessageTimeText(item.lastMessageTime) : 'Data desconhecida'}
          </Text>
        </View>
        {hasNewMessage(item) && <View style={styles.newMessageIndicator} />}
      </TouchableOpacity>
    );
  };

  const renderUserSuggestions = () => {
    const filteredUsers = users.filter((user) =>
      user.nome.toLowerCase().includes(search.toLowerCase()) || 
      user.email.toLowerCase().includes(search.toLowerCase())
    );

    return (
      <FlatList
        data={filteredUsers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.suggestionItem} onPress={() => startChat(item)}>
            <Text style={styles.suggestionText}>{item.nome} ({item.email})</Text>
          </TouchableOpacity>
        )}
      />
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.welcomeMessage}>Conversas</Text> {/* Mensagem de boas-vindas */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <TextInput
          placeholder="Procure por nome ou email"
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={styles.searchInput}
        />
      </View>
      {search ? renderUserSuggestions() : null}

      {isLoading ? (
        <ActivityIndicator size="large" color="#8a0b07" />
      ) : (
        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={renderChat}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 10,
  },
  welcomeMessage: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20, // Espaço entre a mensagem e o cabeçalho
    color: '#8a0b07',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20, // Espaço entre o cabeçalho e o conteúdo
    marginTop: 20, // Move o cabeçalho um pouco mais para baixo
  },
  backButton: {
    backgroundColor: '#8a0b07',
    padding: 10,
    borderRadius: 10,
    marginRight: 10, // Espaço entre o botão e o campo de pesquisa
  },
  searchInput: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#8a0b07',
    borderRadius: 8,
    flex: 1, // Ocupa o espaço restante ao lado do botão
    backgroundColor: '#f2f2f2',
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
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
    color: '#8a0b07',
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
  newMessageIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#8a0b07',
    marginLeft: 10,
  },
  suggestionItem: {
    padding: 12,
    backgroundColor: '#fff',
    marginBottom: 10,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  suggestionText: {
    color: '#8a0b07',
    fontSize: 16,
  },
});

export default SearchChatScreen;
