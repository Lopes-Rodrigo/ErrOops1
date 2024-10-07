import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useTheme } from 'react-native-paper';
import { Image } from 'expo-image'; // Importa expo-image

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
  return (
    <View style={styles.navbar}>
      {/* Logo centralizado */}
      <Image
        source={require('../../assets/ErrOops.png')} // Substitua pelo caminho do seu logo
        style={styles.logo}
        contentFit="contain"
        transition={1000} // Transição suave para carregar a imagem
      />

      {/* Botão de perfil à direita */}
      <TouchableOpacity
        style={styles.profileButton}
        onPress={() => navigation.navigate('Profile')}
      >
        <MaterialCommunityIcons name="account" color="#ffffff" size={30} />
      </TouchableOpacity>
    </View>
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
    justifyContent: 'space-between',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#8a0b07',
  },
  logo: {
    flex: 1, // Faz o logo ocupar o espaço restante
    height: 40,
    resizeMode: 'contain',
    alignSelf: 'center', // Centraliza o logo verticalmente
  },
  profileButton: {
    padding: 10,
    position: "relative",
    alignItems: "flex-end",
  },
});
