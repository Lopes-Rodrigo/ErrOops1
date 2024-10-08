import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useTheme } from 'react-native-paper';
import { Menu, Divider, Button, Provider } from 'react-native-paper';
import { Image } from 'expo-image'; // Importa expo-image
import { getAuth } from 'firebase/auth'; // Assumindo que Firebase Auth está configurado
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Para acessar Firestore

import SplashScreen from '../screens/SplashScreen'; 
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';
import SearchChatScreen from '../screens/SearchChatScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Navbar superior com botão de perfil à direita


function Navbar({ navigation }) {
  const [visible, setVisible] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null); // Armazena a URL da imagem do usuário

  const auth = getAuth(); // Autenticação do Firebase
  const db = getFirestore(); // Instância do Firestore

  // Função para buscar a URL da imagem do perfil
  const fetchProfileImage = async () => {
    const user = auth.currentUser; // Usuário logado
    if (user) {
      const userDoc = doc(db, 'usuarios', user.uid); // Referência ao documento do usuário
      const userSnap = await getDoc(userDoc); // Obtem os dados do Firestore
      if (userSnap.exists()) {
        const userData = userSnap.data();
        setProfileImageUrl(userData.profileImageUrl); // Pega a URL da imagem de perfil
      }
    }
  };

  // Chama a função para buscar a imagem do perfil ao montar o componente
  useEffect(() => {
    fetchProfileImage();
  }, []);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  return (
    <Provider>
      <View style={styles.navbar}>
        {/* Botão de perfil com foto do usuário e menu suspenso */}
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity
              style={styles.profileButton}
              onPress={openMenu} // Abre o menu ao clicar
            >
              {/* Substitui o ícone pela foto do usuário ou mantém um ícone padrão caso não haja imagem */}
              {profileImageUrl ? (
                <Image
                  source={{ uri: profileImageUrl }} // Usa a URL da imagem
                  style={styles.userImage} // Estilo da imagem do usuário
                />
              ) : (
                <MaterialCommunityIcons name="account" color="#ffffff" size={30} /> // Ícone padrão caso não haja imagem
              )}
            </TouchableOpacity>
          }
          contentStyle={styles.menuContent} // Adiciona estilos personalizados ao menu
        >
          {/* Opção de editar perfil com ícone */}
          <Menu.Item 
            onPress={() => {
              closeMenu();
              navigation.navigate('Profile');
            }} 
            title="Editar Perfil"
            icon="account-edit" // Nome direto do ícone, usando o MaterialCommunityIcons
          />
          <Divider />
          {/* Opção de sair com ícone */}
          <Menu.Item 
            onPress={() => {
              closeMenu();
              navigation.navigate('Welcome');
            }} 
            title="Sair"
            icon="logout" // Nome direto do ícone, usando o MaterialCommunityIcons
          />
        </Menu>
      </View>
    </Provider>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        <Stack.Screen name="Splash" component={SplashScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ChatScreen" component={ChatScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={({ navigation }) => ({
            headerTitle: () => <Navbar navigation={navigation} />,
            headerStyle: { backgroundColor: '#8a0b07' },
            headerTitleAlign: 'center',
          })}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            title: 'Meu Perfil',
            headerStyle: { backgroundColor: '#8a0b07' },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transparent";
  
  return (
    <Tab.Navigator
      barStyle={{ backgroundColor: '#8a0b07' }}
      activeColor="black"
      inactiveColor="#ffffff"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: 'Página Inicial',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          title: 'Pesquisar',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Community"
        component={CommunityScreen}
        options={{
          title: 'Comunidade',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="account-group" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="SearchChatScreen"
        component={SearchChatScreen}
        options={{
          title: 'Mensagens',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="android-messages" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

// Estilos da Navbar
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Centraliza o conteúdo horizontalmente
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#8a0b07',
  },
  profileButton: {
    padding: 10,
    position: "relative",
    alignItems: "center", // Centraliza a imagem horizontalmente
  },
  userImage: {
    width: 40, // Largura do avatar
    height: 40, // Altura do avatar
    borderRadius: 20, // Faz a imagem ficar redonda
  },
  menuContent: {
    marginLeft: -90, // Ajusta a margem para evitar que o menu fique muito no canto
    marginTop: 10,   // Ajusta a margem superior para garantir espaço entre a imagem e o menu
  },
});
