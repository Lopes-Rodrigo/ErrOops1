import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, query, orderBy, onSnapshot, addDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; 

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
const auth = getAuth(app);

const ChatScreen = ({ route, navigation }) => {
  const { userId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUserData, setOtherUserData] = useState(null);

  // Atualiza o status de "online" no Firestore quando o usuário está conectado
  useEffect(() => {
    const updateStatus = async (status) => {
      const userDocRef = doc(db, 'onlineStatus', userId);
      if (status === 'online') {
        await setDoc(userDocRef, { status: 'online', lastSeen: serverTimestamp() }, { merge: true });
      } else {
        await setDoc(userDocRef, { status: 'offline', lastSeen: serverTimestamp() }, { merge: true });
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        updateStatus('online');
      } else {
        updateStatus('offline');
      }
    });

    return () => {
      updateStatus('offline');
      unsubscribe();
    };
  }, [userId]);

  // Puxa dados do outro usuário
  useEffect(() => {
    const fetchOtherUserData = async () => {
      const otherUserDoc = await getDoc(doc(db, 'usuarios', otherUserId));
      const otherUserStatusDoc = await getDoc(doc(db, 'onlineStatus', otherUserId));
      
      if (otherUserDoc.exists()) {
        setOtherUserData({ ...otherUserDoc.data(), ...otherUserStatusDoc.data() });
      }
    };
    fetchOtherUserData();
  }, [otherUserId]);

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

  // Calcula o tempo desde a última vez que o usuário esteve online
  const calculateLastSeenText = (lastSeen) => {
    const now = new Date();
    const lastSeenDate = lastSeen.toDate();
    const diffInMs = now - lastSeenDate;
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
      {/* Barra de navegação */}
      <View style={styles.navBar}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#8a0b07" />
        </TouchableOpacity>
        {otherUserData && (
          <View style={styles.userInfo}>
            <Image
              source={{ uri: otherUserData.profileImageUrl || 'https://placekitten.com/200/200' }}
              style={styles.profileImage}
            />
            <View style={styles.userDetails}>
              <Text style={styles.userName}>{otherUserData.nome || 'Usuário'}</Text>
              <Text style={styles.lastLogin}>
                {otherUserData.status === 'online'
                  ? 'Online'
                  : otherUserData.lastSeen
                    ? `Última vez online: ${calculateLastSeenText(otherUserData.lastSeen)}`
                    : 'Última vez online: Desconhecido'}
              </Text>
            </View>
          </View>
        )}
      </View>

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
    backgroundColor: '#f9f9f9',
    justifyContent: 'space-between',
  },
  navBar: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  backButton: {
    marginRight: 15,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 15,
  },
  userDetails: {
    flexDirection: 'column',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a0b07',
  },
  lastLogin: {
    fontSize: 14,
    color: '#999',
  },
  messageList: {
    padding: 10,
  },
  messageContainer: {
    maxWidth: '80%',
    marginVertical: 5,
    padding: 12,
    borderRadius: 10,
  },
  sender: {
    alignSelf: 'flex-end',
    backgroundColor: '#8a0b07',
  },
  receiver: {
    alignSelf: 'flex-start',
    backgroundColor: '#e1e1e1',
  },
  messageText: {
    color: '#000',
  },
  timestamp: {
    fontSize: 10,
    color: '#ccc',
    textAlign: 'right',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
  },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginRight: 10,
  },
});

export default ChatScreen;
