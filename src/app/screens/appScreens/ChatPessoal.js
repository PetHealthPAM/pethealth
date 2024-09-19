import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Image, Modal, Pressable, Alert } from 'react-native';
import { collection, query, onSnapshot, addDoc, orderBy } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, auth } from '../../config/firebaseConfig';
import moment from 'moment'; // Biblioteca para formatação de data e hora
import Fonts from "../../utils/Fonts";
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as Audio from 'expo-av';

const ChatPessoal = ({ route }) => {
    // Recebe parâmetros da tela anterior
    const { petOwnerName, petOwnerPicture, chatId } = route.params;
    const [messages, setMessages] = useState([]); // Estado para armazenar as mensagens
    const [newMessage, setNewMessage] = useState(''); // Estado para armazenar a nova mensagem
    const [modalVisible, setModalVisible] = useState(false); // Estado para controlar a visibilidade do modal
    const [recording, setRecording] = useState(false); // Estado para controlar se está gravando
    const [recordingUri, setRecordingUri] = useState(null); // Estado para armazenar o URI da gravação

    // Efeito para ouvir as mensagens do chat
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

        return () => unsubscribe(); // Limpa a assinatura quando o componente é desmontado
    }, [chatId]);

    // Função para enviar uma nova mensagem
    const handleSend = useCallback(async () => {
        if (newMessage.trim() === '') return;

        try {
            const messagesRef = collection(db, 'chats', chatId, 'messages');
            await addDoc(messagesRef, {
                text: newMessage,
                timestamp: new Date(),
                userId: auth.currentUser?.uid,
            });

            setNewMessage(''); // Limpa o campo de entrada após o envio
        } catch (error) {
            console.error('Erro ao enviar a mensagem:', error);
            Alert.alert('Erro', 'Não foi possível enviar a mensagem. Tente novamente.');
        }
    }, [newMessage, chatId]);

    // Função para iniciar a gravação de áudio
    const handleStartRecording = async () => {
        try {
            const { status } = await Audio.requestPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permissão para usar o microfone é necessária!');
                return;
            }

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HighQuality);
            await recording.startAsync();

            setRecording(true);
            setRecordingUri(null);
        } catch (error) {
            console.error('Erro ao iniciar a gravação:', error);
            Alert.alert('Erro', 'Não foi possível iniciar a gravação.');
        }
    };

    // Função para parar a gravação e enviar o áudio
    const handleStopRecording = async () => {
        try {
            if (!recording) return;

            await recording.stopAndUnloadAsync();
            const uri = recording.getURI();
            setRecording(false);
            setRecordingUri(uri);

            // Enviar áudio para o Firebase Storage
            const storage = getStorage();
            const audioRef = ref(storage, `audio/${Date.now()}.m4a`);
            const response = await fetch(uri);
            const blob = await response.blob();

            await uploadBytes(audioRef, blob);
            const downloadURL = await getDownloadURL(audioRef);

            // Adicionar a URL do áudio ao Firestore
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

    // Função para escolher uma imagem da galeria
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

            if (!result.cancelled) {
                const storage = getStorage();
                const imageRef = ref(storage, `images/${Date.now()}.jpg`);
                const response = await fetch(result.uri);
                const blob = await response.blob();

                await uploadBytes(imageRef, blob);
                const downloadURL = await getDownloadURL(imageRef);

                // Adicionar a URL da imagem ao Firestore
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

    // Função para renderizar cada item de mensagem
    const renderItem = ({ item }) => (
        <View style={[styles.messageContainer, item.userId === auth.currentUser?.uid ? styles.sentMessage : styles.receivedMessage]}>
            {item.text && <Text style={styles.messageText}>{item.text}</Text>}
            {item.imageUrl && <Image source={{ uri: item.imageUrl }} style={styles.messageImage} />}
            {item.audioUrl && (
                <TouchableOpacity onPress={() => {/* Lógica para reproduzir o áudio */}}>
                    <Text style={styles.audioText}>🔊 Ouvir áudio</Text>
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
                    onPress={newMessage.trim() !== '' ? handleSend : (recording ? handleStopRecording : handleStartRecording)} 
                    style={styles.sendButton}
                >
                    <Text style={styles.sendButtonText}>
                        {newMessage.trim() !== '' ? <Feather name="send" size={24} color="white" /> : (recording ? <MaterialIcons name="stop" size={24} color="white" /> : <MaterialIcons name="mic" size={24} color="white" />)}
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
        margin: 5,
        maxWidth: '80%',
        alignSelf: 'flex-start',
    },
    sentMessage: {
        backgroundColor: '#dcf8c6',
        alignSelf: 'flex-end',
    },
    receivedMessage: {
        backgroundColor: '#fff',
        borderColor: '#ddd',
        borderWidth: 1,
        alignSelf: 'flex-start',
    },
    messageText: {
        fontSize: 16,
        color: '#000',
        fontFamily: Fonts['poppins-regular'],
    },
    messageImage: {
        width: 200,
        height: 200,
        borderRadius: 10,
        marginVertical: 5,
    },
    audioText: {
        fontSize: 16,
        color: '#007bff',
        marginVertical: 5,
    },
    messageTime: {
        fontSize: 12,
        color: '#666',
        marginTop: 5,
        alignSelf: 'flex-end',
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
        marginHorizontal: 10,
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
        fontSize: 16,
    },
});

export default ChatPessoal;
