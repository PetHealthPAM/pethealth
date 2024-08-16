import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import Fonts from '../../utils/Fonts';

export default function Inicial({navigation}) {

  return (
    <View style={styles.container}>
      <Image source={require('../../../../assets/img/logo.png')} style={styles.logo} />
      <View style={styles.miniContainer}>
        <Image source={require('../../../../assets/img/gato.png')} style={styles.gato} />
        <Text style={styles.titulo}>Amor e cuidado</Text>
        <Text style={styles.titulo2}>que seu pet merece!</Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.navigate("Cadastro")}>
          <Text style={styles.buttonText} >Cadastre-se</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate("Login")}>
          <Text style={styles.titulo3}>Já possui conta? <Text style={styles.link}>Entrar</Text></Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7E57C2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    position: 'absolute',
    top: '50%',
    transform: [{ translateY: -250 }],
    width: 250,
    height: 250,
    resizeMode: 'contain',
  },
  miniContainer: {
    position: 'absolute',
    bottom: 0,          
    height: '40%',       
    width: '100%',      
    backgroundColor: '#fff', 
    borderTopEndRadius: 50, 
    borderTopLeftRadius: 50, 
    alignItems: 'center',   
    justifyContent: 'center' 
},
  gato: {
    position: 'absolute',
    top: -85,
    right: 35,
    width: 100,
    height: 100,
    resizeMode: 'contain',
  },
  titulo: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 10,
    fontFamily: Fonts["poppins-black"]
  },
  titulo2: {
    fontWeight: 'bold',
    fontSize: 24,
    marginBottom: 20,
    fontFamily: Fonts["poppins-black"],
  },
  titulo3: {
    fontSize: 18,
    marginTop: 20,
    fontFamily: Fonts["poppins-black"]
  },
  link: {
    color: '#7E57C2',
    textDecorationLine: 'underline',
  },
  button: {
    backgroundColor: '#7E57C2',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 10,
    marginTop: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    textAlign: 'center',
    fontFamily: Fonts['poppins-bold'],
  },
});
