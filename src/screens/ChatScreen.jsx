// ChatScreen.js
import React, { useState, useEffect } from 'react';
import { View, TextInput, Button, FlatList, Text } from 'react-native';

import firebase from 'firebase';

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

const ChatScreen = ({ route }) => {
  const { userId, otherUserId } = route.params;
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const unsubscribe = db.collection('chats')
      .doc(getChatId(userId, otherUserId))
      .collection('messages')
      .orderBy('timestamp', 'asc')
      .onSnapshot(querySnapshot => {
        const msgs = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(msgs);
      });

    return () => unsubscribe();
  }, [userId, otherUserId]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      db.collection('chats')
        .doc(getChatId(userId, otherUserId))
        .collection('messages')
        .add({
          text: newMessage,
          senderId: userId,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        });
      setNewMessage('');
    }
  };

  const getChatId = (user1, user2) => {
    return user1 < user2 ? `${user1}_${user2}` : `${user2}_${user1}`;
  };

  const renderMessage = ({ item }) => {
    const isSender = item.senderId === userId;
    return (
      <View style={{ alignSelf: isSender ? 'flex-end' : 'flex-start', margin: 10 }}>
        <Text>{item.text}</Text>
        <Text style={{ fontSize: 10, color: 'gray' }}>
          {item.timestamp?.toDate().toLocaleTimeString()}
        </Text>
      </View>
    );
  };

  return (
    <View style={{ flex: 1, justifyContent: 'space-between' }}>
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={renderMessage}
        style={{ padding: 10 }}
      />
      <View style={{ flexDirection: 'row', padding: 10 }}>
        <TextInput
          placeholder="Digite uma mensagem"
          value={newMessage}
          onChangeText={setNewMessage}
          style={{ flex: 1, borderWidth: 1, padding: 10, marginRight: 10 }}
        />
        <Button title="Enviar" onPress={sendMessage} />
      </View>
    </View>
  );
};

export default ChatScreen;
