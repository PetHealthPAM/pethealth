import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, TouchableOpacity, Alert, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { Picker as RNPicker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

// imagens
import DogImage from '../imgs/cachorro.png';
import CatImage from '../imgs/gatow.png';

export default function AdicionarPet() {
    const navigation = useNavigation();
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [breed, setBreed] = useState('');
    const [breeds, setBreeds] = useState([]);
    const [image, setImage] = useState(null);

    useEffect(() => {
        const fetchBreeds = async () => {
            if (species) {
                try {
                    const response = species === 'dog'
                        ? await axios.get('https://dog.ceo/api/breeds/list/all')
                        : await axios.get('https://api.thecatapi.com/v1/breeds');

                    const breedsData = species === 'dog'
                        ? Object.keys(response.data.message)
                        : response.data.map(breed => breed.name);

                    setBreeds(breedsData);
                } catch (error) {
                    console.error('Error fetching breeds:', error);
                }
            }
        };

        fetchBreeds();
    }, [species]);

    const handleAddPet = async () => {
        try {
            const pet = {
                id: Date.now().toString(),
                name,
                species,
                breed,
                image: species === 'dog' ? DogImage : CatImage,
            };

            const existingPets = await AsyncStorage.getItem('pets');
            const pets = existingPets ? JSON.parse(existingPets) : [];

            pets.push(pet);
            await AsyncStorage.setItem('pets', JSON.stringify(pets));

            Alert.alert('Sucesso', 'Pet cadastrado com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Error adding pet:', error);
            Alert.alert('Erro', 'Erro ao cadastrar o pet.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Adicionar Pet</Text>
            <TextInput
                style={styles.input}
                placeholder="Nome do pet"
                value={name}
                onChangeText={setName}
            />
            <Text style={styles.label}>Espécie:</Text>
            <RNPicker
                selectedValue={species}
                onValueChange={(itemValue) => {
                    setSpecies(itemValue);
                    setBreed('');
                }}
                style={styles.picker}
            >
                <RNPicker.Item label="Selecione a espécie" value="" />
                <RNPicker.Item label="Cachorro" value="dog" />
                <RNPicker.Item label="Gato" value="cat" />
            </RNPicker>
            {species && (
                <>
                    <Text style={styles.label}>Raça:</Text>
                    <RNPicker
                        selectedValue={breed}
                        onValueChange={(itemValue) => setBreed(itemValue)}
                        style={styles.picker}
                    >
                        <RNPicker.Item label="Selecione a raça" value="" />
                        {breeds.map((b, index) => (
                            <RNPicker.Item key={index} label={b} value={b} />
                        ))}
                    </RNPicker>
                </>
            )}
            <TouchableOpacity style={styles.button} onPress={handleAddPet}>
                <Text style={styles.buttonText}>Adicionar Pet</Text>
            </TouchableOpacity>
            {species && (
                <View style={styles.imageContainer}>
                    <Image source={species === 'dog' ? DogImage : CatImage} style={styles.image} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#f8f8f8',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#593C9D',
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 5,
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#593C9D',
    },
    button: {
        backgroundColor: '#593C9D',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    imageContainer: {
        marginTop: 20,
        alignItems: 'center',
    },
    image: {
        width: 100,
        height: 100,
        borderRadius: 10,
    },
});
