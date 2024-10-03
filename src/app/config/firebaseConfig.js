import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyDUuv-pDM6VA6Lr2MS_dzG8jCkRQyaAdOI",
  authDomain: "pethealth-f4472.firebaseapp.com",
  projectId: "pethealth-f4472",
  storageBucket: "pethealth-f4472.appspot.com",
  messagingSenderId: "139143332368",
  appId: "1:139143332368:web:1176321030afd765624095"
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage)
});
export const db = getFirestore(app);