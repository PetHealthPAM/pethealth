import { db } from '../config/firebaseConfig';
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore';

// Função para adicionar um pet ao Firestore
export const addPet = async (petData, userId) => {
    try {
        const petsCollection = collection(db, 'pets');
        await addDoc(petsCollection, { ...petData, userId });
    } catch (error) {
        console.error('Erro ao adicionar pet:', error);
    }
};

const DOG_BREEDS_API_URL = 'https://api.thedogapi.com/v1/breeds';
const CAT_BREEDS_API_URL = 'https://api.thecatapi.com/v1/breeds';


export const fetchDogBreeds = async () => {
    try {
        const response = await fetch(DOG_BREEDS_API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar raças de cães:', error);
        return [];
    }
};

export const fetchCatBreeds = async () => {
    try {
        const response = await fetch(CAT_BREEDS_API_URL);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Erro ao buscar raças de gatos:', error);
        return [];
    }
};

export const fetchUserPets = async (userId) => {
    try {
        const petsCollection = collection(db, 'pets');
        const q = query(petsCollection, where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const pets = [];
        querySnapshot.forEach((doc) => {
            pets.push({ id: doc.id, ...doc.data() });
        });
        return pets;
    } catch (error) {
        console.error('Erro ao buscar pets do usuário:', error);
        return [];
    }
};

