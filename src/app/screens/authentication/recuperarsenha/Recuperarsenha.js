import React, { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, TouchableOpacity } from 'react-native';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../../../config/firebaseConfig';
import Fonts from '../../../utils/Fonts';

export default function ReplacePass({ navigation }) {
    const [userMail, setUserMail] = useState('');
    const [loading, setLoading] = useState(false);

    function replacePass() {
        if (userMail !== '') {
            setLoading(true); // Mostra a tela de carregamento
            sendPasswordResetEmail(auth, userMail)
                .then(() => {
                    setLoading(false); // Oculta a tela de carregamento
                    alert("Foi enviado um email para: " + userMail + ". Verifique a sua caixa de email.");
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    setLoading(false); // Oculta a tela de carregamento
                    const errorMessage = error.message;
                    alert("Ops! Alguma coisa não deu certo. " + errorMessage + ". Tente novamente ou pressione voltar");
                });
        } else {
            alert("É preciso informar um e-mail válido para efetuar a redefinição de senha");
        }
    }

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#7E57C2" />
                    <Text style={styles.loadingText}>Enviando email de redefinição...</Text>
                </View>
            ) : (
                <>
                    <View style={styles.containlogo}>
                        <Image source={require('../../../../../assets/img/logoroxa.png')} style={styles.logo} />
                    </View>

                    <View style={styles.containtitulo}>
                        <Text style={styles.formTitle}>Redefinir sua senha</Text>
                    </View>

                    <TextInput
                        style={styles.formInput}
                        placeholder="Informe o email"
                        keyboardType="email-address"
                        autoCapitalize="none"
                        autoComplete="email"
                        value={userMail}
                        onChangeText={setUserMail}
                    />
                    <Pressable
                        style={styles.sendButton}
                        onPress={replacePass}
                    >
                        <Text style={styles.textButton}>Enviar</Text>
                    </Pressable>
                    <View style={styles.subContainer}>
                        <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.displayrow}>
                            <Image source={require('../../../../../assets/img/arrow.png')} style={styles.arrow} />
                            <Text style={styles.txtvoltar}>Voltar</Text>
                        </TouchableOpacity>
                    </View>
                </>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7ED',
        paddingVertical: '40%',
        paddingHorizontal: 20,
    },
    containlogo: {
        alignItems: 'center',
    },
    logo: {
        width: 250,
        height: 180,
        resizeMode: 'contain',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 40,
    },
    containtitulo: {
        alignItems: 'baseline',
    },
    formTitle: {
        fontSize: 22,
        fontFamily: Fonts["poppins-black"],
        color: '#454545',
    },
    formInput: {
        borderColor: '#454545',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: "#fff",
        fontSize: 20,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical: 14,
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop: 10,
    },
    sendButton: {
        backgroundColor: '#7E57C2',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        fontFamily: Fonts["poppins-bold"],
    },
    txtvoltar: {
        fontFamily: Fonts['poppins-bold'],
        fontSize: 16,
        color: "#7E57C2",
    },
    arrow: {
        height: 16,
        width: 16,
        marginRight: 6,
        marginTop: 4,
    },
    displayrow: {
        flexDirection: 'row',
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#FFF7ED',
    },
    loadingText: {
        marginTop: 10,
        fontSize: 16,
        color: '#7E57C2',
        fontFamily: Fonts["poppins-bold"],
    },
});
