import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { auth, db } from '../../config/firebaseConfig';
import { collection, query, where, getDocs } from 'firebase/firestore';
import Fonts from "../../utils/Fonts";

export default function Pets({ navigation }) { // Receba a prop de navegação
  const [pets, setPets] = useState([]);

  useEffect(() => {
    const fetchPets = async () => {
      const user = auth.currentUser;
      if (user) {
        const q = query(
          collection(db, 'Pets'),
          where('ownerId', '==', user.uid)
        );
        const querySnapshot = await getDocs(q);
        const petsData = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setPets(petsData);
      }
    };

    fetchPets();
  }, []);

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <View style={styles.containervoltar}>
          <Image source={require('../../../../assets/img/voltar.png')} style={styles.BNTvoltar} />
          <Text style={styles.txtvoltar}> Voltar </Text>
        </View>
      </TouchableOpacity>

      <Text style={styles.title}>Favoritos</Text>
      <FlatList
        data={pets}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.petContainer}>
            <Image source={{ uri: item.imageURL }} style={styles.petImage} />
            <Text style={styles.petName}>{item.name}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#7E57C2',
  },
  petContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  petImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 15,
  },
  petName: {
    fontSize: 18,
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
  containervoltar: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    marginBottom: 10,
    marginTop: 5,
  },
});
