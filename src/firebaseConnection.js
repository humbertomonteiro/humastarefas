import { initializeApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const firebaseConfig = {
    apiKey: "AIzaSyB9U5dBZ4wPbg1XXxvMH0LL6v4AWnYpKDc",
    authDomain: "curso-37b39.firebaseapp.com",
    projectId: "curso-37b39",
    storageBucket: "curso-37b39.appspot.com",
    messagingSenderId: "990234454038",
    appId: "1:990234454038:web:ac14bc825144e374296d37",
    measurementId: "G-P8D9GD6JZL"
};

const firebaseApp = initializeApp(firebaseConfig)

const db = getFirestore(firebaseApp)
const auth = getAuth(firebaseApp)

export { db, auth }