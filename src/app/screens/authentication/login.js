import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, Alert, ActivityIndicator } from "react-native";
import { useState } from "react";
import { auth } from "../../config/firebaseConfig";
import { signInWithEmailAndPassword } from "firebase/auth";
import Fonts from "../../utils/Fonts";
import { useNavigation } from "@react-navigation/native";

export default function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [loading, setLoading] = useState(false); // Estado para controlar o carregamento
  const navigation = useNavigation();

  const handleLogin = () => {
    setLoading(true); // Inicia o carregamento
    signInWithEmailAndPassword(auth, email, senha)
      .then((userCredential) => {
        const user = userCredential.user;
        setLoading(false); // Para o carregamento
        if (user.emailVerified) {
          console.log(user);
          setEmail("");
          setSenha("");
          navigation.reset({
            index: 0,
            routes: [{ name: 'TabBar' }], // Substitua 'TabBar' pelo nome da sua tela inicial
          });
        } else {
          Alert.alert("Email ainda não verificado!");
        }
      })
      .catch((error) => {
        setLoading(false); // Para o carregamento
        const errorMessage = error.message;
        Alert.alert("Erro", errorMessage);
      });
  };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
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
        <TextInput
          style={styles.input}
          placeholder="Senha"
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity onPress={() => navigation.navigate("Recuperarsenha")}>
          <Text style={styles.recsenha}>Esqueceu sua senha?</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        <View style={styles.orContainer}>
          <Text style={styles.orText}>OU</Text>
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
    justifyContent: 'center',
    backgroundColor: '#FFF7ED',
  },
  container: {
    padding: 20,
  },
  containlogo: {
    alignItems: 'center'
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  logo: {
    width: 250,
    height: 250,
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
    backgroundColor: '#fff'
  },
  recsenha: {
    color:'#7E57C2'
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
  },
  link: {
    color: '#7E57C2',
    textDecorationLine: 'underline',
    marginLeft: 37,
    marginTop: 5,
    fontSize: 16,
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
    fontWeight: 'bold',
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
