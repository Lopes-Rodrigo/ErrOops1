import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Menu, Divider, Provider, useTheme } from 'react-native-paper';
import { Image } from 'expo-image'; // Importa expo-image
import { getAuth, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { initializeApp } from 'firebase/app';

// Importando suas telas
import SplashScreen from '../screens/SplashScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import EmpresaScreen from '../screens/EmpresaScreen';

// Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyDcQU6h9Hdl_iABchuS3OvK-xKB44Gt43Y",
  authDomain: "erroops-93c8a.firebaseapp.com",
  projectId: "erroops-93c8a",
  storageBucket: "erroops-93c8a.appspot.com",
  messagingSenderId: "694707365976",
  appId: "1:694707365976:web:440ace5273d2c0aa4c022d"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Componente de Menu do Perfil
const ProfileMenu = () => {
  const [visible, setVisible] = useState(false);
  const [userPhoto, setUserPhoto] = useState(null);
  const navigation = useNavigation();
  const screenWidth = Dimensions.get('window').width; // Largura da tela

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        try {
          const docRef = doc(db, 'usuarios', user.uid);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            setUserPhoto(docSnap.data().profileImageUrl || null); // Define a foto do usuário
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigation.navigate('Login'); // Navega para a tela de login após logout
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const handleProfileEdit = () => {
    navigation.navigate('Profile');
    closeMenu(); // Fecha o menu
  };

  return (
    <Provider>
      <View style={styles.menuContainer}>
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu}>
              {userPhoto ? (
                <Image source={{ uri: userPhoto }} style={styles.profileImage} />
              ) : (
                <MaterialCommunityIcons name="account-circle" size={40} color="black" />
              )}
            </TouchableOpacity>
          }
          style={[styles.menuStyle, { left: screenWidth * 0.7}]} // Posiciona o menu de forma dinâmica
        >
          <Menu.Item onPress={handleProfileEdit} title="Editar Perfil" />
          <Divider />
          <Menu.Item onPress={handleLogout} title="Sair" />
        </Menu>
      </View>
    </Provider>
  );
};

// Setup de Navegação
const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Main" component={TabNavigator} options={{ headerRight: () => <ProfileMenu />, headerStyle: { backgroundColor: '#8a0b07' }, headerTintColor: '#fff', headerTitleAlign: 'center' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Meu Perfil', headerStyle: { backgroundColor: '#8a0b07' }, headerTintColor: '#fff' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Tab Navigation
function TabNavigator() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";

  return (
    <Tab.Navigator barStyle={{ backgroundColor: '#8a0b07' }} activeColor="black" inactiveColor="#ffffff">
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: 'Página Inicial', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} /> }} />
      <Tab.Screen name="Search" component={SearchScreen} options={{ title: 'Pesquisar', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify" color={color} size={26} /> }} />
      <Tab.Screen name="Community" component={CommunityScreen} options={{ title: 'Comunidade', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="account-group" color={color} size={26} /> }} />
      <Tab.Screen name="EmpresaScreen" component={EmpresaScreen} options={{ title: 'Empresas', tabBarIcon: ({ color }) => <MaterialCommunityIcons name="briefcase-eye" color={color} size={26} /> }} />
    </Tab.Navigator>
  );
}

// Estilos da Navbar e ProfileMenu
const styles = StyleSheet.create({
  menuContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginRight: 15,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  menuStyle: {
    // Deixando sem valores fixos para ajuste dinâmico baseado no tamanho da tela
    position: 'absolute',
    top: 100, // Ajusta conforme necessário
    
  },
});
