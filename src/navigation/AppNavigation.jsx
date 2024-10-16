import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { Menu, Divider, Provider, useTheme } from 'react-native-paper';
import { Image } from 'expo-image'; // Importa expo-image
import { getAuth } from 'firebase/auth'; // Assumindo que Firebase Auth está configurado
import { getFirestore, doc, getDoc } from 'firebase/firestore'; // Para acessar Firestore

import UserAdminScreen from '../screens/UserAdminScreen';
import ControleErroScreen from '../screens/ControleErroScreen';
import ControleComuScreen from '../screens/ControleComuScreen';
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
import AdminScreen from '../screens/PainelAdmScreen';
import EmpresaScreen from '../screens/EmpresaScreen';
import PostagemScreen from '../screens/PostagemScreen';

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
      const userSnap = await getDoc(userDoc); // Obtém os dados do Firestore
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
              navigation.navigate('Splash');
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
        <Stack.Screen name="PainelAdm" component={AdminScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ControleErroScreen" component={ControleErroScreen} options={{ headerShown: false }} />
        <Stack.Screen name="ControleComuScreen" component={ControleComuScreen} options={{ headerShown: false }} />
        <Stack.Screen name="UserAdminScreen" component={UserAdminScreen} options={{ headerShown: false }} />
        <Stack.Screen name="SearchChatScreen" component={SearchChatScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PostagemScreen" component={PostagemScreen} options={{ headerShown: false }} />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={({ navigation }) => ({
            headerTitle: () => <Navbar navigation={navigation} />,
            headerStyle: { backgroundColor: '#8a0b07' },
            headerTitleAlign: 'center',
            headerLeft: null,
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
        name="EmpresaScreen"
        component={EmpresaScreen}
        options={{
          title: 'Empresas',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="briefcase-eye" color={color} size={26} />
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
    justifyContent: 'space-between', // Espaça os elementos da barra de navegação
    alignItems: 'center', // Alinha verticalmente os itens no centro
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#8a0b07',
  },
  profileButton: {
    padding: 10,
    flexDirection: 'row',
    alignSelf:'flex-end',
    marginLeft: 'auto', // Faz o botão de perfil ir para a direita
  },
  userImage: {
    width: 40, // Define a largura da imagem do usuário
    height: 40, // Define a altura da imagem do usuário
    borderRadius: 20, // Faz a imagem ficar redonda
  },
  menuContent: {
    marginLeft: Dimensions.get('window').width * 0.4, // Responsivo para ajustar margem lateral
    marginTop: 35,
  },
});
