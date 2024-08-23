import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ActivityIndicator,
} from "react-native";
import Fonts from "../../utils/Fonts";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Importa a biblioteca de ícones

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [csenha, setCsenha] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSenha, setShowSenha] = useState(false); // Estado para mostrar/ocultar a senha
  const [showCsenha, setShowCsenha] = useState(false); // Estado para mostrar/ocultar a confirmação de senha

  const handleCadastro = () => {
    if (senha !== csenha) {
      Alert.alert("As senhas não coincidem.");
      return;
    }

    setLoading(true);

    createUserWithEmailAndPassword(auth, email, senha)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;

        await setDoc(doc(db, "Users", userId), {
          nome: nome,
          email: email,
          senha: senha,
        });

        setNome('');
        setEmail('');
        setSenha('');
        setCsenha('');

        sendEmailVerification(user)
          .then(() => {
            setLoading(false);
            Toast.show({
              type: 'success',
              text1: 'Verifique seu Email',
              text2: 'Por favor verifique seu email para poder continuar!',
            });
          })
          .catch((error) => {
            setLoading(false);
            const errorMessage = error.message;
            console.error("Erro ao enviar e-mail de verificação:", error);
            Toast.show({
              type: 'error',
              text1: 'Erro',
              text2: errorMessage,
            });
          });

        navigation.navigate('Login');
      })
      .catch((error) => {
        setLoading(false);
        const errorMessage = error.message;
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: errorMessage,
        });
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.navigate("Inicial")}>
        <View style={styles.containervoltar}>
          <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
          <Text style={styles.txtvoltar}> Voltar </Text>
        </View>
      </TouchableOpacity>

      <View style={styles.containerlogo}>
        <Image source={require("../../../../assets/img/logoroxa.png")} style={styles.logo} />
      </View>
      <View style={styles.title}>
        <Text style={styles.title}>Cadastrar-se</Text>
      </View>
      <View>
        <TextInput
          style={styles.input}
          placeholder="Nome e Sobrenome"
          keyboardType="default"
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!showSenha}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowSenha(!showSenha)}
          >
            <Icon name={showSenha ? "visibility" : "visibility-off"} size={24} color="#7E57C2" />
          </TouchableOpacity>
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            secureTextEntry={!showCsenha}
            value={csenha}
            onChangeText={setCsenha}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowCsenha(!showCsenha)}
          >
            <Icon name={showCsenha ? "visibility" : "visibility-off"} size={24} color="#7E57C2" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttom_contain}>
        <TouchableOpacity style={styles.button} onPress={handleCadastro} disabled={loading}>
          <Text style={styles.buttonText}>Cadastrar</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.orContainer}>
        <Text style={styles.orText}>OU</Text>
      </View>
      <View style={styles.contGoogle}>
        <TouchableOpacity style={styles.googleButton}>
          <Image
            source={require("../../../../assets/img/google.png")}
            style={styles.logogoogle}
          />
          <Text style={styles.googleButtonText}>Entrar com Google</Text>
        </TouchableOpacity>
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7E57C2" />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    backgroundColor: "#FFF7ED"
  },
 
  inputContainer: {
    position: 'relative',
    marginBottom: 10,
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },

  imgvoltar: {
    height: 30,
    width: 30,
    resizeMode: 'contain',
    
  },

  BNTvoltar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: 10,
  },

  txtvoltar: {
    fontFamily: Fonts['poppins-black'],
    fontSize: 16,
    color: '#7E57C2',
    marginTop: 5,
    textAlign: 'left',
  },

  containervoltar: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
  },

  containerlogo: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },

  title: {
    fontSize: 22,
    fontFamily: Fonts['poppins-black'],
    marginBottom: 5,
    alignItems: "baseline",
  },

  logo: {
    width: 220,
    height: 120,
    resizeMode: "contain",
    marginBottom: 25,
  },

  input: {
    width: 'auto',
    height: 50,
    borderWidth: 1,
    borderColor: "#B5B5B5",
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },

  button: {
    width: "100%",
    height: 50,
    backgroundColor: "#7E57C2",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginTop: 15,
  },

  buttom_contain: {
    justifyContent: "center",
    alignItems: "center",
  },

  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: Fonts["poppins-regular"],
  },

  orContainer: {
    marginVertical: 10,
    justifyContent: "center",
    alignItems: "center",
    
  },

  orText: {
    fontSize: 18,
    color: "#7E57C2",
    fontFamily: Fonts["poppins-bold"],
  },

  contGoogle: {
    justifyContent: "center",
    alignItems: "center",
  },

  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    borderColor: "#424242",
    borderWidth: 1,
    width: 240,
  },

  googleButtonText: {
    color: "#000",
    fontSize: 18,
    marginLeft: 10,
    fontFamily: Fonts['poppins-black'],
  },

  logogoogle: {
    height: 30,
    width: 30,
  },

  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
