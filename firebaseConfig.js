// firebaseConfig.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.1/firebase-app.js";

const firebaseConfig = {
    apiKey: "AIzaSyBWtr_ZwK8hfA1We-yq9uUOjw5C6wXhx0k",
    authDomain: "accessibleworld-7f599.firebaseapp.com",
    projectId: "accessibleworld-7f599",
    storageBucket: "accessibleworld-7f599.appspot.com",
    messagingSenderId: "264437218598",
    appId: "1:264437218598:web:cae58c1e578c7b08b815e7",
    measurementId: "G-1QRWXYRZ76"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);