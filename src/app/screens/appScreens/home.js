import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, ScrollView } from 'react-native';
import Swiper from 'react-native-swiper';
import { AntDesign } from '@expo/vector-icons';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

// Importando imagens do slider
import image1 from '../../../../assets/img/slider1.png';
import image2 from '../../../../assets/img/slider2.png';
import image3 from '../../../../assets/img/slider3.png';

const API_KEY_DOG = 'live_a18kGWDwOwGdBaVo228FKBjEjHpRxTFT1KCN64vg8autI0DK1fRncxBn53TQa7KL';
const API_KEY_CAT = 'live_rlswPycwAxMFCNOEuB0Gp9gIik708ockKXnjesGMXgMHyTxeT0LlIbjet3TPQrcM'; 

export default function Home() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [pets, setPets] = useState([]);
    const [dogBreeds, setDogBreeds] = useState([]);
    const [catBreeds, setCatBreeds] = useState([]);

    const navigation = useNavigation(); // Hook de navegação

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
        };

        fetchData();
    }, []);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setFilteredData(
            searchData.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const btnadote = () => {
        navigation.navigate('adote'); // Navega para a tela de adoção
    };

    const btnfavoritos = () => {
        navigation.navigate('favoritos'); // Navega para a tela de favoritos
    };

    return (
        <ScrollView style={styles.container}>
            <View style={styles.topContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.favoritesButton} onPress={btnfavoritos}>
                    <AntDesign name="hearto" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            
            {/* Swiper */}
            <View style={styles.swiperContainer}>
                <Swiper style={styles.wrapper} autoplay={false} showsPagination={false}>
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
                            <Text style={styles.searchResult}>{item.title}</Text>
                        </TouchableOpacity>
                    )}
                />
            )}
            
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Seus Pets</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
                <AntDesign name="pluscircleo" size={60} color="#593C9D" />
            </TouchableOpacity>
            <FlatList
                horizontal
                data={pets}
                renderItem={({ item }) => (
                    <View style={styles.petItem}>
                        <Image source={{ uri: item.photo }} style={styles.petPhoto} />
                        <Text style={styles.petName}>{item.name}</Text>
                    </View>
                )}
                keyExtractor={(item) => item.id}
                style={styles.petList}
            />
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
            <View style={styles.breedSection2}>
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
        paddingHorizontal: 20,
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
    },
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 14,
        marginRight: 15,
        marginTop: 25,
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
    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginVertical: 10,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    addButton: {
        marginVertical: 10,
        marginLeft: 30,
    },
    petList: {
        marginVertical: 10,
    },
    petItem: {
        marginHorizontal: 10,
        alignItems: 'center',
        borderRadius: 10,
        padding: 10,
    },
    petPhoto: {
        width: 80,
        height: 80,
        borderRadius: 40,
        marginBottom: 5,
    },
    petName: {
        color: '#fff',
        fontWeight: 'bold',
    },
    breedSection: {
        marginVertical: 10,
        backgroundColor: '#593C9D',
        borderRadius: 30,
        padding: 10,
        marginLeft: 15,
        marginRight: 15,
    },
    breedSection2: {
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
        fontWeight: 'bold',
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
    },
    breedName: {
        fontSize: 12,
        color: '#fff',
    },
});
