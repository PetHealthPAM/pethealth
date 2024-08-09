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
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import Fonts from "../../utils/Fonts";


export default function Cadastro() {


  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.containerlogo}>
          <Image source={require("../../../../assets/img/logoroxa.png")} style={styles.logo} />
        </View>
        <View style={styles.title}>
          <Text style={styles.title}>Cadastrar-se</Text>
        </View>
        <View>

          <TextInput
            style={styles.input}
            placeholder="Email"
            keyboardType="email-address"

          />
          <TextInput
            style={styles.input}
            placeholder="Senha"


          />
          <TextInput
            style={styles.input}
            placeholder="Confirmar Senha"

          />
        </View>

        <View style={styles.buttom_contain}>
          <TouchableOpacity style={styles.button}>
            <Text style={styles.buttonText}>Cadastrar</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.orContainer}>
          <Text style={styles.orText}>OU</Text>
        </View>

        <View style={styles.contGoogle}>
          <TouchableOpacity style={styles.googleButton}>
            <Image
              source={require("../.././../../assets/img/google.png")}
              style={styles.logogoogle}
            />

            <Text style={styles.googleButtonText}>Entrar com Google</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFF7ED",
  },
  container: {
    justifyContent: "center",
    backgroundColor: "#FFF7ED",
  },

  containerlogo: {
    justifyContent: 'center',
    alignItems: 'center',
  },

  title: {
    fontSize: 24,
    fontWeight: "bold",
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
    width: 320,
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
    fontFamily:Fonts["poppins-regular"],
  },
  orContainer: {
    marginVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  orText: {
    fontSize: 18,
    color: "#7E57C2",
    fontFamily:Fonts["poppins-bold"],
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
    fontFamily:Fonts["poppins-regular"],
  },

  logogoogle: {
    height: 30,
    width: 30,
  },
});
