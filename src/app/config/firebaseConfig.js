// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDUuv-pDM6VA6Lr2MS_dzG8jCkRQyaAdOI",
  authDomain: "pethealth-f4472.firebaseapp.com",
  projectId: "pethealth-f4472",
  storageBucket: "pethealth-f4472.appspot.com",
  messagingSenderId: "139143332368",
  appId: "1:139143332368:web:1176321030afd765624095"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);