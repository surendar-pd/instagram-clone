import firebase from 'firebase'
const firebaseConfig = {
    apiKey: "AIzaSyCQ2hd-g0FF8jqDTKRRmjk61QW8HWZgfqM",
    authDomain: "instagram-clone-c4735.firebaseapp.com",
    projectId: "instagram-clone-c4735",
    storageBucket: "instagram-clone-c4735.appspot.com",
    messagingSenderId: "428039441387",
    appId: "1:428039441387:web:545a8f62eefa495d1d67ae",
    measurementId: "G-2WZ2SPNR90"
};
const firebaseApp = firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const provider = new firebase.auth.GoogleAuthProvider();
export const db = firebaseApp.firestore();
export const storage = firebase.storage();