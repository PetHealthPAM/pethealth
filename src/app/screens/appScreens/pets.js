import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, Image, TouchableOpacity, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MeusPets() {
    const [pets, setPets] = useState([]);

    useEffect(() => {
        const loadPets = async () => {
            try {
                const storedPets = await AsyncStorage.getItem('pets');
                if (storedPets) {
                    setPets(JSON.parse(storedPets));
                }
            } catch (error) {
                console.error('Erro ao carregar os pets:', error);
            }
        };

        loadPets();
    }, []);

    const handleRemovePet = async (id) => {
        Alert.alert(
            'Confirmar Exclusão',
            'Tem certeza de que deseja remover este pet?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'OK', onPress: async () => {
                    try {
                        const updatedPets = pets.filter(pet => pet.id !== id);
                        await AsyncStorage.setItem('pets', JSON.stringify(updatedPets));
                        setPets(updatedPets);
                        Alert.alert('Sucesso', 'Pet removido com sucesso!');
                    } catch (error) {
                        console.error('Erro ao remover o pet:', error);
                        Alert.alert('Erro', 'Não foi possível remover o pet.');
                    }
                } },
            ]
        );
    };

    const renderPetItem = ({ item }) => {
        const { id, species, breed, name, image } = item;
        return (
            <View style={styles.petItem}>
                <Image source={image} style={styles.petImage} />
                <View style={styles.petDetails}>
                    <Text style={styles.petName}>{name}</Text>
                    <Text style={styles.petInfo}>Espécie: {species === 'dog' ? 'Cachorro' : 'Gato'}</Text>
                    <Text style={styles.petInfo}>Raça: {breed}</Text>
                </View>
                <TouchableOpacity style={styles.removeButton} onPress={() => handleRemovePet(id)}>
                    <Text style={styles.removeButtonText}>Remover</Text>
                </TouchableOpacity>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Meus Pets</Text>
            <FlatList
                data={pets}
                keyExtractor={(item) => item.id}
                renderItem={renderPetItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f4f4f4',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        marginTop: 50,
    },
    petItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        elevation: 1,
    },
    petImage: {
        width: 80,
        height: 80,
        borderRadius: 40,
    },
    petDetails: {
        flex: 1,
        marginLeft: 15,
    },
    petName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    petInfo: {
        fontSize: 14,
        color: '#666',
    },
    removeButton: {
        backgroundColor: '#FF4D4D',
        padding: 10,
        borderRadius: 5,
    },
    removeButtonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
});
