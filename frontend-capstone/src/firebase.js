// src/firebase.js
import { initializeApp } from "firebase/app";

const firebaseConfig = {
	apiKey: "AIzaSyCEsWmMkcSRvTa87BuD4RE8iLc8aUBt_aM",
	authDomain: "ipsi-f2028.firebaseapp.com",
	projectId: "ipsi-f2028",
	storageBucket: "ipsi-f2028.firebasestorage.app",
	messagingSenderId: "305570345529",
	appId: "1:305570345529:web:487dc019ded61a39c193e8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;
