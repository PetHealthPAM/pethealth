import React, { useState } from 'react';
import { StyleSheet, Text, View, Image, TouchableOpacity, TextInput, FlatList, Alert, Modal, Button } from 'react-native';
import { AntDesign, Feather, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';


export default function Perfil() {
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [userName, setUserName] = useState('Nome do Usuário');
    const [profileImage, setProfileImage] = useState(null);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [newUserName, setNewUserName] = useState(userName);

    const handleSearch = (query) => {
        setSearchQuery(query);
        setFilteredData(
            searchData.filter((item) =>
                item.title.toLowerCase().includes(query.toLowerCase())
            )
        );
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setProfileImage(result.assets[0].uri);
        }
    };

    const handleEditProfile = () => {
        setIsModalVisible(true);
    };

    const handleSave = () => {
        setUserName(newUserName);
        setIsModalVisible(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.favoritesButton} >
                    <AntDesign name="hearto" size={30} color="#fff" style={{ marginTop: 35 }} />
                </TouchableOpacity>
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
            <Text style={styles.title}>Perfil</Text>
            <View style={styles.profileContainer}>
                <TouchableOpacity onPress={pickImage}>
                    <Image source={profileImage ? { uri: profileImage } : require('../../../../assets/img/default-profile.jpg')} style={styles.profileImage} />
                </TouchableOpacity>
                <View style={styles.profileDetails}>
                    <Text style={styles.userName}>{userName}</Text>
                    <TouchableOpacity >
                        <Feather name="edit" size={24} color="#000" />
                    </TouchableOpacity>
                </View>
            </View>
            <View style={styles.settingsContainer}>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="person-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Informações Pessoais</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="paw-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Meus Pets</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.settingItem}>
                    <Ionicons name="exit-outline" size={24} color="#000" />
                    <Text style={styles.settingText}>Sair</Text>
                </TouchableOpacity>
            </View>

            {/* Modal para editar informações pessoais */}
            <Modal visible={isModalVisible} transparent={true}>
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Editar Informações Pessoais</Text>
                        <TextInput
                            style={styles.modalInput}
                            value={newUserName}
                            onChangeText={setNewUserName}
                            placeholder="Digite o novo nome"
                        />
                        <Button title="Salvar" onPress={handleSave} />
                        <TouchableOpacity style={styles.closeButton} onPress={() => setIsModalVisible(false)}>
                            <Text style={styles.closeText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
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
    searchBar: {
        flex: 1,
        height: 40,
        backgroundColor: '#fff',
        borderRadius: 20,
        paddingHorizontal: 15,
        marginRight: 15,
        marginTop: 30,
    },
    favoritesButton: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        marginVertical: 20,
        marginLeft: 20,
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 20,
    },
    profileImage: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    profileDetails: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
    },
    userName: {
        fontSize: 24,
        fontWeight: 'bold',
        marginRight: 10,
    },
    settingsContainer: {
        marginTop: 10,
        paddingHorizontal: 20,
    },
    settingItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    settingText: {
        fontSize: 18,
        marginLeft: 10,
    },
    searchResult: {
        padding: 10,
        backgroundColor: '#f9f9f9',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    modalInput: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        marginBottom: 10,
    },
    closeButton: {
        marginTop: 10,
        backgroundColor: '#593C9D',
        padding: 10,
        borderRadius: 5,
    },
    closeText: {
        color: '#fff',
        fontSize: 16,
    },
});
