import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, Alert, ActivityIndicator } from 'react-native';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db, auth } from "../../config/firebaseConfig";
import Fonts from "../../utils/Fonts";

const Pets = ({ navigation }) => {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true); 

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
        fontFamily: Fonts["poppins-regular"],
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
});

export default Pets;
