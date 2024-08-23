import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, Button, Picker, TouchableOpacity } from 'react-native';
import axios from 'axios';

const API_KEY_DOG = 'sua_api_key_dog';
const API_KEY_CAT = 'sua_api_key_cat';

export default function AdicionarPet({ navigation }) {
    const [species, setSpecies] = useState('');
    const [name, setName] = useState('');
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [breeds, setBreeds] = useState([]);

    useEffect(() => {
        const fetchBreeds = async () => {
            try {
                if (species === 'cachorro') {
                    const { data } = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY_DOG}`);
                    setDogBreeds(data);
                    setBreeds(data.map(breed => ({ id: breed.id, name: breed.name })));
                } else if (species === 'gato') {
                    const { data } = await axios.get(`https://api.thecatapi.com/v1/breeds?api_key=${API_KEY_CAT}`);
                    setCatBreeds(data);
                    setBreeds(data.map(breed => ({ id: breed.id, name: breed.name })));
                }
            } catch (error) {
                console.error('Erro ao buscar raças:', error);
            }
        };

        fetchBreeds();
    }, [species]);

    const handleNext = () => {
        // Navega para a próxima tela passando as informações do pet
        navigation.navigate('ConfirmarPet', { species, name, selectedBreed });
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Espécie:</Text>
            <Picker
                selectedValue={species}
                style={styles.picker}
                onValueChange={(itemValue) => setSpecies(itemValue)}
            >
                <Picker.Item label="Selecione" value="" />
                <Picker.Item label="Cachorro" value="cachorro" />
                <Picker.Item label="Gato" value="gato" />
            </Picker>

            <Text style={styles.label}>Nome:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Nome do Pet"
            />

            {species && (
                <>
                    <Text style={styles.label}>Raça:</Text>
                    <Picker
                        selectedValue={selectedBreed}
                        style={styles.picker}
                        onValueChange={(itemValue) => setSelectedBreed(itemValue)}
                    >
                        <Picker.Item label="Selecione a raça" value="" />
                        {breeds.map(breed => (
                            <Picker.Item key={breed.id} label={breed.name} value={breed.name} />
                        ))}
                    </Picker>
                </>
            )}

            <TouchableOpacity style={styles.button} onPress={handleNext}>
                <Text style={styles.buttonText}>Próximo</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    picker: {
        height: 50,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 20,
    },
    button: {
        backgroundColor: '#593C9D',
        paddingVertical: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
    },
});
