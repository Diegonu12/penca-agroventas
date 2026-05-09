import { initializeApp } from "https://www.gstatic.com/firebasejs/12.2.1/firebase-app.js";

import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
} from "https://www.gstatic.com/firebasejs/12.2.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBoKgpV_3YzlKmlUfFqPjF5oVqyiRW4G7w",
  authDomain: "penca-agroventas.firebaseapp.com",
  projectId: "penca-agroventas",
  storageBucket: "penca-agroventas.firebasestorage.app",
  messagingSenderId: "17137928235",
  appId: "1:17137928235:web:46b5f4e27a8f96f56c426e"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  collection,
  addDoc,
  getDocs,
  doc,
  setDoc,
  getDoc
};