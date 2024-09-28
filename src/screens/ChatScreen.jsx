import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, FlatList, Text, StyleSheet, Image } from 'react-native';
import { collection, addDoc, query, onSnapshot, orderBy, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../config/firebase';

const ChatScreen = ({ chatPartnerId }) => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessagesCount, setNewMessagesCount] = useState(0);
  const [chatPartner, setChatPartner] = useState(null); // Para armazenar os dados do parceiro de chat

  // Pega o usuário autenticado
  const user = auth.currentUser;

  // Função para buscar os dados do parceiro de chat
  const fetchChatPartnerData = async () => {
    try {
      const docRef = doc(db, 'users', chatPartnerId);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setChatPartner(docSnap.data()); // Armazena os dados do parceiro de chat
      } else {
        console.error('Parceiro de chat não encontrado!');
      }
    } catch (error) {
      console.error('Erro ao buscar dados do parceiro de chat: ', error);
    }
  };

  // Envia a mensagem para o Firestore
  const sendMessage = async () => {
    if (message.trim()) {
      try {
        await addDoc(collection(db, 'messages'), {
          text: message,
          createdAt: new Date(),
          userId: user.uid,
          userName: user.displayName || 'Anônimo', // Nome do usuário autenticado
        });
        setMessage('');
      } catch (error) {
        console.error('Erro ao enviar mensagem: ', error);
      }
    }
  };

  // Escuta as mensagens em tempo real
  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('createdAt', 'asc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newMessages = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(newMessages);

      // Contagem de mensagens novas
      const unreadMessages = newMessages.filter(msg => msg.userId !== user.uid).length;
      setNewMessagesCount(unreadMessages);
    });

    return () => unsubscribe();
  }, []);

  // Busca os dados do parceiro de chat ao carregar o componente
  useEffect(() => {
    fetchChatPartnerData();
  }, [chatPartnerId]);

  // Renderiza cada mensagem
  const renderItem = ({ item }) => {
    const isCurrentUser = item.userId === user.uid;
    return (
      <View style={[styles.messageContainer, isCurrentUser ? styles.currentUserMessage : styles.otherUserMessage]}>
        <Text style={styles.userName}>{isCurrentUser ? 'Você' : item.userName}</Text>
        <Text style={styles.messageText}>{item.text}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Cabeçalho com foto e nome */}
      <View style={styles.header}>
        {chatPartner ? (
          <>
            <Image
              source={{ uri: chatPartner.photoURL }} // Foto de perfil do Firebase
              style={styles.profileImage}
            />
            <Text style={styles.chatTitle}>{chatPartner.displayName}</Text> {/* Nome do parceiro de chat */}
            {newMessagesCount > 0 && <Text style={styles.newMessagesBadge}>{newMessagesCount}</Text>}
          </>
        ) : (
          <Text>Carregando...</Text>
        )}
      </View>

      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.messagesList}
      />

      {/* Input para enviar mensagens */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Digite uma mensagem..."
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>Enviar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#e5e5e5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  chatTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  newMessagesBadge: {
    backgroundColor: 'red',
    color: 'white',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
    fontSize: 12,
  },
  messagesList: {
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  messageContainer: {
    maxWidth: '75%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  currentUserMessage: {
    backgroundColor: '#DCF8C6',
    alignSelf: 'flex-end',
  },
  otherUserMessage: {
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  userName: {
    fontWeight: 'bold',
    marginBottom: 5,
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#8a0b07',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ChatScreen;
