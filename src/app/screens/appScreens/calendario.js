import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert, Modal, TextInput } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { AntDesign, Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

export default function Calendario() {
    const [selectedDate, setSelectedDate] = useState('');
    const [events, setEvents] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [eventName, setEventName] = useState('');
    const today = new Date().toISOString().split('T')[0];
    const [searchQuery, setSearchQuery] = useState('');

    const navigation = useNavigation();

    const handleSearch = (query) => {
        setSearchQuery(query);
        // Implement your search logic here
    };

    const addEvent = () => {
        if (eventName.trim()) {
            const newEvent = { title: eventName, date: selectedDate };
            setEvents([...events, newEvent]);
            setEventName('');
            setModalVisible(false);
        } else {
            Alert.alert('Erro', 'O nome do evento não pode ser vazio.');
        }
    };

    const confirmRemoveEvent = (eventTitle) => {
        Alert.alert(
            'Remover Evento',
            'Você tem certeza que deseja remover este evento?',
            [
                { text: 'Cancelar', style: 'cancel' },
                { text: 'Remover', onPress: () => removeEvent(eventTitle), style: 'destructive' },
            ],
            { cancelable: true }
        );
    };

    const removeEvent = (eventTitle) => {
        setEvents(events.filter(event => event.title !== eventTitle));
    };

    const handleDayPress = (day) => {
        setSelectedDate(day.dateString);
        setModalVisible(true);
    };

    const renderEvent = ({ item }) => (
        <View style={styles.eventContainer}>
            <Text style={styles.eventText}>{item.title} - {item.date}</Text>
            <TouchableOpacity onPress={() => confirmRemoveEvent(item.title)}>
                <Feather name="trash-2" size={24} color="red" />
            </TouchableOpacity>
        </View>
    );

    const customMarkedDates = {
        [today]: { selected: true, selectedColor: '#593C9D' },
    };

    // Mark dates with events
    events.forEach(event => {
        customMarkedDates[event.date] = {
            marked: true,
            dotColor: '#F49B42',
            selected: event.date === today,
            selectedColor: event.date === today ? '#593C9D' : undefined,
        };
    });

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <TouchableOpacity style={styles.favoritesButton} onPress={() => navigation.navigate('Favoritos')}>
                    <AntDesign name="hearto" size={30} color="#fff" />
                </TouchableOpacity>
            </View>
            <Calendar
                onDayPress={handleDayPress}
                markedDates={customMarkedDates}
                theme={{
                    arrowColor: '#593C9D',
                    monthTextColor: '#593C9D',
                    textSectionTitleColor: '#593C9D',
                    selectedDayBackgroundColor: '#593C9D',
                    todayTextColor: '#593C9D',
                    textDayFontWeight: 'bold',
                }}
            />
            <FlatList
                data={events}
                keyExtractor={(item) => item.title + item.date}
                renderItem={renderEvent}
                contentContainerStyle={styles.eventList}
            />
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(!modalVisible);
                }}
            >
                <View style={styles.modalView}>
                    <Text style={styles.modalText}>Adicionar Evento</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Nome do Evento"
                        value={eventName}
                        onChangeText={setEventName}
                    />
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity style={styles.modalButton} onPress={addEvent}>
                            <Text style={styles.modalButtonText}>Adicionar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: 'red' }]} onPress={() => setModalVisible(false)}>
                            <Text style={styles.modalButtonText}>Cancelar</Text>
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
        marginTop: 25,
    },
    favoritesButton: {
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 25,
    },
    eventContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    eventText: {
        fontSize: 16,
    },
    eventList: {
        marginTop: 20,
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
        fontSize: 18,
        fontWeight: 'bold',
    },
    input: {
        width: '80%',
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
    },
    modalButton: {
        backgroundColor: '#593C9D',
        padding: 10,
        borderRadius: 5,
        width: '45%',
        alignItems: 'center',
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
