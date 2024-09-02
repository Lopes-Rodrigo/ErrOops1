import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');

  const handleSearch = () => {
    // Função para lidar com a pesquisa
    console.log('Searching for:', searchText);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Qual seu erro?</Text>
      <View style={styles.suggestions}>
        <TouchableOpacity style={styles.suggestionButton}>
          <Text style={styles.suggestionButtonText}>Erro de superação de stack</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionButton}>
          <Text style={styles.suggestionButtonText}>Erro de compilação JSX</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.suggestionButton}>
          <Text style={styles.suggestionButtonText}>Erro de dependência não encontrada</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Digite o erro que deseja procurar..."
        placeholderTextColor="#8a0b07"
        value={searchText}
        onChangeText={setSearchText}
      />
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Buscar</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  message: {
    fontSize: 18,
    color: '#333',
    marginBottom: 16,
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 8,
    marginBottom: 16,
  },
  searchButton: {
    backgroundColor: '#8a0b07',
    padding: 10,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  suggestions: {
    marginBottom: 16,
  },
  suggestionButton: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    marginBottom: 8,
  },
  suggestionButtonText: {
    color: '#333',
  },
});

export default SearchScreen;
