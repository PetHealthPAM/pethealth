import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { collection, query, onSnapshot, doc, deleteDoc, where } from 'firebase/firestore';
import Feather from '@expo/vector-icons/Feather';
import { auth, db } from '../../config/firebaseConfig';
import Fonts from "../../utils/Fonts";
import moment from 'moment';

export default function ChatList({ navigation }) {
    const [chats, setChats] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);

    const userId = auth.currentUser?.uid;

    useEffect(() => {
        if (!userId) {
            setError('Usuário não autenticado.');
            setLoading(false);
            return;
        }

        const chatsRef = collection(db, 'chats');
        const q = query(chatsRef, where('userId', '==', userId));

        const unsubscribe = onSnapshot(
            q,
            (querySnapshot) => {
                const chatsArray = [];
                querySnapshot.forEach((doc) => {
                    chatsArray.push({ id: doc.id, ...doc.data() });
                });

                chatsArray.sort((a, b) => {
                    const dateA = a.lastMessageTimestamp ? a.lastMessageTimestamp.toDate() : new Date(0);
                    const dateB = b.lastMessageTimestamp ? b.lastMessageTimestamp.toDate() : new Date(0);
                    return dateB - dateA;
                });

                setChats(chatsArray);
                setError(null);
                setLoading(false);
            },
            (error) => {
                console.error('Erro ao buscar conversas:', error);
                setError('Erro ao buscar conversas.');
                setLoading(false);
            }
        );

        return () => unsubscribe();
    }, [userId]);

    const handlePress = (chat) => {
        navigation.navigate('ChatPessoal', {
            petOwnerName: chat.petOwnerName,
            petOwnerPicture: chat.petOwnerPicture,
            chatId: chat.id,
        });
    };

    const handleDelete = async (chatId) => {
        Alert.alert(
            'Excluir conversa',
            'Você tem certeza que deseja excluir esta conversa?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel',
                },
                {
                    text: 'Excluir',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'chats', chatId));
                        } catch (error) {
                            console.error('Erro ao excluir conversa:', error);
                        }
                    },
                },
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.chatItem}>
            <TouchableOpacity onPress={() => handlePress(item)} style={styles.chatInfoContainer}>
                <Image source={{ uri: item.petOwnerPicture || 'https://via.placeholder.com/150' }} style={styles.profilePicture} />
                <View style={styles.chatInfo}>
                    <Text style={styles.userName}>{item.petOwnerName || 'Desconhecido'}</Text>
                    <Text style={styles.lastMessage}>{item.lastMessage || 'Sem mensagens ainda'}</Text>
                    {item.lastMessageTimestamp && (
                        <Text style={styles.lastMessageTime}>
                            {moment(item.lastMessageTimestamp.toDate()).format('DD/MM/YYYY [às] HH:mm')}
                        </Text>
                    )}
                </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleDelete(item.id)} style={styles.deleteButton}>
                <Feather name="trash-2" size={24} color="#FF3B30" />
            </TouchableOpacity>
        </View>
    );

    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#7E57C2" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    if (chats.length === 0) {
        return (
            <View style={styles.container}>
                <Text style={styles.errorText}>Nenhuma conversa encontrada.</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <View style={styles.containervoltar}>
                    <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
                    <Text style={styles.txtvoltar}>Voltar</Text>
                </View>
            </TouchableOpacity>
            <Text style={styles.title}>Conversas</Text>
            <FlatList
                data={chats}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 10,
    },
    containervoltar: {
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginBottom: 10,
        marginTop: 20,
        marginLeft: 10,
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
    chatItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        marginBottom: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 2,
    },
    chatInfoContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        marginLeft: 5,
        color: '#7E57C2',
        fontFamily: Fonts['poppins-black'],
    },
    chatInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontFamily: Fonts['poppins-medium'],
        color: '#7E57C2',
    },
    lastMessage: {
        fontSize: 14,
        color: '#333',
        fontFamily: Fonts['poppins-regular'],
    },
    lastMessageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
    },
    deleteButton: {
        justifyContent: 'center',
        paddingHorizontal: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    loadingText: {
        fontSize: 18,
        color: '#7E57C2',
        marginTop: 10,
        fontFamily: Fonts['poppins-black'],
    },
    errorText: {
        fontSize: 18,
        color: '#7E57C2',
        textAlign: 'center',
        marginTop: '100%',
        fontFamily: Fonts['poppins-black'],
    },
});
