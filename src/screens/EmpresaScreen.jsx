import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, onSnapshot, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import Icon from 'react-native-vector-icons/MaterialIcons';  // Importando a biblioteca de ícones

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDcQU6h9Hdl_iABchuS3OvK-xKB44Gt43Y",
  authDomain: "erroops-93c8a.firebaseapp.com",
  projectId: "erroops-93c8a",
  storageBucket: "erroops-93c8a.appspot.com",
  messagingSenderId: "694707365976",
  appId: "1:694707365976:web:440ace5273d2c0aa4c022d"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const EmpresaScreen = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState({});
  const [likes, setLikes] = useState({});
  const [userAuth, setUserAuth] = useState(null); // Para rastrear o campo de "autenticacao" do usuário

  useEffect(() => {
    // Fetch user info and check 'autenticacao' field
    const user = auth.currentUser;
    if (user) {
      const unsubscribe = onSnapshot(doc(db, 'usuarios', user.uid), (doc) => {
        if (doc.exists()) {
          setUserAuth(doc.data().autenticacao); // Obter o valor de 'autenticacao'
        }
      });

      return () => unsubscribe();
    }
  }, []);

  useEffect(() => {
    // Fetch posts from the 'posts' collection
    const unsubscribe = onSnapshot(collection(db, 'posts'), (snapshot) => {
      const postsData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(postsData);
    });

    return () => unsubscribe();
  }, []);

  const postComment = async (postId, commentText) => {
    if (commentText.trim()) {
      const user = auth.currentUser;
      if (user) {
        const email = user.email;
        try {
          const postRef = doc(db, 'posts', postId);
          await updateDoc(postRef, {
            comments: arrayUnion({ email, commentText })
          });
          setComments((prev) => ({ ...prev, [postId]: '' })); // Limpar o campo de entrada
        } catch (error) {
          console.error("Erro ao postar comentário: ", error);
        }
      } else {
        console.error("Usuário não está logado.");
      }
    }
  };

  const likePost = async (postId) => {
    const user = auth.currentUser;
    if (user) {
      try {
        const postRef = doc(db, 'posts', postId);
        await updateDoc(postRef, {
          likes: arrayUnion(user.email)
        });
      } catch (error) {
        console.error("Erro ao curtir postagem: ", error);
      }
    }
  };

  const renderPost = ({ item }) => {
    return (
      <View style={styles.postBox}>
        <Text style={styles.username}>{item.email}</Text>
        {item.imageUrl && (
          <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
        )}
        <Text style={styles.postText}>{item.caption}</Text>

        {/* Likes */}
        <TouchableOpacity onPress={() => likePost(item.id)}>
          <Text style={styles.likeButton}>Curtir ({item.likes?.length || 0})</Text>
        </TouchableOpacity>

        {/* Comments */}
        {item.comments && item.comments.length > 0 && (
          <View style={styles.commentList}>
            {item.comments.map((comment, index) => (
              <Text key={index} style={styles.comment}>
                <Text style={styles.commentUser}>{comment.email}:</Text> {comment.commentText}
              </Text>
            ))}
          </View>
        )}

        <View style={styles.commentSection}>
          <TextInput
            placeholder="Comente aqui..."
            value={comments[item.id] || ''}
            onChangeText={(text) => setComments({ ...comments, [item.id]: text })}
            style={styles.commentInput}
          />
          <TouchableOpacity onPress={() => postComment(item.id, comments[item.id])}>
            <Text style={styles.commentButton}>Comentar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        style={styles.postList}
      />

      {/* Mostrar o botão de postagem apenas para empresas (autenticacao = 2) */}
      {userAuth === 2 && (
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => navigation.navigate('PostagemScreen')} // Navegar para PostagemScreen
        >
          <Icon name="add" size={30} color="white" /> {/* Ícone de adicionar */}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  postList: {
    marginTop: 20,
  },
  postBox: {
    backgroundColor: '#8a0b07',
    padding: 20,
    marginBottom: 15,
    borderRadius: 10,
  },
  username: {
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  postText: {
    color: '#fff',
  },
  postImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  likeButton: {
    color: '#fff',
    marginTop: 5,
  },
  commentSection: {
    marginTop: 10,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#fff',
    padding: 5,
    color: '#000',
    backgroundColor: '#fff',
    borderRadius: 5,
  },
  commentButton: {
    color: '#fff',
    marginTop: 5,
  },
  commentList: {
    marginTop: 10,
  },
  comment: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  commentUser: {
    fontWeight: 'bold',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#000000',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
});

export default EmpresaScreen;
