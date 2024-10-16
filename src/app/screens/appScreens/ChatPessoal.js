import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Modal, Pressable, Alert } from 'react-native';
import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../config/firebaseConfig';
import moment from 'moment'; 
import Fonts from "../../utils/Fonts";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { Audio } from 'expo-av'; 
import AntDesign from '@expo/vector-icons/AntDesign';

const ChatPessoal = ({ route }) => {
    const { petOwnerName, petOwnerPicture, chatId } = route.params;
    const [messages, setMessages] = useState([]); 
    const [newMessage, setNewMessage] = useState(''); 
    const [modalVisible, setModalVisible] = useState(false); 
    const [recording, setRecording] = useState(null); 
    const [recordingUri, setRecordingUri] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [selectedImageUrl, setSelectedImageUrl] = useState(null);

    useEffect(() => {
        const messagesRef = collection(db, 'chats', chatId, 'messages');
        const q = query(messagesRef, orderBy('timestamp'));

        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const messagesArray = [];
            querySnapshot.forEach((doc) => {
                messagesArray.push(doc.data());
            });
            setMessages(messagesArray);
        });

        return () => unsubscribe(); 
    }, [chatId]);

    const handleSend = useCallback(async () => {
        if (newMessage.trim() === '') return;

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                text: newMessage,
                timestamp: new Date(),
                userId: auth.currentUser?.uid,
            });

            setNewMessage(''); 
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
        }
    }, [newMessage, chatId]);

    const handleStartRecording = async () => {
        if (recording) {
            Alert.alert('Já existe uma gravação em andamento.');
            return;
        }

        try {
            const permission = await Audio.requestPermissionsAsync();
            if (!permission.granted) {
                Alert.alert('Permissão para usar o microfone é necessária!');
                return;
            }

            const { recording } = await Audio.Recording.createAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );

            setRecording(recording);
            setRecordingUri(null);
        } catch (error) {
            console.error('Erro ao iniciar a gravação:', error);
            Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
        }
    };

    const handleStopRecording = async () => {
        if (!recording) return;

        try {
            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(null);
            setRecordingUri(uri);

            const storage = getStorage();
            const audioRef = ref(storage, `audio/${Date.now()}.m4a`);
            const response = await fetch(uri);
            const blob = await response.blob();

            await uploadBytes(audioRef, blob);
            const downloadURL = await getDownloadURL(audioRef);

            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                audioUrl: downloadURL,
                timestamp: new Date(),
                userId: auth.currentUser?.uid,
            });
        } catch (error) {
            console.error('Erro ao parar a gravação ou enviar o áudio:', error);
            Alert.alert('Erro', 'Não foi possível enviar o áudio. Tente novamente.');
        }
    };

    const handlePickImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão para acessar a galeria é necessária!');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled) {
                const storage = getStorage();
                const imageRef = ref(storage, `images/${Date.now()}.jpg`);
                const response = await fetch(result.assets[0].uri);
                const blob = await response.blob();

                await uploadBytes(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);

                const messagesRef = collection(db, 'chats', chatId, 'messages');
                await addDoc(messagesRef, {
                    imageUrl: downloadURL,
                    timestamp: new Date(),
                    userId: auth.currentUser?.uid,
                });
            }
        } catch (error) {
            console.error('Erro ao selecionar ou enviar a imagem:', error);
            Alert.alert('Erro', 'Não foi possível enviar a imagem. Tente novamente.');
        }
    };

    const handlePlayAudio = async (audioUrl) => {
        const { sound } = await Audio.Sound.createAsync(
            { uri: audioUrl }
        );
        await sound.playAsync();
    };

    const handleOpenImageModal = (imageUrl) => {
        setSelectedImageUrl(imageUrl);
        setImageModalVisible(true);
    };

    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.userId === auth.currentUser?.uid ? styles.sentMessage : styles.receivedMessage]}>
            {item.text && <Text style={styles.messageText}>{item.text}</Text>}
            {item.imageUrl && (
                <TouchableOpacity onPress={() => handleOpenImageModal(item.imageUrl)}>
                    <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />
                </TouchableOpacity>
            )}
            {item.audioUrl && (
                <TouchableOpacity onPress={() => handlePlayAudio(item.audioUrl)}>
                    <Text style={styles.audioText}>⏯ Ouvir Aúdio</Text>
                </TouchableOpacity>
            )}
            <Text style={styles.messageTime}>
                {moment(item.timestamp.toDate()).format('DD/MM/YYYY [às] HH:mm')}
            </Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Pressable onPress={() => setModalVisible(true)}>
                    <Image source={{ uri: petOwnerPicture }} style={styles.profilePicture} />
                </Pressable>
                <View style={styles.headerText}>
                    <Text style={styles.userName}>{petOwnerName}</Text>
                </View>
            </View>
            <FlatList
                data={messages}
                keyExtractor={(item, index) => index.toString()}
                renderItem={renderItem}
            />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.inputContainer}
            >
                <TouchableOpacity onPress={handlePickImage} style={styles.iconButton}>
                    <MaterialIcons name="attach-file" size={24} color="gray" />
                </TouchableOpacity>
                <TextInput
                    style={styles.input}
                    value={newMessage}
                    onChangeText={setNewMessage}
                    placeholder="Mensagem"
                />
                <TouchableOpacity
                    onPressIn={handleStartRecording}
                    onPressOut={handleStopRecording}
                    style={styles.sendButton}
                >
                    <Text style={styles.sendButtonText}>
                        {newMessage.trim() !== '' ? (
                            <Feather name="send" size={24} color="white" />
                        ) : recording ? (
                            <MaterialIcons name="stop" size={24} color="white" />
                        ) : (
                            <Feather name="mic" size={24} color="white" />
                        )}
                    </Text>
                </TouchableOpacity>
            </KeyboardAvoidingView>

            <Modal
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <View style={styles.modalContent}>
                        <Image source={{ uri: petOwnerPicture }} style={styles.modalProfilePicture} />
                        <Text style={styles.modalUserName}>{petOwnerName}</Text>
                        <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.modalCloseButton}>
                            <Text style={styles.modalCloseButtonText}>Fechar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
            <Modal
                transparent={true}
                visible={imageModalVisible}
                onRequestClose={() => setImageModalVisible(false)}
            >
                <View style={styles.modalOverlay}>
                    <Pressable onPress={() => setImageModalVisible(false)} style={styles.modalOverlay}>
                        <Image source={{ uri: selectedImageUrl }} style={styles.fullScreenImage} />
                    </Pressable>
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
        fontFamily: Fonts.Bold,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'transparent',
        borderTopWidth: 1,
        borderTopColor: '#ddd',
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
    sendButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    iconButton: {
        marginRight: 10,
    },
    messageContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: '70%',
    },
    sentMessage: {
        alignSelf: 'flex-end',
        backgroundColor: '#d1f7c4',
    },
    receivedMessage: {
        alignSelf: 'flex-start',
        backgroundColor: '#fff',
    },
    messageText: {
        fontSize: 16,
        color: '#333',
    },
    messageImage: {
        width: 150,
        height: 150,
        borderRadius: 10,
    },
    audioText: {
        color: '#7E57C2',
        fontWeight: 'bold',
    },
    messageTime: {
        fontSize: 12,
        color: '#999',
        textAlign: 'right',
        marginTop: 5,
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
    },
    modalUserName: {
        fontSize: 20,
        color: '#333',
        marginVertical: 10,
    },
    modalCloseButton: {
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#593C9D',
        marginTop: 20,
    },
    modalCloseButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    fullScreenImage: {
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
});

export default ChatPessoal;
