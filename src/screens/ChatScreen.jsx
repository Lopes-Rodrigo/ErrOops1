import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc } from 'firebase/firestore';
import { serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; // Ícones, incluindo a seta de voltar

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

const ChatScreen = ({ route, navigation }) => {
  const { userId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  // Carrega mensagens e atualiza em tempo real
  useEffect(() => {
    const chatId = getChatId(userId, otherUserId);
    const messagesRef = collection(db, 'chats', chatId, 'messages');
    const q = query(messagesRef, orderBy('timestamp', 'asc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const msgs = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
    });

    return () => unsubscribe();
  }, [userId, otherUserId]);

  // Envia mensagem
  const sendMessage = async () => {
    if (newMessage.trim()) {
      const chatId = getChatId(userId, otherUserId);
      const messagesRef = collection(db, 'chats', chatId, 'messages');

      await addDoc(messagesRef, {
        text: newMessage,
        senderId: userId,
        timestamp: serverTimestamp(),
      });
      setNewMessage('');
    }
  };

  // Gera o ID do chat
  const getChatId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  // Renderiza uma mensagem
  const renderMessage = ({ item }) => {
    const isSender = item.senderId === userId;
    return (
      <View style={[styles.messageContainer, isSender ? styles.sender : styles.receiver]}>
        <Text style={styles.messageText}>{item.text}</Text>
        <Text style={styles.timestamp}>
          {item.timestamp?.toDate().toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#8a0b07" />
      </TouchableOpacity>

      {/* Lista de mensagens */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={styles.messageList}
      />

      {/* Entrada de nova mensagem */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Digite uma mensagem"
          value={newMessage}
          onChangeText={setNewMessage}
          style={styles.input}
        />
        <Button title="Enviar" onPress={sendMessage} color="#8a0b07" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff', // Fundo branco
    justifyContent: 'space-between',
  },
  backButton: {
    padding: 10,
    position: 'absolute',
    top: 40,
    left: 20,
    zIndex: 1,
  },
  messageList: {
    padding: 10,
    marginTop: 60, // Espaço para o botão de voltar
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#8a0b07', // Mensagem do remetente com fundo #8a0b07
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#f1f1f1', // Mensagem do receptor com fundo claro
  },
  messageText: {
    color: '#ffffff', // Texto das mensagens do remetente
  },
  timestamp: {
    fontSize: 10,
    color: '#999', // Cor do timestamp
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#eeeeee',
    backgroundColor: '#f9f9f9',
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#8a0b07', // Borda da caixa de entrada
    padding: 10,
    borderRadius: 5,
    marginRight: 10,
  },
});

export default ChatScreen;
