import { StyleSheet, View } from "react-native";
import {Button, Surface, Text, TextInput, Modal, Portal} from "react-native-paper";
import { useState } from "react";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
 
export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [repetirSenha, setRepetirSenha] = useState("");
  const [nome, setNome] = useState("");
  const [erro, setErro] = useState({
    email: false,
    senha: false,
    repetirSenha: false,
    nome: false,
  });
 
  const [visible, setVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
 
  const showModal = () => setVisible(true);
  const hideModal = () => setVisible(false);
 
  function realizaRegistro() {
    console.log("Fazer Registro");
 
    if (nome === "") {
      setErro({ ...erro, nome: true });
      setErrorMessage("Nome é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, nome: false });
 
    if (email === "") {
      setErro({ ...erro, email: true });
      setErrorMessage("Email é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, email: false });
 
    if (senha === "") {
      setErro({ ...erro, senha: true });
      setErrorMessage("Senha é obrigatória.");
      showModal();
      return;
    }
    setErro({ ...erro, senha: false });
 
    if (repetirSenha === "") {
      setErro({ ...erro, repetirSenha: true });
      setErrorMessage("Repetir senha é obrigatório.");
      showModal();
      return;
    }
    setErro({ ...erro, repetirSenha: false });
 
    if (senha !== repetirSenha) {
      setErro({ ...erro, senha: true, repetirSenha: true });
      setErrorMessage("As senhas não coincidem.");
      showModal();
      return;
    }
    setErro({ ...erro, senha: false, repetirSenha: false });
 
    cadastrarNoFirebase();
  }
 
 
  async function cadastrarNoFirebase() {
    try {
     
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        senha
      );
     
      const user = userCredential.user;
 
      console.log("Usuário cadastrado", user);
 
     
      const collectionRef = collection(db, "usuarios");
 
     
      await setDoc(
        doc(
          collectionRef,
          user.uid
        ),
        {
          nome: nome,
          email: email,
        }
      );
 
     
      navigation.navigate("LoginScreen");
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        setErrorMessage("Email já está cadastrado.");
      } else {
        setErrorMessage("Erro ao cadastrar usuário: " + error.message);
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
        <Text variant="headlineSmall">Faça seu Registro</Text>
        <TextInput
          placeholder="Digite seu nome"
          value={nome}
          onChangeText={setNome}
          style={styles.input}
          error={erro.nome}
        />
        <TextInput
          placeholder="Digite seu email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          error={erro.email}
        />
        <TextInput
          placeholder="Digite sua senha"
          value={senha}
          onChangeText={setSenha}
          secureTextEntry
          style={styles.input}
          error={erro.senha}
        />
        <TextInput
          placeholder="Repita sua senha"
          value={repetirSenha}
          onChangeText={setRepetirSenha}
          secureTextEntry
          style={styles.input}
          error={erro.repetirSenha}
        />
        </View>
        <Button onPress={realizaRegistro} mode="outlined">
          Registrar
        </Button>
        <Button onPress={() => navigation.navigate("LoginScreen")}>
          Voltar ao login
        </Button>
      
    </Surface>
  );}
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
  input: {
    marginBottom: 10,
  },
  })