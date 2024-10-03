import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebaseConfig';
import * as ImagePicker from 'expo-image-picker';
import Fonts from "../../utils/Fonts";

const DOG_BREEDS_URL = 'https://api.thedogapi.com/v1/breeds';
const CAT_BREEDS_URL = 'https://api.thecatapi.com/v1/breeds';

const AdotarPet = ({ navigation }) => {
  const [imageUri, setImageUri] = useState(null);
  const [name, setName] = useState('');
  const [species, setSpecies] = useState('Cachorro');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [gender, setGender] = useState('Masculino');
  const [dogBreeds, setDogBreeds] = useState([]);
  const [catBreeds, setCatBreeds] = useState([]);
  const [breeds, setBreeds] = useState([]);

  useEffect(() => {
    const fetchDogBreeds = async () => {
      try {
        const response = await fetch(DOG_BREEDS_URL);
        const data = await response.json();
        setDogBreeds(data.map((breed) => breed.name));
      } catch (error) {
        console.error('Erro ao buscar raças de cachorros:', error);
      }
    };

    const fetchCatBreeds = async () => {
      try {
        const response = await fetch(CAT_BREEDS_URL);
        const data = await response.json();
        setCatBreeds(data.map((breed) => breed.name));
      } catch (error) {
        console.error('Erro ao buscar raças de gatos:', error);
      }
    };

    fetchDogBreeds();
    fetchCatBreeds();
  }, []);

  useEffect(() => {
    setBreeds(species === 'Cachorro' ? dogBreeds : catBreeds);
  }, [species, dogBreeds, catBreeds]);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleAddPet = async () => {
    try {
      const newPet = {
        name,
        species,
        breed,
        age,
        description,
        gender,
        imageUri: imageUri || 'https://via.placeholder.com/300',
        createdAt: new Date(),
      };

      await addDoc(collection(db, 'pets'), newPet);
      navigation.goBack();
    } catch (error) {
      console.error('Erro ao adicionar o pet:', error);
    }
  };

  const takePhoto = async () => {
    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.containervoltar}>
          <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
          <Text style={styles.txtvoltar}>Voltar</Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.title}>Adicionar Pet para Adoção!</Text>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <Text style={styles.addImageText}>Adicionar Foto do Pet</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={takePhoto} style={styles.cameraButton}>
          <Text style={styles.cameraButtonText}>Tirar Foto</Text>
        </TouchableOpacity>

        <TextInput
          placeholder="Nome do Pet"
          value={name}
          onChangeText={setName}
          style={styles.input}
        />

        <Picker
          selectedValue={gender}
          onValueChange={(itemValue) => setGender(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Masculino" value="Masculino" />
          <Picker.Item label="Feminino" value="Feminino" />
        </Picker>

        <Picker
          selectedValue={species}
          onValueChange={(itemValue) => setSpecies(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Cachorro" value="Cachorro" />
          <Picker.Item label="Gato" value="Gato" />
        </Picker>

        <Picker
          selectedValue={breed}
          onValueChange={(itemValue) => setBreed(itemValue)}
          style={styles.picker}
        >
          {breeds.map((breed, index) => (
            <Picker.Item key={index} label={breed} value={breed} />
          ))}
        </Picker>

        <TextInput
          placeholder="Idade do Pet"
          value={age}
          onChangeText={setAge}
          style={styles.input}
        />

        <TextInput
          placeholder="Breve descrição do Pet"
          value={description}
          onChangeText={setDescription}
          style={styles.input}
          multiline
        />

        <TouchableOpacity style={styles.addButton} onPress={handleAddPet}>
          <Text style={styles.addButtonText}>Adicionar Pet</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  containervoltar: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 20,
    marginLeft: 20,
  },
  BNTvoltar: {
    width: 30,
    height: 30,
    resizeMode: 'contain',
    marginTop: 10,
    marginLeft: 10,
  },
  title: {
    fontSize: 23,
    marginBottom: 20,
    marginLeft: 20,
    color: '#7E57C2',
    fontFamily: Fonts['poppins-black'],
  },
  txtvoltar: {
    fontFamily: Fonts['poppins-black'],
    fontSize: 16,
    color: '#7E57C2',
    marginTop: 5,
    textAlign: 'left',
  },
  scrollContainer: {
    padding: 15,
  },
  input: {
    height: 50,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    marginBottom: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    fontFamily: Fonts['poppins-regular'],
  },
  picker: {
    height: 50,
    marginBottom: 15,
    borderColor: '#BDBDBD',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 1,
    fontFamily: Fonts['poppins-regular'],
  },
  imagePicker: {
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    borderWidth: 1,
    borderColor: '#BDBDBD',
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    elevation: 1,
  },
  image: {
    width: 200,
    height: 200,
    borderRadius: 10,
  },
  addImageText: {
    color: '#888',
    fontSize: 16,
    fontFamily: Fonts['poppins-regular'],
  },
  cameraButton: {
    backgroundColor: '#7E57C2',
    padding: 10,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center',
    elevation: 2,
  },
  cameraButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontFamily: Fonts['poppins-black'],
  },
  addButton: {
    backgroundColor: '#7E57C2',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 3,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: Fonts['poppins-black'],
  },
});

export default AdotarPet;
