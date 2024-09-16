import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from '../screens/HomeScreen';
import ErrorExamplesScreen from '../screens/ErrorExamplesScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { useTheme } from 'react-native-paper';
import LoginScreen from '../screens/LoginScreen'
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();





export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="TabNavigator"
          component={TabNavigator}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="LoginScreen"
          component={LoginScreen}
          options={{ title: "Login" }}
        />
        <Stack.Screen
          name="RegisterScreen"
          component={RegisterScreen}
          options={{ title: "Cadastro de usuário" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function TabNavigator() {
  const theme = useTheme();
  theme.colors.secondaryContainer = "transperent"
  return (

    <Tab.Navigator
      barStyle={{ backgroundColor: '#8a0b07' }} // Cor de fundo
      activeColor="black" // Cor dos ícones ativos
      inactiveColor="#ffffff" // Cor dos ícones inativos
      shifting={false} // Se você quiser que o rótulo apareça para todos os ícones
      
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
