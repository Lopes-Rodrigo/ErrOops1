import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { auth, db } from '../config/firebase'; 

const SearchScreen = () => {
  const [searchText, setSearchText] = useState('');
  const [searchResults, setSearchResults] = useState(null); 

  const handleSearch = async () => {
    try {
      const errorsCollectionRef = collection(db, 'errors'); // Verifique se 'errors' está correto
      const q = query(errorsCollectionRef, where('errorMessage', '==', searchText)); // Verifique se 'errorMessage' está correto

      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        console.log('Nenhum resultado encontrado.');
        setSearchResults(null); 
        return;
      }

      const results = querySnapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id,
      }));
      setSearchResults(results[0]); 

      console.log('Search results:', results);
    } catch (error) {
      console.error('Error searching for errors:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.message}>Qual seu erro?</Text>

      <View style={styles.searchArea}>
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

        {/* Exibindo o resultado da pesquisa */}
        {searchResults && (
          <View style={styles.results}>
            <Text>{searchResults.errorMessage}</Text> 
          </View>
        )}

        {/* Mostrar mensagem caso não haja resultados */}
        {!searchResults && searchText !== '' && (
          <View style={styles.results}>
            <Text>Nenhum resultado encontrado para "{searchText}".</Text>
          </View>
        )}
      </View>
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
  searchArea: {
    paddingBottom: 16,
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
  results: {
    marginTop: 16,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
  },
});

export default SearchScreen;