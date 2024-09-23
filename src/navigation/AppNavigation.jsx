import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useTheme } from 'react-native-paper';

// Telas de navegação por abas
import HomeScreen from '../screens/HomeScreen';
import ErrorExamplesScreen from '../screens/ErrorExamplesScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';

// Telas de autenticação
import WelcomeScreen from '../screens/WelcomeScreen';
import RegisterScreen from '../screens/RegisterScreen';
import LoginScreen from '../screens/LoginScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        {/* Telas de Autenticação */}
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{ headerShown: false }}
        />
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
        
        {/* Telas com Navegação em Abas */}
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ headerShown: false }}
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
      barStyle={{ backgroundColor: '#8a0b07' }} // Cor de fundo da barra
      activeColor="black" // Cor dos ícones ativos
      inactiveColor="#ffffff" // Cor dos ícones inativos
      shifting={false} // Controle do rótulo dos ícones
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
        name="ErrorExamples"
        component={ErrorExamplesScreen}
        options={{
          title: 'Exemplos',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="information" color={color} size={26} />
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
    </Tab.Navigator>
  );
}
