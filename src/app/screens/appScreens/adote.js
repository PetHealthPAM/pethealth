import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions, TouchableOpacity } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import Fonts from "../../utils/Fonts";

const DOG_BREEDS_URL = 'https://api.thedogapi.com/v1/breeds';
const CAT_BREEDS_URL = 'https://api.thecatapi.com/v1/breeds';
const DOG_IMAGES_URL = 'https://dog.ceo/api/breeds/image/random/100';
const CAT_IMAGES_URL = 'https://api.thecatapi.com/v1/images/search?limit=100';

const fetchDogs = async () => {
    try {
        const response = await fetch(DOG_BREEDS_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching dogs:', error);
        return [];
    }
};

const fetchCats = async () => {
    try {
        const response = await fetch(CAT_BREEDS_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching cats:', error);
        return [];
    }
};

const fetchAllDogImages = async () => {
    try {
        const response = await fetch(DOG_IMAGES_URL);
        const data = await response.json();
        return data.message;
    } catch (error) {
        console.error('Error fetching dog images:', error);
        return ['https://via.placeholder.com/300'];
    }
};

const fetchAllCatImages = async () => {
    try {
        const response = await fetch(CAT_IMAGES_URL);
        const data = await response.json();
        return data.map(img => img.url);
    } catch (error) {
        console.error('Error fetching cat images:', error);
        return ['https://via.placeholder.com/300'];
    }
};

// Função para embaralhar os pets
const shuffleArray = (array) => {
    return array.sort(() => Math.random() - 0.5);
};


export default function Adote({ navigation }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPets = async () => {
            const fetchPets = async () => {
                try {
                    const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
                    const querySnapshot = await getDocs(q);
                    return querySnapshot.docs.map(doc => doc.data());
                } catch (error) {
                    console.error('Erro ao buscar os pets:', error);
                    return [];
                }
            };

            const firestorePets = await fetchPets();
            const dogBreeds = await fetchDogs();
            const catBreeds = await fetchCats();
            const dogImages = await fetchAllDogImages();
            const catImages = await fetchAllCatImages();

            const apiPets = shuffleArray([
                ...dogBreeds.map((breed, index) => ({
                    id: `dog-${index}`,
                    name: breed.name,
                    species: 'Cachorro',
                    breed: breed.name,
                    age: 'Desconhecida',
                    description: breed.temperament || 'Nenhuma descrição disponível',
                    vaccinated: true,
                    dewormed: true,
                    image: dogImages[index % dogImages.length] || 'https://via.placeholder.com/300',
                    ownerId: 'owner-dog-' + index,
                })),
                ...catBreeds.map((breed, index) => ({
                    id: `cat-${index}`,
                    name: breed.name,
                    species: 'Gato',
                    breed: breed.name,
                    age: 'Desconhecida',
                    description: breed.temperament || 'Nenhuma descrição disponível',
                    vaccinated: true,
                    dewormed: true,
                    image: catImages[index % catImages.length] || 'https://via.placeholder.com/300',
                    ownerId: 'owner-cat-' + index,
                })),
            ]);

            // Combine pets do Firestore e API
            const combinedPets = [
                ...firestorePets.map(pet => ({
                    ...pet,
                    image: pet.imageUri || 'https://via.placeholder.com/300', // Use imageUri from Firestore
                })),
                ...apiPets,
            ];

            setPets(combinedPets);
            setLoading(false);
        };

        loadPets();
    }, []);

    const handleSwipe = (cardIndex, direction) => {
        if (cardIndex >= pets.length) return;
        const pet = pets[cardIndex];
    
        // Verifique se o pet e o ownerId estão definidos
        if (direction === 'right' && pet && pet.ownerId) {
            navigation.navigate('Chat', { pet, ownerId: pet.ownerId });
        } else {
            console.warn('Pet ou ownerId não definidos:', pet);
        }
    };
    
    const loadPets = async () => {
        const fetchPets = async () => {
            try {
                const q = query(collection(db, 'pets'), orderBy('createdAt', 'desc'));
                const querySnapshot = await getDocs(q);
                return querySnapshot.docs.map(doc => ({
                    ...doc.data(),
                    ownerId: doc.id, // Aqui garantimos que o ownerId está sendo definido
                }));
            } catch (error) {
                console.error('Erro ao buscar os pets:', error);
                return [];
            }
        };
    
        const firestorePets = await fetchPets();
        const dogBreeds = await fetchDogs();
        const catBreeds = await fetchCats();
        const dogImages = await fetchAllDogImages();
        const catImages = await fetchAllCatImages();
    
        const apiPets = shuffleArray([
            ...dogBreeds.map((breed, index) => ({
                id: `dog-${index}`,
                name: breed.name,
                species: 'Cachorro',
                breed: breed.name,
                age: 'Desconhecida',
                description: breed.temperament || 'Nenhuma descrição disponível',
                vaccinated: true,
                dewormed: true,
                image: dogImages[index % dogImages.length] || 'https://via.placeholder.com/300',
                ownerId: 'owner-dog-' + index, // ID fictício para pets da API
            })),
            ...catBreeds.map((breed, index) => ({
                id: `cat-${index}`,
                name: breed.name,
                species: 'Gato',
                breed: breed.name,
                age: 'Desconhecida',
                description: breed.temperament || 'Nenhuma descrição disponível',
                vaccinated: true,
                dewormed: true,
                image: catImages[index % catImages.length] || 'https://via.placeholder.com/300',
                ownerId: 'owner-cat-' + index, // ID fictício para pets da API
            })),
        ]);
    
        // Combine pets do Firestore e API
        const combinedPets = [
            ...firestorePets.map(pet => ({
                ...pet,
                image: pet.imageUri || 'https://via.placeholder.com/300', // Use imageUri from Firestore
            })),
            ...apiPets,
        ];
    
        setPets(combinedPets);
        setLoading(false);
    };
    
    

    const navigateToAdoptPet = () => {
        navigation.navigate('AdotarPet');
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <ActivityIndicator size="large" color="#593C9D" />
            ) : pets.length > 0 ? (
                <Swiper
                    cards={pets}
                    renderCard={(pet) => (
                        <View style={styles.card}>
                            <Image source={{ uri: pet.image }} style={styles.image} />
                            <View style={styles.detailsContainer}>
                                <Text style={styles.name}>{pet.name}</Text>
                                <Text style={styles.details}>Espécie: {pet.species}</Text>
                                <Text style={styles.details}>Raça: {pet.breed}</Text>
                                <Text style={styles.details}>Idade: {pet.age}</Text>
                                <Text style={styles.description}>Descrição: {pet.description}</Text>
                            </View>
                        </View>
                    )}
                    onSwipedLeft={(cardIndex) => handleSwipe(cardIndex, 'left')}
                    onSwipedRight={(cardIndex) => handleSwipe(cardIndex, 'right')}
                    cardIndex={0}
                    backgroundColor={'#f3f3f3'}
                    stackSize={3}
                    overlayLabels={{
                        left: {
                            title: 'NÃO',
                            style: {
                                label: {
                                    backgroundColor: '#FF4C4C',
                                    borderColor: '#FF4C4C',
                                    color: 'white',
                                    borderWidth: 1,
                                    fontSize: 24,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30,
                                },
                            },
                        },
                        right: {
                            title: 'SIM',
                            style: {
                                label: {
                                    backgroundColor: '#593C9D',
                                    borderColor: '#593C9D',
                                    color: 'white',
                                    borderWidth: 1,
                                    fontSize: 24,
                                },
                                wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30,
                                },
                            },
                        },
                    }}
                />
            ) : (
                <Text style={styles.noPetsText}>Sem pets disponíveis</Text>
            )}
            <TouchableOpacity style={styles.cameraButton} onPress={navigateToAdoptPet}>
                <Ionicons name="camera" size={32} color="#FFF" />
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    card: {
        flex: 1,
        width: Dimensions.get('window').width - 55,
        backgroundColor: '#593C9D',
        borderRadius: 10,
        padding: 20,
        margin: 10,
        borderColor: '#593C9D',
        borderWidth: 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 6,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 8,
    },
    detailsContainer: {
        marginTop: 10,
    },
    name: {
        fontSize: 24,
        color: '#FFF',
        fontFamily: Fonts['poppins-bold'],
    },
    details: {
        fontSize: 16,
        color: '#FFF',
        fontFamily: Fonts['poppins-regular'],
    },
    description: {
        marginTop: 10,
        fontSize: 16,
        color: '#FFF',
        fontFamily: Fonts['poppins-regular'],
    },
    noPetsText: {
        fontSize: 18,
        color: '#593C9D',
        textAlign: 'center',
    },
    cameraButton: {
        position: 'absolute',
        bottom: 100,
        right: 30,
        backgroundColor: '#7E57C2',
        borderRadius: 50,
        padding: 15,
        elevation: 5,
    },
});

