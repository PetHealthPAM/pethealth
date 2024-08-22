import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, Alert, Modal, Button, ScrollView } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { auth, db } from '../../config/firebaseConfig';
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

export default function Perfil({ navigation }) {
    const [nomeUser, setNomeUser] = useState('');
    const [image, setImage] = useState(null);
    const [emailUser, setEmailUser] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [gender, setGender] = useState('');
    const [userDoc, setUserDoc] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);

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
                        setPhone(userData.phone || '');
                        setAddress(userData.address || '');
                        setCity(userData.city || '');
                        setState(userData.state || '');
                        setGender(userData.gender || '');
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

    const saveUserInfo = async () => {
        try {
            await updateDoc(userDoc, {
                nome: nomeUser,
                email: emailUser,
                phone,
                address,
                city,
                state,
                gender
            });
            Alert.alert("Informações atualizadas com sucesso!");
            setModalVisible(false);
        } catch (error) {
            console.error("Erro ao atualizar informações:", error);
            Alert.alert("Erro ao atualizar informações. Tente novamente.");
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

    const handleLogout = () => {
        signOut(auth)
            .then(() => {
                Alert.alert("Você foi desconectado com sucesso.");
                navigation.navigate('Login');
            })
            .catch((error) => {
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
                <TouchableOpacity style={styles.favoritesButton}>
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
                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                        <Feather name="edit" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="paw-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Meus Pets</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
                    <Ionicons name="exit-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Sair</Text>
                </TouchableOpacity>
                <View style={styles.separator} />
            </View>

            {/* Modal para edição das informações pessoais */}
            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalContainer}>
                    <ScrollView style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Informações</Text>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Nome</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Nome"
                                value={nomeUser}
                                onChangeText={setNomeUser}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>E-mail</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="E-mail"
                                value={emailUser}
                                onChangeText={setEmailUser}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Telefone</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Telefone"
                                value={phone}
                                onChangeText={setPhone}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Endereço</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Endereço"
                                value={address}
                                onChangeText={setAddress}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Cidade</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Cidade"
                                value={city}
                                onChangeText={setCity}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Estado</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Estado"
                                value={state}
                                onChangeText={setState}
                            />
                        </View>
                        <View style={styles.formGroup}>
                            <Text style={styles.formLabel}>Sexo</Text>
                            <TextInput
                                style={styles.modalInput}
                                placeholder="Sexo"
                                value={gender}
                                onChangeText={setGender}
                            />
                        </View>
                        <View style={styles.modalButtons}>
                            <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#ccc" />
                            <Button title="Salvar" onPress={saveUserInfo} color="#593C9D" />
                        </View>
                    </ScrollView>
                </View>
            </Modal>
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
        marginTop: 25,
    },
    favoritesButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginVertical: 20,
        color: '#593C9D',
    },
    profileContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 120,
        height: 120,
        borderRadius: 60,
        borderWidth: 3,
        borderColor: '#593C9D',
        marginBottom: 10,
    },
    profileDetails: {
        alignItems: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    settingsContainer: {
        marginHorizontal: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
    },
    settingText: {
        fontSize: 18,
        marginLeft: 15,
    },
    separator: {
        height: 1,
        backgroundColor: '#ddd',
        marginVertical: 10,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 20,
        maxHeight: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
    },
    formGroup: {
        marginBottom: 15,
    },
    formLabel: {
        fontSize: 16,
        marginBottom: 5,
    },
    modalInput: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        marginBottom: 40,
    },
});
