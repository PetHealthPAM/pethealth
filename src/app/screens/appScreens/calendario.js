import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Calendar } from "react-native-calendars";
import { AntDesign, Feather } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  addDoc,
  query,
  where,
} from "firebase/firestore";
import { db, auth } from "../../config/firebaseConfig";
import Fonts from "../../utils/Fonts";

export default function Calendario() {
  const [selectedDate, setSelectedDate] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [events, setEvents] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [eventType, setEventType] = useState("");
  const [pets, setPets] = useState([]);
  const [selectedPet, setSelectedPet] = useState("");
  const [searchTerm, setSearchTerm] = useState('');
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const today = new Date().toISOString().split("T")[0];

  const navigation = useNavigation();
  const userId = auth.currentUser.uid;

  const data = [
    { id: '1', name: 'Calendário', route: 'calendario' },
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

  useEffect(() => {
    const fetchPets = async () => {
      try {
        const petsRef = collection(db, "pets");
        const querySnapshot = await getDocs(petsRef);
        const petList = querySnapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data() }))
          .filter((pet) => pet.ownerId === userId && !pet.isDeleted);
        setPets(petList);
      } catch (error) {
        console.error("Erro ao buscar pets:", error);
      }
    };

    const fetchEvents = async () => {
      try {
        const eventsRef = collection(db, "events");
        const q = query(eventsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        const fetchedEvents = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setEvents(fetchedEvents);
      } catch (error) {
        console.error("Erro ao buscar eventos:", error);
      }
    };

    fetchPets();
    fetchEvents();
  }, [userId, modalVisible]);

  const addEvent = async () => {
    if (selectedPet) {
      try {
        const docRef = await addDoc(collection(db, "events"), {
          type: eventType,
          date: selectedDate,
          petId: selectedPet,
          userId: userId,
        });
        const newEvent = {
          type: eventType,
          date: selectedDate,
          id: docRef.id,
          petId: selectedPet,
        };
        setEvents((prevEvents) => [...prevEvents, newEvent]);
        resetModal();
      } catch (error) {
        console.error("Erro ao adicionar evento: ", error);
      }
    } else {
      Alert.alert("Erro", "O pet deve ser selecionado.");
    }
  };

  const resetModal = () => {
    setEventType("");
    setSelectedPet("");
    setModalVisible(false);
  };

  const confirmRemoveEvent = (eventId) => {
    Alert.alert(
      "Remover Evento",
      "Você tem certeza que deseja remover este evento?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Remover",
          onPress: () => removeEvent(eventId),
          style: "destructive",
        },
      ],
      { cancelable: true }
    );
  };

  const removeEvent = async (eventId) => {
    try {
      await deleteDoc(doc(db, "events", eventId));
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.error("Erro ao remover evento: ", error);
    }
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setModalVisible(true);
  };

  const renderEvent = ({ item }) => {
    const pet = pets.find((pet) => pet.id === item.petId);
    return (
      <View style={styles.eventContainer}>
        <TouchableOpacity
          onPress={() => {
            setSelectedEvent(item);
            setEventDetailsVisible(true);
          }}
          style={styles.eventDetails}
        >
          <Text style={styles.eventText}>
            {item.type} - {item.date}
          </Text>
          {pet && (
            <Image
              source={getPetImage(pet.species, pet.gender)}
              style={styles.petPhoto}
            />
          )}
        </TouchableOpacity>
        <TouchableOpacity onPress={() => confirmRemoveEvent(item.id)}>
          <Feather name="trash-2" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
    );
  };

  const getPetImage = (species, gender) => {
    if (species === "dog") {
      return gender === "male"
        ? require("../../../../assets/img/cachorro.png")
        : require("../../../../assets/img/cachorrofemale.png");
    } else if (species === "cat") {
      return gender === "male"
        ? require("../../../../assets/img/gatow.png")
        : require("../../../../assets/img/gatofemale.png");
    }
  };

  const customMarkedDates = {
    [today]: { selected: true, selectedColor: "#593C9D" },
  };

  events.forEach((event) => {
    customMarkedDates[event.date] = {
      marked: true,
      dotColor: "#F49B42",
      selected: event.date === today,
      selectedColor: event.date === today ? "#593C9D" : undefined,
    };
  });

  const getPetDetails = (petId) => {
    return pets.find((pet) => pet.id === petId);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TextInput
          placeholder="Buscar..."
          value={searchTerm}
          onChangeText={setSearchTerm}
          style={styles.searchInput}
        />
      </View>
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
      <Calendar
        onDayPress={handleDayPress}
        markedDates={customMarkedDates}
        
        theme={{
          arrowColor: "#593C9D",
          monthTextColor: "#593C9D",
          textSectionTitleColor: "#593C9D",
          selectedDayBackgroundColor: "#593C9D",
          todayTextColor: "#593C9D",
          textDayFontWeight: "bold",
          textMonthFontWeight: "bold",
          textDayHeaderFontSize: 14,
          textMonthFontSize: 16,
        }}
      />
      <FlatList
        data={events.filter(event =>
          event.type.toLowerCase().includes(searchQuery.toLowerCase())
        )}
        keyExtractor={(item) => item.id}
        renderItem={renderEvent}
        contentContainerStyle={[styles.eventList, { paddingBottom: 90 }]}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <Text style={styles.listHeader}>Seus Eventos</Text>
          </View>
        }
        contentInset={{ bottom: 90 }}
      />
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackground}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Adicionar Evento</Text>
            <Picker
              selectedValue={eventType}
              style={styles.picker}
              onValueChange={(itemValue) => setEventType(itemValue)}
            >
              <Picker.Item label="Selecione uma opção" value="" />
              <Picker.Item label="Banho" value="banho" />
              <Picker.Item label="Tosa" value="tosa" />
              <Picker.Item label="Veterinário" value="veterinário" />
              <Picker.Item label="Comprar Ração" value="ração" />
            </Picker>
            <ScrollView style={styles.petScrollView}>
              {pets.length > 0 ? (
                pets.map((pet) => (
                  <TouchableOpacity
                    key={pet.id}
                    onPress={() => setSelectedPet(pet.id)}
                    style={[
                      styles.petContainer,
                      selectedPet === pet.id && styles.selectedPetContainer,
                    ]}
                  >
                    <Image
                      source={getPetImage(pet.species, pet.gender)}
                      style={styles.petImage}
                    />
                    <Text style={styles.petName}>{pet.name}</Text>
                  </TouchableOpacity>
                ))
              ) : (
                <Text style={styles.noPetsText}>Nenhum pet encontrado.</Text>
              )}
            </ScrollView>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: "gray" }]}
                onPress={resetModal}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={addEvent}
              >
                <Text style={styles.modalButtonText}>Adicionar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
      {selectedEvent && (
  <Modal
    animationType="slide"
    transparent={true}
    visible={eventDetailsVisible}
    onRequestClose={() => setEventDetailsVisible(false)}
  >
    <View style={styles.modalBackground}>
      <View style={styles.modalView}>
        <Text style={styles.modalTitle}>Detalhes do Evento</Text>
        {selectedEvent && (
          <>
            <Text style={styles.eventDetailText}>
              Tipo: {selectedEvent.type}
            </Text>
            <Text style={styles.eventDetailText}>
              Data: {selectedEvent.date}
            </Text>
            <Text style={styles.eventDetailText}>
              Pet: {getPetDetails(selectedEvent.petId)?.name || "Desconhecido"}
            </Text>
          </>
        )}
        <TouchableOpacity
          style={[styles.modalButton2, { backgroundColor: "gray" }]}
          onPress={() => setEventDetailsVisible(false)}
        >
          <Text style={[styles.modalButtonText2, { color: "white" }]}>Fechar</Text>
        </TouchableOpacity>
      </View>
    </View>
  </Modal>
)}

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
  favoritesButton: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
},
  calendar: {
    marginTop: 20,
  },
  eventList: {
    paddingHorizontal: 15,
    paddingBottom: 20,
  },
  headerContainer: {
    paddingVertical: 10,
  },
  listHeader: {
    fontSize: 22,
    fontFamily: Fonts["poppins-bold"],
    color: "#593C9D",
    marginLeft: 10,
  },
  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 2,
  },
  eventDetails: {
    flexDirection: "row",
    alignItems: "center",
  },
  shadowOffset: { width: 0, height: 2 },

