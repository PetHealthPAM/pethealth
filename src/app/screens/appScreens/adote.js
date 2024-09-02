import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, ActivityIndicator, Dimensions } from 'react-native';
import Swiper from 'react-native-deck-swiper';

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

export default function Adote({ navigation }) {
    const [pets, setPets] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadPets = async () => {
            const dogBreeds = await fetchDogs();
            const catBreeds = await fetchCats();
            const dogImages = await fetchAllDogImages();
            const catImages = await fetchAllCatImages();

            const combinedPets = [
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
                })),
            ];

            setPets(combinedPets.sort(() => Math.random() - 0.5));
            setLoading(false);
        };

        loadPets();
    }, []);

    const handleSwipe = (cardIndex) => {
        if (cardIndex >= pets.length) return;
        const pet = pets[cardIndex];
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
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff', // Fundo escuro
    },
    card: {
        flex: 1,
        width: Dimensions.get('window').width - 55,
        backgroundColor: '#593C9D', // Fundo das cartas mais escuro
        borderRadius: 10,
        padding: 20,
        margin: 10,
        borderColor: '#593C9D', // Borda roxa
        borderWidth: 2,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3, // Sombra suavizada
        shadowRadius: 6,
        position: 'relative',
    },
    image: {
        width: '100%',
        height: 300,
        borderRadius: 10,
        marginBottom: 20,
    },
    detailsContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    name: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FFF', // Texto branco para contraste
        marginBottom: 10,
    },
    details: {
        fontSize: 16,
        marginVertical: 2,
        color: '#E0E0E0', // Texto cinza claro
    },
    description: {
        fontSize: 14,
        marginTop: 10,
        color: '#B0B0B0', // Texto cinza ainda mais claro
        textAlign: 'center',
    },
    noPetsText: {
        fontSize: 18,
        color: '#FFF', // Texto branco
        textAlign: 'center',
        paddingHorizontal: 20,
    },
});
