import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Dimensions } from 'react-native';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const { width: screenWidth } = Dimensions.get('window');

const HomeScreen = () => {
  const [userName, setUserName] = useState('');
  const carouselRef = useRef(null);
  const auth = getAuth();
  const db = getFirestore();
  const navigation = useNavigation();

 
  useEffect(() => {
    const fetchUserName = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, 'usuarios', user.uid);
        const userSnap = await getDoc(userDoc);
        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUserName(userData.nome);
        }
      }
    };
    fetchUserName();
  }, []);

  

  return (
    <View style={styles.container}>
      <View style={styles.navbar}>
        <Text style={styles.welcomeText}>Olá, {userName}!</Text>
      </View>

      <Text style={styles.heading}>Como podemos te ajudar hoje?</Text>

      
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 20,
  },
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 50,
    height: 50,
  },
  welcomeText: {
    fontSize: 18,
    color: '#8a0b07',
    fontWeight: '600',
  },
  heading: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#8a0b07',
    marginBottom: 20,
    textAlign: 'center',
  },
  quickActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 30,
  },
  actionButton: {
    backgroundColor: '#8a0b07',
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 10,
  },
  actionText: {
    color: '#fff',
    fontSize: 16,
  },
  carouselContainer: {
    marginTop: 30,
  },
  errorCard: {
    backgroundColor: '#f5f5f5',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#8a0b07',
    marginBottom: 10,
  },
  errorDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
