import { Image, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Fonts from "../../../utils/Fonts";
import { TextInput } from 'react-native-gesture-handler'

export default function Recuperarsenha() {
    return (

        <View style={styles.container}>
            <View style={styles.containlogo}>
                <Image source={require('../../../../../assets/img/logoroxa.png')} style={styles.logo} />
            </View>

            <View>
                <Text style={styles.titulo}>Recuperar senha</Text>
            </View>

            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
            />
        </View>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: '#FFF7ED',
        paddingHorizontal: 20,
        gap: 0,

    },

    containlogo: {
        alignItems: 'center',
    },


    logo: {
        width: 250,
        height: 250,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
    },

    titulo:{
        fontFamily:Fonts["poppins-black"],
        fontSize:20,
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



})