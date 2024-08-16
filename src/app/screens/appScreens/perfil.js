import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Alert, Modal, Button } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';


export default function Perfil({ navigation }) {

    const [nomeUser, setNomeUser] = useState('');
    const [image, setImage] = useState(null);
    const [emailUser, setEmailUser] = useState('');
    const [userDoc, setUserDoc] = useState(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = doc(db, "Users", user.uid);
                const unsubscribe = onSnapshot(userDoc, (doc) => {
                    if (doc.exists()) {
                        const userData = doc.data();
                        setNomeUser(userData.nome);
                        setEmailUser(userData.email);
                        setImage(userData.imageURL);
                    } else {
                        console.log("No such document!");
                    }
                });
                setUserDoc(userDoc);
                return () => unsubscribe();
            }
        };

        fetchUserData();
    }, []);

    const saveImageURLToFirestore = async (userId, imageURL) => {
        try {
          const userRef = doc(db, 'Users', userId);
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            await updateDoc(userRef, {
              imageURL: imageURL
            });
          } else {
            await setDoc(userRef, {
              imageURL: imageURL
            });
          }
          console.log('URL da imagem salva com sucesso no Firestore.');
        } catch (error) {
          console.error('Erro ao salvar a URL da imagem no Firestore:', error);
        }
      };

      const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
        console.log(result);
        if (!result.canceled) {
          setImage(result.assets[0].uri);
          const userId = auth.currentUser.uid;
          await saveImageURLToFirestore(userId, result.assets[0].uri);
        }
      };
    
      const handleLogout = () => {
        signOut(auth)
          .then(() => {
            // Usuário desconectado com sucesso
            Alert.alert("Você foi desconectado com sucesso.");
            navigation.navigate('Login'); // Redireciona para a tela de login ou qualquer outra tela desejada
          })
          .catch((error) => {
            // Ocorreu um erro ao tentar sair
            console.error("Erro ao sair:", error);
            Alert.alert("Erro ao sair. Tente novamente.");
          });
      };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar..."
                />
                <TouchableOpacity style={styles.favoritesButton} >
                    <AntDesign name="hearto" size={30} color="#fff" style={{ marginTop: 35 }} />
                </TouchableOpacity>
            </View>

            <Text style={styles.title}>Perfil</Text>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickImage}>
                {image ? (
                <Image source={{ uri: image }} style={styles.profileImage} />
              ) : ( 
                <Image source={require('../../../../assets/img/default-profile.jpg')} style={styles.profileImage} />
              )}
                </TouchableOpacity>
                <View style={styles.profileDetails}>
                    <Text style={styles.userName}>{nomeUser}</Text>
                    <TouchableOpacity >
                        <Feather name="edit" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="person-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Informações Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="paw-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Meus Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                    <Ionicons name="exit-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Sair</Text>
                </TouchableOpacity>
            </View>

         
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    topContainer: {
        width: '100%',
        height: 100,
        backgroundColor: '#593C9D',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
    },
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 15,
        marginTop: 30,
    },
    favoritesButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 20,
        marginLeft: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    settingsContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 18,
        marginLeft: 10,
    },
    searchResult: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#593C9D',
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
    },
});
