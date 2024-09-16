import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import {Button,Surface,Text,TextInput,Modal,Portal} from "react-native-paper";

import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../config/firebase";
 
export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState({
    email: false,
    senha: false,
  });
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
 
  function realizaLogin() {
    console.log("Fazer Login");
    if (email === "") {
      setErro({ ...erro, email: true });
      setErrorMessage("Email é obrigatório.");
      showModal();
      return;
    } else {
      setErro({ ...erro, email: false });
    }
    if (senha === "") {
      setErro({ ...erro, senha: true });
      setErrorMessage("Senha é obrigatória.");
      showModal();
      return;
    } else {
      setErro({ ...erro, senha: false });
    }
    realizaLoginNoFirebase();
  }
 
  async function realizaLoginNoFirebase() {
    try {
      const usuarioRef = await signInWithEmailAndPassword(auth, email, senha);
      console.log(usuarioRef);
     
      navigation.navigate("HomeScreen");
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        setErrorMessage("Usuário não encontrado.");
      } else if (error.code === "auth/wrong-password") {
        setErrorMessage("Senha incorreta.");
      } else {
        setErrorMessage("Erro ao fazer login: " + error.message);
      }
      showModal();
    }
  }
 
  return (
    <Surface style={styles.container}>
      <View style={styles.innerContainer}>
        {/* Modal */}
        <Portal>
          <Modal
            visible={visible}
            onDismiss={hideModal}
            contentContainerStyle={{ backgroundColor: "white", padding: 20 }}
          >
            <Text>{errorMessage}</Text>
            <Button onPress={hideModal}>Fechar</Button>
          </Modal>
        </Portal>
        {/* FIM Modal */}
        <Text
          variant="headlineMedium"
          style={{
            textAlign: "center",
            marginBottom: 20,
          }}
        >
          Faça seu Login
        </Text>
        <TextInput
          placeholder="Digite seu e-mail"
          onChangeText={setEmail}
          value={email}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Digite sua senha"
          onChangeText={setSenha}
          value={senha}
          secureTextEntry // faz com que o campo seja senha com *
          style={styles.input}
          error={erro.senha}
        />
        <View>
          <Button onPress={realizaLogin} mode="contained">
            Fazer Login
          </Button>
        </View>
        <Button onPress={() => navigation.navigate("RegisterScreen")}>
          Faça seu cadastro
        </Button>
      </View>
    </Surface>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  innerContainer:{
    paddingHorizontal: 20,
    alignSelf: "stretch",
},
})