eventText: {
    fontSize: 16,
    fontFamily: Fonts["poppins-regular"],
    color: "#333",
  },
  petPhoto: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginLeft: 10,
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    width: "90%",
    backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: Fonts["poppins-bold"],
    color: "#593C9D",
    marginBottom: 20,
  },
  picker: {
    width: "100%",
    marginVertical: 10,
  },
  petScrollView: {
    width: "100%",
    height: 100,
    marginVertical: 10,
  },
  petContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    marginVertical: 5,
    backgroundColor: "#F9F9F9",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 2 },
  },
  selectedPetContainer: {
    backgroundColor: "#AFA1C7",
  },
  petImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  petName: {
    fontSize: 16,
    fontFamily: Fonts["poppins-regular"],
  },
  noPetsText: {
    fontSize: 16,
    fontFamily: Fonts["poppins-regular"],
    color: "#999",
    textAlign: "center",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    backgroundColor: "#593C9D",
    padding: 10,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5,
  },
  modalButton2: {
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontFamily: Fonts["poppins-bold"],
    color: "#FFFFFF",
  },
  modalButtonText2: {
    fontSize: 16,
    fontFamily: Fonts["poppins-bold"],
    color: "#FFFFFF",
  },
  eventDetails: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  eventDetailText: {
    fontSize: 16,
    fontFamily: Fonts["poppins-regular"],
    marginVertical: 5,
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

