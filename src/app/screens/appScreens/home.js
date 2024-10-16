import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, ScrollView, Alert, Modal } from 'react-native';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { collection, getDocs, deleteDoc, doc, addDoc } from 'firebase/firestore'; 
import { db, auth } from "../../config/firebaseConfig";
import Fonts from "../../utils/Fonts";

const API_KEY_DOG = 'live_a18kGWDwOwGdBaVo228FKBjEjHpRxTFT1KCN64vg8autI0DK1fRncxBn53TQa7KL';
const API_KEY_CAT = 'live_rlswPycwAxMFCNOEuB0Gp9gIik708ockKXnjesGMXgMHyTxeT0LlIbjet3TPQrcM'; 

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [pets, setPets] = useState([]);
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);
    const [selectedPet, setSelectedPet] = useState(null);
    const [modalVisible, setModalVisible] = useState(false); 
    const [eventType, setEventType] = useState("");
    const [searchTerm, setSearchTerm] = useState('');

    const data = [
        { id: '1', name: 'Calendário', route: 'calendário' },
        { id: '2', name: 'Perfil', route: 'perfil' },
        { id: '3', name: 'Home', route: 'home' },
        { id: '4', name: 'Adote', route: 'adote' },
        { id: '5', name: 'Adicionar Pet', route: 'AdicionarPet' },
        { id: '6', name: 'Meus Pets', route: 'Pets' },
        { id: '7', name: 'Chats', route: 'ChatList' },
    ];

    const filteredData = data.filter(item =>
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );

      const handleNavigation = (route) => {
        navigation.navigate(route);
      };

