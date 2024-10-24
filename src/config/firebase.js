import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
    apiKey: "AIzaSyDcQU6h9Hdl_iABchuS3OvK-xKB44Gt43Y",
    authDomain: "erroops-93c8a.firebaseapp.com",
    projectId: "erroops-93c8a",
    storageBucket: "erroops-93c8a.appspot.com",
    messagingSenderId: "694707365976",
    appId: "1:694707365976:web:440ace5273d2c0aa4c022d"
};

// Inicializa o app Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa a autenticação com persistência de sessão usando AsyncStorage
const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
});

export { auth, db };
