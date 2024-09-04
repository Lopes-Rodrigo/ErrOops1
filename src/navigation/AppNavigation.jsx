import React from 'react';
import { NavigationContainer } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import ErrorExamplesScreen from '../screens/ErrorExamplesScreen';
import SearchScreen from '../screens/SearchScreen';
import CommunityScreen from '../screens/CommunityScreen';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';




const Stack = createNativeStackNavigator();
const Tab = createMaterialBottomTabNavigator();

export default function AppNavigator(){
  return(
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
        name="TabNavigator"
        component={TabNavigator}
        options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}




function TabNavigator() {
  return (
    
      <Tab.Navigator>
        <Tab.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ 
            title: 'Página Inicial',
            tabBarIcon: "home",
          }} 
        />

        <Tab.Screen 
          name="ErrorExamples" 
          component={ErrorExamplesScreen} 
          options={{ 
            title: 'Exemplos de Erros',
            tabBarIcon: "information",
          }} 
        />

        <Tab.Screen 
          name="Search" 
          component={SearchScreen} 
          options={{ 
            title: 'Pesquisar',
            tabBarIcon: "search",
          }} 
        />

        <Tab.Screen 
          name="Community" 
          component={CommunityScreen} 
          options={{ 
            title: 'Comunidade',
            tabBarIcon: "community",
          }} 
        />

      </Tab.Navigator>
    
  );
}

