import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import ErrorExamplesScreen from './src/screens/ErrorExamplesScreen';
import SearchScreen from './src/screens/SearchScreen';
import CommunityScreen from './src/screens/CommunityScreen';
import LoginScreen from './src/screens/LoginScreen';
import SignupScreen from './src/screens/SignupScreen';


const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'Página Inicial' }} />
        <Stack.Screen name="ErrorExamples" component={ErrorExamplesScreen} options={{ title: 'Exemplos de Erros' }} />
        <Stack.Screen name="Search" component={SearchScreen} options={{ title: 'Pesquisar' }} />
        <Stack.Screen name="Community" component={CommunityScreen} options={{ title: 'Comunidade' }} />
        <Stack.Screen name="Login" component={LoginScreen} options={{ title: 'Login' }} />
        <Stack.Screen name="Signup" component={SignupScreen} options={{ title: 'Cadastro' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