const showPetDetails = (pet) => {
    setSelectedPet(pet);
    setModalVisible(true);
};


    const navigation = useNavigation(); 

    useEffect(() => {
        fetchBreeds();
        fetchPets();
    }, []);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            fetchPets();
        });

        return unsubscribe;
    }, [navigation]);

    const fetchBreeds = useCallback(async () => {
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
    }, []);

    const fetchPets = useCallback(async () => {
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
        }
    }, []);

    const handleSearch = useCallback((query) => {
        setSearchQuery(query);
        setFilteredData(
            pets.filter((pet) =>
                pet.name.toLowerCase().includes(query.toLowerCase())
            )
        );
    }, [pets]);

    const handleLongPress = useCallback((id) => {
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
    }, []);

    const deletePet = useCallback(async (id) => {
        try {
            await deleteDoc(doc(db, 'pets', id));
            setPets(prevPets => prevPets.filter(pet => pet.id !== id));
            Alert.alert('Sucesso', 'Pet excluído com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir pet:', error);
            Alert.alert('Erro', 'Não foi possível excluir o pet.');
        }
    }, []);

    const addPet = useCallback(async (petData) => {
        try {
            const user = auth.currentUser;
            if (!user) {
                console.error('Usuário não autenticado.');
                return;
            }

            await addDoc(collection(db, 'pets'), { ...petData, ownerId: user.uid });
            fetchPets();  // Atualiza a lista de pets após adicionar um novo
        } catch (error) {
            console.error('Erro ao adicionar pet:', error);
        }
    }, [fetchPets]);

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

    const btnadote = useCallback(() => {
        navigation.navigate('adote');
    }, [navigation]);

    const btnfavoritos = useCallback(() => {
        navigation.navigate('Favoritos');
    }, [navigation]);
    
    

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
        <TextInput
          placeholder="Buscar..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>
      {/* Lista de resultados filtrados - Apenas aparece se houver algo digitado */}
      {searchTerm.length > 0 && (
        <FlatList
          data={filteredData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.suggestionItem} 
              onPress={() => handleNavigation(item.route)}
            >
              <Text style={styles.suggestionText}>{item.name}</Text>
            </TouchableOpacity>
          )}
        />
      )}
            
            {/* Swiper */}
            <View style={styles.swiperContainer}>
            <Swiper
                style={styles.wrapper}
                autoplay={true}
                autoplayTimeout={3} // Tempo entre as transições
                showsPagination={false}
                loop={true} // Permite looping infinito
            >
                <View style={styles.slide}>
                    <Image source={require('../../../../assets/img/slider1.png')} style={styles.image} />
                </View>
                <View style={styles.slide}>
                    <Image source={require('../../../../assets/img/slider2.png')} style={styles.image} />
                    <TouchableOpacity style={styles.touchable} onPress={btnadote}>
                        <Text style={styles.touchableText}>Adotar</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.slide}>
                    <Image source={require('../../../../assets/img/slider3.png')} style={styles.image} />
                </View>
            </Swiper>
        </View>

            {searchQuery.length > 0 && (
                <FlatList
                    data={filteredData}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <TouchableOpacity>
                            <Text style={styles.searchResult}>{item.name}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Seus Pets</Text>
            </View>
           
            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AdicionarPet')}>
                <AntDesign name="pluscircleo" size={60} color="#593C9D" />
            </TouchableOpacity>

            <FlatList
    horizontal
    data={pets}
    renderItem={({ item }) => (
        <TouchableOpacity 
            onLongPress={() => handleLongPress(item.id)}
            onPress={() => showPetDetails(item)} // Exibe o modal com detalhes do pet
            style={styles.petItem}
        >
            <Image source={getPetImage(item.species, item.gender)} style={styles.petPhoto} />
            <Text style={styles.petName}>{item.name}</Text>
        </TouchableOpacity>
    )}
    keyExtractor={(item) => item.id}
    style={styles.petList}
    showsHorizontalScrollIndicator={false}
/>

<Modal
    visible={modalVisible}
    transparent={true}
    animationType="slide"
    onRequestClose={() => setModalVisible(false)}
>
    <View style={styles.modalBackground}>
        <View style={styles.modalContent}>
            {selectedPet && (
                <>
                    <Text style={styles.modalTitle}>{selectedPet.name}</Text>
                    <Text style={styles.modalText}>Gênero: {selectedPet.gender}</Text>
                    <Text style={styles.modalText}>Idade: {selectedPet.age}</Text>
                    <Text style={styles.modalText}>Raça: {selectedPet.breed}</Text>
                    <TouchableOpacity
                        style={styles.modalButton}
                        onPress={() => setModalVisible(false)}
                    >
                        <Text style={styles.modalButtonText}>Fechar</Text>
                    </TouchableOpacity>
                </>
            )}
        </View>
    </View>
</Modal>

            <View style={styles.breedSection}>
                <Text style={styles.breedTitle}>Raças de Cães</Text>
                <FlatList
                    horizontal
                    data={dogBreeds}
                    renderItem={({ item }) => (
                        <View style={styles.breedItem}>
                            <Image
                                source={{ uri: item?.image?.url || 'https://via.placeholder.com/100' }}
                                style={styles.breedPhoto}
                            />
                            <Text style={styles.breedName}>{item?.name || 'Nome da Raça'}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.breedList}
                />
            </View>

            <View style={styles.breedSectionn}>
                <Text style={styles.breedTitle}>Raças de Gatos</Text>
                <FlatList
                    horizontal
                    data={catBreeds}
                    renderItem={({ item }) => (
                        <View style={styles.breedItem}>
                            <Image
                                source={{ uri: item?.image?.url || 'https://via.placeholder.com/100' }}
                                style={styles.breedPhoto}
                            />
                            <Text style={styles.breedName}>{item?.name || 'Nome da Raça'}</Text>
                        </View>
                    )}
                    keyExtractor={(item) => item.id}
                    style={styles.breedList}
                />
            </View>
        </ScrollView>
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
        paddingHorizontal: 15,
      },
      searchBar: {
        flex: 1,
            height: 40,
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 15,
            marginLeft: 5,
            marginTop: 25,
            fontFamily: Fonts["poppins-regular"],
      },
    favoritesButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    swiperContainer: {
        height: 200,
    },
    wrapper: {},
    slide: {
        flex: 1,
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    touchable: {
        position: 'absolute',
        bottom: 35,
        paddingVertical: 4,  
        paddingHorizontal: 25,
        borderRadius: 24, 
        borderWidth:1.5,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 40,
        borderColor:'#593C9D',
    },
    touchableText: {
        color: '#593C9D',
        fontSize: 14,
        fontFamily: Fonts["poppins-regular"],
    },
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontFamily: Fonts["poppins-bold"],
    },
    addButton: {
        marginVertical: 10,
        marginLeft: 30,
        marginBottom: 30,
    },
    petList: {
        paddingHorizontal: 10,
        marginLeft: 100,
        paddingTop: 350,
        position: 'absolute',
    },
    petItem: {
        marginRight: 10,
        alignItems: 'center',
    },
    petPhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        borderWidth: 2,   
        borderColor: '#593C9D', 
    },
    petName: {
        textAlign: 'center',
        fontFamily: Fonts["poppins-regular"],
    },
    breedSection: {
        marginVertical: 10,
        backgroundColor: '#593C9D',
        borderRadius: 30,
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    breedSectionn: {
        marginVertical: 10,
        backgroundColor: '#593C9D',
        borderRadius: 30,
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
        marginBottom: 90,
    },
    breedTitle: {
        fontSize: 18,
        fontFamily: Fonts["poppins-bold"],
        color: '#fff',
        marginBottom: 10,
        marginLeft: 15,
    },
    breedList: {
        marginBottom: 10,
    },
    breedItem: {
        alignItems: 'center',
        marginHorizontal: 10,
    },
    breedPhoto: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 5,
        borderWidth: 2,   
        borderColor: '#FFFFFF', 
    },
    breedName: {
        fontSize: 12,
        color: '#fff',
        fontFamily: Fonts["poppins-regular"],
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
        elevation: 5, // Adiciona uma sombra para profundidade
    },
    modalTitle: {
        fontSize: 24,
        fontFamily: Fonts["poppins-bold"],
        color: '#593C9D',
        marginBottom: 10,
    },
    modalText: {
        fontSize: 16,
        color: '#333', // Cor de texto mais escura para melhor leitura
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
    searchInput: {
     flex: 1,
            height: 40,
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingHorizontal: 15,
            marginLeft: 5,
            marginTop: 25,
            fontFamily: Fonts["poppins-regular"],
  },
  suggestionItem: {
    backgroundColor: "#EEE",
    padding: 10,
    borderRadius: 8,
    marginVertical: 5,
    marginHorizontal: 10,
  },
  suggestionText: {
    fontSize: 16,
    fontFamily: Fonts["poppins-regular"],
  },
});
