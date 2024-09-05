import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Alert,
  Modal,
  Button,
  ScrollView,
} from "react-native";
import { AntDesign, Feather, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { auth, db } from "../../config/firebaseConfig";
import { doc, getDoc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import Fonts from "../../utils/Fonts";

export default function Perfil({ navigation }) {
  const [nomeUser, setNomeUser] = useState("");
  const [image, setImage] = useState(null);
  const [emailUser, setEmailUser] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [gender, setGender] = useState("");
  const [userDoc, setUserDoc] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // Modal para ver imagem ampliada
  const [editNameMode, setEditNameMode] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDoc = doc(db, "Users", user.uid);
        const unsubscribe = onSnapshot(userDoc, (doc) => {
          if (doc.exists()) {
            const userData = doc.data();
            setNomeUser(userData.nome);
            setEmailUser(userData.email);
            setPhone(userData.phone || "");
            setAddress(userData.address || "");
            setCity(userData.city || "");
            setState(userData.state || "");
            setGender(userData.gender || "");
            setImage(userData.imageURL);
          } else {
            console.log("No such document!");
          }
        });
        setUserDoc(userDoc);
        return () => unsubscribe();
      }
    };

    fetchUserData();
  }, []);

  const saveUserInfo = async () => {
    try {
      await updateDoc(userDoc, {
        nome: nomeUser,
        email: emailUser,
        phone,
        address,
        city,
        state,
        gender,
      });
      Alert.alert("Informações atualizadas com sucesso!");
      setModalVisible(false);
      setEditNameMode(false);
    } catch (error) {
      console.error("Erro ao atualizar informações:", error);
      Alert.alert("Erro ao atualizar informações. Tente novamente.");
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    if (!result.canceled) {
      setImage(result.assets[0].uri);
      const userId = auth.currentUser.uid;
      await saveImageURLToFirestore(userId, result.assets[0].uri);
    }
  };

  
  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        Alert.alert("Você foi desconectado com sucesso.");
  
        navigation.reset({
          index: 0,
          routes: [{ name: 'Login' }],
        });
      })
      .catch((error) => {
        console.error("Erro ao sair:", error);
        Alert.alert("Erro ao sair. Tente novamente.");
      });
  };

  const saveImageURLToFirestore = async (userId, imageURL) => {
    try {
      const userRef = doc(db, "Users", userId);
      await updateDoc(userRef, {
        imageURL: imageURL,  // Aqui pode ser uma URL ou null
      });
      console.log("URL da imagem salva ou removida com sucesso no Firestore.");
    } catch (error) {
      console.error("Erro ao salvar ou remover a URL da imagem no Firestore:", error);
    }
  };
  

  const btnfavoritos = () => {
    navigation.navigate('Favoritos'); // O nome deve corresponder exatamente ao nome da tela no navegador
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TextInput
          style={styles.searchBar}
          placeholder="Pesquisar..."
        />
      </View>

      <Text style={styles.title}>Perfil</Text>
      <View style={styles.profileContainer}>
        <TouchableOpacity onPress={() => setImageModalVisible(true)}>
          {image ? (
            <Image source={{ uri: image }} style={styles.profileImage} />
          ) : (
            <Image
              source={require("../../../../assets/img/default-profile.jpg")}
              style={styles.profileImage}
            />
          )}
        </TouchableOpacity>
        <View style={styles.profileDetails}>
          <Text style={styles.userName}>{nomeUser}</Text>
          <TouchableOpacity
            onPress={() => {
              setEditNameMode(true);
              setModalVisible(true);
            }}
          >
            <Feather name="edit" size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.config}>
        <Text style={styles.titulo2}>Configurações</Text>
        </View>
      <View style={styles.settingsContainer}>
        <TouchableOpacity
          style={styles.settingItem}
          onPress={() => setModalVisible(true)}
        >
          <Ionicons name="person-outline" size={24} color="#000" />
          <Text style={styles.settingText}>Informações Pessoais</Text>
        </TouchableOpacity>
        <TouchableOpacity
  style={styles.settingItem}
  onPress={() => navigation.navigate('Pets')}
>
  <Ionicons name="paw-outline" size={24} color="#000" />
  <Text style={styles.settingText}>Meus Pets</Text>
</TouchableOpacity>
        <TouchableOpacity style={styles.settingItem} onPress={handleLogout}>
          <Ionicons name="exit-outline" size={24} color="#000" />
          <Text style={styles.settingText}>Sair</Text>
        </TouchableOpacity>
      </View>

      {/* Modal para edição do nome ou informações pessoais */}
      <Modal
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
          setEditNameMode(false);
        }}
      >
        <View style={styles.modalContainer}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>
      {editNameMode ? "Editar Nome" : "Editar Informações Pessoais"}
    </Text>
    <ScrollView contentContainerStyle={styles.scrollViewContent}>
      <View style={styles.formGroup}>
        <Text style={styles.formLabel}>Nome</Text>
        <TextInput
          style={styles.formInput}
          placeholder="Nome"
          value={nomeUser}
          onChangeText={setNomeUser}
        />
      </View>
      {!editNameMode && (
        <>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>E-mail</Text>
            <TextInput
              style={styles.formInput}
              placeholder="E-mail"
              value={emailUser}
              onChangeText={setEmailUser}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Telefone</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Telefone"
              value={phone}
              onChangeText={setPhone}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Endereço</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Endereço"
              value={address}
              onChangeText={setAddress}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Cidade</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Cidade"
              value={city}
              onChangeText={setCity}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Estado</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Estado"
              value={state}
              onChangeText={setState}
            />
          </View>
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Sexo</Text>
            <TextInput
              style={styles.formInput}
              placeholder="Sexo"
              value={gender}
              onChangeText={setGender}
            />
          </View>
        </>
      )}
      <View style={styles.modalButtons}>
        <Button
          title="Cancelar"
          onPress={() => {
            setModalVisible(false);
            setEditNameMode(false);
          }}
          color="gray" // Cor do botão "Cancelar"
        />
        <Button
          title="Salvar"
          onPress={saveUserInfo}
          color="#593C9D" // Cor do botão "Salvar"
        />
      </View>
    </ScrollView>
  </View>
