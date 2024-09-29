import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { MaterialCommunityIcons } from 'react-native-vector-icons';

import SplashScreen from '../screens/SplashScreen'; // Adicionando a SplashScreen
import HomeScreen from '../screens/HomeScreen';
import ChatScreen from '../screens/ChatScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

// Componente da Navbar superior com botão de perfil no canto direito
function Navbar({ navigation }) {
  return (
    <View style={styles.navbar}>
      {/* Logo */}
      <Image
        source={{ uri: 'https://your-logo-url.com/logo.png' }} // Substitua pela URL real do seu logo
        style={styles.logo}
      />

      {/* Botão de perfil no canto direito */}
      <TouchableOpacity style={styles.profileButton} onPress={() => navigation.navigate('Profile')}>
        <MaterialCommunityIcons name="account" color="#ffffff" size={30} />
      </TouchableOpacity>
    </View>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Splash">
        {/* Tela de Splash com animação */}
        <Stack.Screen
          name="Splash"
          component={SplashScreen}
          options={{ headerShown: false }}
        />

        {/* Tela de Boas-vindas */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
        
        {/* Telas de Autenticação */}
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />

        {/* Telas com a Navbar superior */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={({ navigation }) => ({
            headerTitle: () => <Navbar navigation={navigation} />,
            headerStyle: { backgroundColor: '#8a0b07' }, // Cor de fundo da Navbar
            headerTitleAlign: 'center', // Centraliza o conteúdo na Navbar
          })}
        />

        {/* Tela de Perfil */}
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

// TabNavigator contendo as páginas principais do app
function TabNavigator() {
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
        name="Messages"
        component={ChatScreen}
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

// Estilos para a Navbar
const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    height: 60,
    backgroundColor: '#8a0b07',
  },
  logo: {
    width: 100,
    height: 40,
    resizeMode: 'contain',
  },
  profileButton: {
    padding: 10,
  },
});
