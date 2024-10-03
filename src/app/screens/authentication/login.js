import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Fonts from "../../utils/Fonts";
import { useNavigation } from "@react-navigation/native";
import Icon from 'react-native-vector-icons/MaterialIcons'; 

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigation = useNavigation();

  const handleLogin = () => {
    setLoading(true); 
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false); 
        if (user.emailVerified) {
          console.log(user);
          setEmail("");
          setSenha("");
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabBar' }], 
          });
        } else {
          Alert.alert("Email ainda não verificado!");
        }
      })
      .catch((error) => {
        setLoading(false); 
        const errorMessage = error.message;
        Alert.alert("Erro", errorMessage);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>

        <TouchableOpacity onPress={() => navigation.navigate("Inicial")}>
          <View style={styles.containervoltar}>
            <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
            <Text style={styles.txtvoltar}> Voltar </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.containlogo}>
          <Image source={require('../../../../assets/img/logoroxa.png')} style={styles.logo} />
        </View>
        <View style={styles.containtxt}>
          <Text style={styles.title}>Fazer Login</Text>
        </View>
        <TextInput
          style={styles.input}
          placeholder="Email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        <View style={styles.passwordContainer}>
          <TextInput
            style={styles.input}
            placeholder="Senha"
            secureTextEntry={!showPassword}
            value={senha}
            onChangeText={setSenha}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setShowPassword(!showPassword)}
          >
            <Icon name={showPassword ? "visibility" : "visibility-off"} size={24} color="#7E57C2" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={() => navigation.navigate("Recuperarsenha")}>
          <Text style={styles.recsenha}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <Text style={styles.orText}>――  OU  ――</Text>
        </View>

        <View style={styles.contGoogle}>
          <TouchableOpacity style={styles.googleButton}>
            <Image source={require("../../../../assets/img/google.png")} style={styles.logogoogle} />
            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.containlogo}>
          <TouchableOpacity onPress={() => navigation.navigate("Cadastro")}>
            <Text style={styles.titulo}>Ainda não possui conta?</Text>
            <Text style={styles.link}>Cadastre-se aqui!</Text>
          </TouchableOpacity>
        </View>
      </View>

      {
        loading && (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="large" color="#7E57C2" />
          </View>
        )
      }
    </ScrollView >
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
  },
  container: {
    paddingHorizontal: 20,
  },

  BNTvoltar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginLeft: 10,
    marginTop: 30,
  },
  
  containlogo: {
    alignItems: 'center',
    paddingBottom:25,
  },

  txtvoltar: {
    fontFamily: Fonts['poppins-black'],
    fontSize: 16,
    color: '#7E57C2',
  },

  title: {
    fontSize: 24,
    fontFamily: Fonts['poppins-black'],
    marginBottom: 5,
  },
  logo: {
    width: 220,
    height: 120,
    resizeMode: 'contain',
    alignItems: 'center',
  },
  input: {
    width: "auto",
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    fontFamily: Fonts["poppins-regular"],
  },
  passwordContainer: {
    position: 'relative',
    fontFamily: Fonts["poppins-regular"],
  },
  eyeIcon: {
    position: 'absolute',
    right: 10,
    top: 15,
  },
  recsenha: {
    color: '#7E57C2',
    fontFamily: Fonts["poppins-regular"],
  },
  button: {
    height: 50,
    backgroundColor: '#7E57C2',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 20,
  },
  titulo: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: Fonts["poppins-regular"],
  },
  link: {
    color: '#7E57C2',
    textDecorationLine: 'underline',
    marginLeft: 37,
    marginTop: 5,
    fontSize: 16,
    marginBottom: 30,
    fontFamily: Fonts["poppins-regular"],
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  orContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  orText: {
    fontSize: 18,
    color: '#7E57C2',
    fontFamily: Fonts["poppins-bold"],
  },
  cadastroText: {
    marginTop: 20,
    color: '#7E57C2',
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
    fontFamily: Fonts["poppins-bold"],
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
