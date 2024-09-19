import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Modal, Pressable, Alert } from 'react-native';
import { collection, query, onSnapshot, addDoc, orderBy, doc, setDoc, deleteField, deleteDoc, where, getDocs } from 'firebase/firestore';
import { db, auth } from '../../config/firebaseConfig';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Fonts from "../../utils/Fonts";
import moment from 'moment';
import * as ImagePicker from 'expo-image-picker';
import * as AudioPicker from 'expo-av';

const fetchUserProfile = async () => {
    try {
        const response = await fetch('https://randomuser.me/api/');
        const data = await response.json();
        return data.results[0];
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return {
            name: { first: 'John', last: 'Doe' },
            picture: { large: 'https://via.placeholder.com/150' }
        };
    }
};

const Chat = ({ route }) => {
    const { pet } = route.params;
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [userProfile, setUserProfile] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [image, setImage] = useState(null);
    const [audioUri, setAudioUri] = useState(null);
    const [recording, setRecording] = useState(null);

    useEffect(() => {
        const loadUserProfile = async () => {
            const profile = await fetchUserProfile();
            setUserProfile(profile);
        };

        loadUserProfile();

        const messagesRef = collection(db, 'chats', pet.id, 'messages');
        const q = query(messagesRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push(doc.data());
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe();
    }, [pet.id]);

    const handleSend = useCallback(async () => {
        if (newMessage.trim() === '' && !audioUri) return;

        const messagesRef = collection(db, 'chats', pet.id, 'messages');
        const chatsRef = doc(db, 'chats', pet.id);

        await addDoc(messagesRef, {
            text: newMessage,
            timestamp: new Date(),
            userId: auth.currentUser?.uid,
            image: image ? image : null,
            audio: audioUri ? audioUri : null,
        });

        await setDoc(chatsRef, {
            lastMessage: newMessage,
            lastMessageTime: new Date(),
            petOwnerName: `${userProfile?.name?.first} ${userProfile?.name?.last}`,
            petOwnerPicture: userProfile?.picture?.large,
            userId: auth.currentUser?.uid,
        }, { merge: true });

        setNewMessage('');
        setImage(null);
        setAudioUri(null);
    }, [newMessage, pet.id, userProfile, image, audioUri]);

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
   
        if (!permissionResult.granted) {
            alert("Permission to access camera roll is required!");
            return;
        }
   
        const result = await ImagePicker.launchImageLibraryAsync();
        if (!result.canceled) {
            setImage(result.uri);
        }
    };

    const deleteConversation = async (petId) => {
        try {
            // Excluir todas as mensagens da conversa
            const messagesRef = collection(db, 'chats', petId, 'messages');
            const messagesSnapshot = await getDocs(messagesRef);
            
            messagesSnapshot.forEach(async (messageDoc) => {
                await deleteDoc(messageDoc.ref);
            });
    
            // Excluir o documento da conversa
            const chatRef = doc(db, 'chats', petId);
            await deleteDoc(chatRef);
    
            console.log('Conversa e mensagens excluídas com sucesso!');
        } catch (error) {
            console.error('Erro ao excluir conversa:', error);
        }
    };

    const startRecording = async () => {
        try {
            const { status } = await AudioPicker.Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission to access microphone is required!');
                return;
            }
            const { recording } = await AudioPicker.Audio.Recording.createAsync(
                AudioPicker.Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
            );
            setRecording(recording);
        } catch (error) {
            console.error('Failed to start recording', error);
        }
    };

    const stopRecording = async () => {
        try {
            if (recording) {
                await recording.stopAndUnloadAsync();
                const uri = recording.getURI();
                setAudioUri(uri);
                setRecording(null);
            }
        } catch (error) {
            console.error('Failed to stop recording', error);
        }
    };

    const handleAudioSend = async () => {
        if (audioUri) {
            await handleSend();
        }
    };

    const renderItem = ({ item }) => {
        const isUserMessage = item.userId === auth.currentUser?.uid;
        return (
            <View style={[styles.messageContainer, isUserMessage ? styles.sentMessage : styles.receivedMessage]}>
                {item.image && <Image source={{ uri: item.image }} style={styles.messageImage} />}
                {item.audio && (
                    <TouchableOpacity onPress={() => console.log('Play audio')}>
                        <MaterialIcons name="play-arrow" size={24} color="gray" />
                    </TouchableOpacity>
                )}
                <Text style={styles.messageText}>{item.text}</Text>
                <Text style={styles.messageTime}>
                    {moment(item.timestamp.toDate()).format('DD/MM/YYYY [às] HH:mm')}
                </Text>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Image source={{ uri: userProfile?.picture?.large || 'https://via.placeholder.com/150' }} style={styles.profilePicture} />
                </Pressable>
                <View style={styles.headerText}>
                    <Text style={styles.userName}>{userProfile?.name?.first || 'Nome'} {userProfile?.name?.last || ''}</Text>
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
                inverted
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <TouchableOpacity onPress={pickImage} style={styles.iconButton}>
                    <MaterialIcons name="attach-file" size={24} color="gray" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Mensagem"
                />
                <TouchableOpacity 
                    onPress={newMessage.trim() === '' ? (recording ? stopRecording : startRecording) : handleSend} 
                    style={styles.sendButton}
                >
                    {newMessage.trim() === '' ? (
                        recording ? (
                            <Feather name="stop-circle" size={24} color="white" />
                        ) : (
                            <Feather name="mic" size={24} color="white" />
                        )
                    ) : (
                        <Feather name="send" size={24} color="white" />
                    )}
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: userProfile?.picture?.large || 'https://via.placeholder.com/150' }} style={styles.modalProfilePicture} />
                        <Text style={styles.modalUserName}>{userProfile?.name?.first || 'Nome'} {userProfile?.name?.last || ''}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e5ddd5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
        backgroundColor: '#7E57C2',
    },
    profilePicture: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
        marginTop: 20,
        marginLeft: 5,
    },
    headerText: {
        flex: 1,
        marginTop: 20,
    },
    userName: {
        fontSize: 18,
        color: '#fff',
        fontFamily: Fonts['poppins-medium'],
    },
    messageContainer: {
        padding: 10,
        borderRadius: 20,
        marginVertical: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    sentMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
        borderBottomRightRadius: 0,
    },
    receivedMessage: {
        backgroundColor: '#fff',
        borderBottomLeftRadius: 0,
    },
    messageText: {
        fontSize: 16,
        color: '#000',
        fontFamily: Fonts['poppins-regular'],
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
        marginBottom: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
        backgroundColor: 'transparent',
    },
    input: {
        flex: 1,
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 20,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#f5f5f5',
    },
    sendButton: {
        backgroundColor: '#7E57C2',
        borderRadius: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    messageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        alignSelf: 'flex-end',
    },
    modalOverlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    modalProfilePicture: {
        width: 100,
        height: 100,
        borderRadius: 50,
        marginBottom: 10,
    },
    modalUserName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    modalCloseButton: {
        marginTop: 20,
        paddingVertical: 10,
        paddingHorizontal: 20,
        backgroundColor: '#7E57C2',
        borderRadius: 20,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    iconButton: {
        paddingHorizontal: 10,
    },
});

export default Chat;