</View>

      </Modal>

      {/* Modal para ver a imagem ampliada */}
      <Modal
  transparent={true}
  visible={imageModalVisible}
  onRequestClose={() => setImageModalVisible(false)}
>
  <View style={styles.modalContainer}>
    <View style={styles.imageModalContent}>
      <Image
        source={image ? { uri: image } : require("../../../../assets/img/default-profile.jpg")}
        style={styles.enlargedImage}
      />
      
      {/* Botão para editar a imagem */}
      <TouchableOpacity
        style={styles.pencilButton}
        onPress={() => {
          setImageModalVisible(false);
          pickImage();
        }}
      >
        <Feather name="edit-2" size={24} color="#fff" />
      </TouchableOpacity>

      {/* Botão "X" para remover a imagem */}
      <TouchableOpacity
        style={styles.removeButton}
        onPress={async () => {
          setImage(null);
          setImageModalVisible(false);
          await saveImageURLToFirestore(auth.currentUser.uid, null); // Remover a imagem no Firestore
        }}
      >
        <Feather name="x" size={24} color={'white'}/>
      </TouchableOpacity>

      {/* Botão para fechar o modal */}
      <Button
        title="Fechar"
        onPress={() => setImageModalVisible(false)}
        color="gray"
      />
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
          paddingHorizontal: 15,
        },
        searchBar: {
          flex: 1,
              height: 40,
              backgroundColor: '#fff',
              borderRadius: 20,
              paddingHorizontal: 15,
              marginLeft: 5,
              marginTop: 25,
              fontFamily: Fonts["poppins-regular"],
        },
        favoritesButton: {
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 5,
        },
  title: {
    fontSize: 28,
    fontFamily: Fonts['poppins-bold'],
    marginVertical: 20,
    marginLeft: 25,
  },
  titulo2: {
    fontSize: 16,
    fontFamily: Fonts['poppins-bold'],
    marginTop: 30,
    marginLeft: 15,
  },
  profileContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
    marginLeft: 20,
  },
  profileDetails: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  userName: {
    fontSize: 20,
    fontFamily: Fonts["poppins-regular"],
    marginRight: 10,
  },
  settingsContainer: {
    marginLeft: 20,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  settingText: {
    fontSize: 18,
    marginLeft: 10,
    fontFamily: Fonts["poppins-regular"],
  },
  modalContainer: {
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  flex: 1, 
},
modalContent: {
  width: "80%",
  backgroundColor: "#FFF",
  borderRadius: 10,
  padding: 10,
  maxHeight: '90%',
},
scrollViewContent: {
  flexGrow: 1,
},
modalTitle: {
  fontSize: 20,
  fontFamily: Fonts["poppins-regular"],
  marginBottom: 10,
},
formGroup: {
  marginBottom: 15,
  fontFamily: Fonts["poppins-regular"],
},
formLabel: {
  fontSize: 16,
  marginBottom: 5,
  fontFamily: Fonts["poppins-regular"],
},
formInput: {
  height: 40,
  borderColor: "#DDD",
  borderWidth: 1,
  borderRadius: 5,
  paddingHorizontal: 10,
},
modalButtons: {
  marginTop: 20,
  flexDirection: 'row',
  justifyContent: 'space-between',
},
  imageModalContent: {
    alignItems: "center",
  },
  enlargedImage: {
    width: 300,
    height: 300,
    borderRadius: 150,
    marginBottom: 20,
  },
  pencilButton: {
    position: "absolute",
    bottom: 40,
    right: 40,
    backgroundColor: "#593C9D",
    borderRadius: 20,
    padding: 10,
  },
  removeButton: {
    position: 'absolute',
    top: 20, // Ajuste conforme a necessidade
    right: 20, // Mantém o botão no canto superior direito
    backgroundColor: '#FF6347', // Cor de fundo vermelha (ou qualquer cor que combine com seu design)
    borderRadius: 50, // Torna o botão circular
    padding: 10, // Adiciona preenchimento para aumentar a área clicável
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5, // Sombras no Android
    shadowColor: '#000', // Cor da sombra no iOS
    shadowOffset: { width: 0, height: 2 }, // Posição da sombra no iOS
    shadowOpacity: 0.25, // Opacidade da sombra no iOS
    shadowRadius: 3.84, // Raio da sombra no iOS
    zIndex: 10, // Garante que o botão fique acima de outros elementos
  },
  removeIcon: {
    fontSize: 18, // Tamanho do ícone "X"
    color: '#FFF', // Cor do "X"
    fontWeight: 'bold', // Destaca o "X"
  },
  
});
