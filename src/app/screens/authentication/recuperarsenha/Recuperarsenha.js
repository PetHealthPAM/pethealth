import { Image, Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../../config/firebaseConfig";
import { useNavigation } from "@react-navigation/native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Fonts from "../../../utils/Fonts";

export default function ReplacePass({ navigation }) {
    const [userMail, setUserMail] = useState('');
    const router = useNavigation();
    

    function replacePass() {
        if (userMail !== '') {
            sendPasswordResetEmail(auth, userMail)
                .then(() => {
                    alert("Foi enviado um email para: " + userMail + ". Verifique a sua caixa de email.");
                    navigation.navigate('Login');
                })
                .catch((error) => {
                    const errorMessage = error.message;
                    alert("Ops! Alguma cois não deu certo. " + errorMessage + ". Tente novamente ou pressione voltar");
                    return;
                });
        } else {
            alert("É preciso informar um e-mail válido para efetuar a redefinição de senha");
            return;
        }

        
    }

    return (
        <View style={styles.container}>

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
                <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.displayrow} >
                <Image source={require('../../../../../assets/img/arrow.png')} style={styles.arrow} />
                <Text style={styles.txtvoltar}>Voltar</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

export const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFF7ED',
        paddingVertical:'40%',
        paddingHorizontal:20,
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
        marginBottom:40,
    },

    containtitulo:{
        alignItems:'baseline'
    },

    formTitle: {
        fontSize: 22,
        fontFamily:Fonts["poppins-black"],
        color: '#454545',
        
        
    },
    formInput: {
        borderColor: '#454545',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor:"#fff",
        fontSize: 20,
        width: '100%',
        paddingHorizontal: 20,
        paddingVertical:14,
    },
    subContainer: {
        flexDirection: 'row',
        paddingTop:10,
    },
    sendButton: {
        backgroundColor: '#7E57C2',
        width: '100%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop:20,
    },
    textButton: {
        color: 'white',
        fontSize: 20,
        fontFamily:Fonts["poppins-bold"],
        
    },

    txtvoltar:{
        fontFamily:Fonts['poppins-bold'],
        fontSize:16,
        color:"#7E57C2",
    },

    arrow:{
        height:16,
        width:16,
        marginRight:6,
        marginTop:4,
    } ,
    
    displayrow:{
        flexDirection: 'row',
    },
});