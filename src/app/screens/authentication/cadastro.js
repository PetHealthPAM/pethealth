import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import Fonts from "../../utils/Fonts";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { auth, db } from "../../config/firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import Toast from 'react-native-toast-message';

export default function Cadastro({ navigation }) {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [csenha, setCsenha] = useState("");
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento

  const handleCadastro = () => {
    if (senha !== csenha) {
      Alert.alert("As senhas não coincidem.");
      return;
    }

    setLoading(true); // Inicia o carregamento

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
            setLoading(false); // Para o carregamento
            Toast.show({
              type: 'success',
              text1: 'Verifique seu Email',
              text2: 'Por favor verifique seu email para poder continuar!',
            });
          })
          .catch((error) => {
            setLoading(false); // Para o carregamento
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
        setLoading(false); // Para o carregamento
        const errorMessage = error.message;
        Toast.show({
          type: 'error',
          text1: 'Erro',
          text2: errorMessage,
        });
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <TouchableOpacity>
          <Image style={styles.imgvoltar} source={require('../../../../assets/img/voltar.png')} />
          <Text style={styles.txtvoltar}>Voltar</Text>
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
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry
            value={senha}
            onChangeText={setSenha}
          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"
            secureTextEntry
            value={csenha}
            onChangeText={setCsenha}
          />
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
      </View>

      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color="#7E57C2" />
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    backgroundColor: "#FFF7ED",
  },

  container: {
    padding: 20,
  },
  imgvoltar:{
    height:40,
    width:40,
    resizeMode:'contain',

  },

  txtvoltar: {
    fontFamily: Fonts['poppins-black'],
    fontSize: 16,
    color: '#7E57C2',
  },

  containerlogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  containervoltar: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts['poppins-black'],
    marginBottom: 10,
    alignItems: "baseline",
  },
  logo: {
    width: 263,
    height: 126,
    resizeMode: "contain",
    marginBottom: 25,
  },
  input: {
    width: 360,
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
    marginTop: 20,
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
    marginVertical: 20,
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
    fontFamily: Fonts["poppins-regular"],
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
