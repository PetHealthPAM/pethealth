import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Animated, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { addDoc, collection } from 'firebase/firestore';
import { db, auth } from "../../config/firebaseConfig";
import LoadingScreen from '../../screens/appScreens/LoadingScreen';
import Fonts from '../../utils/Fonts'; // Importa o componente de carregamento

const API_KEY_DOG = 'live_a18kGWDwOwGdBaVo228FKBjEjHpRxTFT1KCN64vg8autI0DK1fRncxBn53TQa7KL';
const API_KEY_CAT = 'live_rlswPycwAxMFCNOEuB0Gp9gIik708ockKXnjesGMXgMHyTxeT0LlIbjet3TPQrcM';

const AdicionarPet = ({ navigation }) => {
    const [name, setName] = useState('');
    const [species, setSpecies] = useState('');
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);
    const [selectedBreed, setSelectedBreed] = useState('');
    const [gender, setGender] = useState('');
    const [age, setAge] = useState('');
    const [loading, setLoading] = useState(true);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const { data: dogs } = await axios.get(`https://api.thedogapi.com/v1/breeds?api_key=${API_KEY_DOG}`);
                setDogBreeds(dogs);
            } catch (error) {
                console.error('Failed to fetch dog breeds:', error);
            }
            try {
                const { data: cats } = await axios.get(`https://api.thecatapi.com/v1/breeds?api_key=${API_KEY_CAT}`);
                setCatBreeds(cats);
            } catch (error) {
                console.error('Failed to fetch cat breeds:', error);
            }
            setLoading(false);
        };

        fetchData();
    }, []);

    useEffect(() => {
        let stepProgress = 0;
        if (name) stepProgress += 0.25;
        if (species) stepProgress += 0.25;
        if (selectedBreed) stepProgress += 0.25;
        if (gender) stepProgress += 0.25;

        Animated.timing(progress, {
            toValue: stepProgress * 100,
            duration: 500,
            useNativeDriver: false,
        }).start();
    }, [name, species, selectedBreed, gender]);

    const handleSavePet = async () => {
        if (!name || !species || !selectedBreed || !gender || !age) {
            Alert.alert('Erro', 'Todos os campos devem ser preenchidos!');
            return;
        }
    
        let imageURL = '';
        if (species === 'dog') {
            imageURL = gender === 'male'
                ? require('../../../../assets/img/cachorro.png')
                : require('../../../../assets/img/cachorrofemale.png');
        } else if (species === 'cat') {
            imageURL = gender === 'male'
                ? require('../../../../assets/img/gatow.png')
                : require('../../../../assets/img/gatofemale.png');
        }
    
        try {
            const user = auth.currentUser;
            if (!user) {
                Alert.alert('Erro', 'Usuário não autenticado.');
                return;
            }
    
            await addDoc(collection(db, "pets"), {
                name,
                species,
                breed: selectedBreed,
                gender,
                age,  // Adiciona a idade ao banco de dados
                imageURL,
                ownerId: user.uid,
            });
            console.log('Pet salvo com sucesso!');
            navigation.goBack();
        } catch (error) {
            console.error('Erro ao salvar pet:', error);
        }
    };

    if (loading) {
        return <LoadingScreen />;
    }

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.containervoltar}>
                    <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
                    <Text style={styles.txtvoltar}>Voltar</Text>
                </View>
            </TouchableOpacity>

            <Text style={styles.title}>Adicione seu pet</Text>

            <Text style={styles.label}>Nome do Pet:</Text>
            <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Digite o nome do pet"
                placeholderTextColor="#888"
            />

<Text style={styles.label}>Idade do Pet:</Text>
<TextInput
    style={styles.input}
    value={age}
    onChangeText={setAge}
    placeholder="Digite a idade do pet"
    placeholderTextColor="#888"
    keyboardType="text"
