import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../../config/firebaseConfig";
import Fonts from "../../utils/Fonts";

const Pets = ({ navigation }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true); 
    const [selectedPet, setSelectedPet] = useState(null); 
    const [modalVisible, setModalVisible] = useState(false); 

    useEffect(() => {
        const fetchPets = async () => {
            try {
                const user = auth.currentUser;
                if (!user) {
                    console.error('Usuário não autenticado.');
                    return;
                }

                const petsRef = collection(db, 'pets');
                const querySnapshot = await getDocs(petsRef);
                const petList = querySnapshot.docs
                    .map(doc => ({ id: doc.id, ...doc.data() }))
                    .filter(pet => pet.ownerId === user.uid && !pet.isDeleted);

                setPets(petList);
            } catch (error) {
                console.error('Erro ao buscar pets:', error);
            } finally {
                setLoading(false); 
            }
        };

        fetchPets();
    }, []);

    const handleLongPress = (id) => {
        Alert.alert(
            'Excluir Pet',
            'Você tem certeza de que deseja excluir este pet?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: () => deletePet(id),
                    style: 'destructive',
                },
            ]
        );
    };

    const deletePet = async (id) => {
        try {
            await deleteDoc(doc(db, 'pets', id));
            setPets(prevPets => prevPets.filter(pet => pet.id !== id));
            Alert.alert('Sucesso', 'Pet excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir pet:', error);
            Alert.alert('Erro', 'Não foi possível excluir o pet.');
        }
    };

    const getPetImage = (species, gender) => {
        if (species === 'dog') {
            return gender === 'male'
                ? require('../../../../assets/img/cachorro.png')
                : require('../../../../assets/img/cachorrofemale.png');
        } else if (species === 'cat') {
            return gender === 'male'
                ? require('../../../../assets/img/gatow.png')
                : require('../../../../assets/img/gatofemale.png');
        }
    };

    const handlePetPress = (pet) => {
        setSelectedPet(pet); 
        setModalVisible(true); 
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedPet(null); 
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.containervoltar}>
                    <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
                    <Text style={styles.txtvoltar}>Voltar</Text>
                </View>
            </TouchableOpacity>

            <Text style={styles.title}>Meus Pets</Text>

            {loading ? (
                <View style={styles.overlay}>
                    <ActivityIndicator size="large" color="#7E57C2" />
                </View>
            ) : (
                pets.length === 0 ? (
                    <Text style={styles.noPets}>Nenhum pet encontrado.</Text>
                ) : (
                    <FlatList
                        data={pets}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <TouchableOpacity 
                                onPress={() => handlePetPress(item)} 
                                onLongPress={() => handleLongPress(item.id)} 
                                style={styles.petContainer}
                            >
                                <Image source={getPetImage(item.species, item.gender)} style={styles.petImage} />
                                <Text style={styles.petName}>{item.name}</Text>
                            </TouchableOpacity>
                        )}
                    />
                )
            )}

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={closeModal}
            >
                <View style={styles.modalBackground}>
                    <View style={styles.modalContent}>
                        {selectedPet && (
                            <>
                                <Text style={styles.modalTitle}>{selectedPet.name}</Text>
                                <Text style={styles.modalText}>Gênero: {selectedPet.gender === 'male' ? 'Macho' : 'Fêmea'}</Text>
                                <Text style={styles.modalText}>Idade: {selectedPet.age}</Text>
                                <Text style={styles.modalText}>Raça: {selectedPet.breed}</Text>
                                <TouchableOpacity
                                    style={styles.modalButton}
                                    onPress={closeModal}
                                >
                                    <Text style={styles.modalButtonText}>Fechar</Text>
                                </TouchableOpacity>
                            </>
                        )}
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f8',
    },
    containervoltar: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 5,
    },
    BNTvoltar: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        marginTop: 10,
        marginLeft: 10,
    },
    txtvoltar: {
        fontFamily: Fonts['poppins-black'],
        fontSize: 16,
        color: '#7E57C2',
        marginTop: 5,
        textAlign: 'left',
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        color: '#7E57C2',
        fontFamily: Fonts['poppins-black'],
    },
    noPets: {
        fontSize: 18,
        color: '#7E57C2',
        textAlign: 'center',
        paddingTop: '70%',
        fontFamily: Fonts['poppins-black'],
    },
    petContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#ddd',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
    },
    petImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    petName: {
        fontSize: 18,
        color: '#333',
        fontFamily: Fonts["poppins-regular"],
    },
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: '90%',
        maxWidth: 400,
        padding: 20,
        backgroundColor: '#FFFFFF',
        borderRadius: 15,
        elevation: 5, 
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts["poppins-bold"],
        color: '#593C9D',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333', 
        marginBottom: 8,
        fontFamily: Fonts["poppins-regular"],
    },
    modalButton: {
        marginTop: 20,
        paddingVertical: 12,
        backgroundColor: '#593C9D',
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Pets;
