import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles from '../config/styles';
import { Button } from 'react-native-paper';

const HomeScreen = ({}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Bem-vindo ao ErrOops</Text>
      <Button
        onPress={() => {
          navigation.navigate("LoginScreen");
        }}
        mode="contained"
      >
        Login
      </Button>
    </View>
  );
};

export default HomeScreen;