/>


            <Text style={styles.label}>Espécie:</Text>
            <Picker
                selectedValue={species}
                onValueChange={(itemValue) => {
                    setSpecies(itemValue);
                    setSelectedBreed('');
                }}
                style={styles.picker}
            >
                <Picker.Item label="Selecione a espécie" value="" />
                <Picker.Item label="Cachorro" value="dog" />
                <Picker.Item label="Gato" value="cat" />
            </Picker>

            {species === 'dog' && (
                <>
                    <Text style={styles.label}>Raça do Cachorro:</Text>
                    <Picker
                        selectedValue={selectedBreed}
                        onValueChange={(itemValue) => setSelectedBreed(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione a raça" value="" />
                        {dogBreeds.map((breed) => (
                            <Picker.Item key={breed.id} label={breed.name} value={breed.name} />
                        ))}
                    </Picker>
                </>
            )}

            {species === 'cat' && (
                <>
                    <Text style={styles.label}>Raça do Gato:</Text>
                    <Picker
                        selectedValue={selectedBreed}
                        onValueChange={(itemValue) => setSelectedBreed(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Selecione a raça" value="" />
                        {catBreeds.map((breed) => (
                            <Picker.Item key={breed.id} label={breed.name} value={breed.name} />
                        ))}
                    </Picker>
                </>
            )}

            <Text style={styles.label}>Sexo:</Text>
            <View style={styles.genderContainer}>
                {species === 'dog' && (
                    <>
                        <TouchableOpacity 
                            style={[styles.genderOption, gender === 'male' && styles.selectedGenderOption]}
                            onPress={() => setGender('male')}
                        >
                            <Image
                                source={require('../../../../assets/img/cachorro.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderText}>Macho</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.genderOption, gender === 'female' && styles.selectedGenderOption]}
                            onPress={() => setGender('female')}
                        >
                            <Image
                                source={require('../../../../assets/img/cachorrofemale.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderText}>Fêmea</Text>
                        </TouchableOpacity>
                    </>
                )}
                {species === 'cat' && (
                    <>
                        <TouchableOpacity 
                            style={[styles.genderOption, gender === 'male' && styles.selectedGenderOption]}
                            onPress={() => setGender('male')}
                        >
                            <Image
                                source={require('../../../../assets/img/gatow.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderText}>Macho</Text>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            style={[styles.genderOption, gender === 'female' && styles.selectedGenderOption]}
                            onPress={() => setGender('female')}
                        >
                            <Image
                                source={require('../../../../assets/img/gatofemale.png')}
                                style={styles.genderImage}
                            />
                            <Text style={styles.genderText}>Fêmea</Text>
                        </TouchableOpacity>
                    </>
                )}
            </View>

            <View style={styles.progressContainer}>
                <Animated.View style={[styles.progress, {
                    width: progress.interpolate({
                        inputRange: [0, 100],
                        outputRange: ['0%', '100%']
                    })
                }]} />
            </View>

            <TouchableOpacity style={styles.button} onPress={handleSavePet}>
                <Text style={styles.buttonText}>Salvar Pet</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#F4F4F4',
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
    label: {
        fontSize: 16,
        marginVertical: 8,
        color: '#333',
        fontFamily: Fonts['poppins-medium'],
    },
    input: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        backgroundColor: '#fff',
        marginBottom: 20,
        fontFamily: Fonts['poppins-regular'],
    },
    picker: {
        height: 45,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 5,
        backgroundColor: '#fff',
        marginBottom: 20,
        fontFamily: Fonts['poppins-regular'],
    },
    genderContainer: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: 20,
    },
    genderOption: {
        alignItems: 'center',
        justifyContent: 'center',
        width: 80,
        height: 100,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 10,
        backgroundColor: '#fff',
        padding: 10,
    },
    genderImage: {
        width: 60,
        height: 60,
    },
    genderText: {
        marginTop: 5,
        fontFamily: Fonts['poppins-medium'],
        fontSize: 14,
        color: '#333',
    },
    selectedGenderOption: {
        borderColor: '#7E57C2',
        borderWidth: 2,
    },
    progressContainer: {
        height: 5,
        backgroundColor: '#ddd',
        borderRadius: 5,
        overflow: 'hidden',
        marginVertical: 20,
    },
    progress: {
        height: '100%',
        backgroundColor: '#7E57C2',
    },
    button: {
        backgroundColor: '#7E57C2',
        borderRadius: 5,
        paddingVertical: 15,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontFamily: Fonts['poppins-bold'],
    },
});

export default AdicionarPet;
