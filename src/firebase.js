import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, signOut} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore, collection, addDoc} from "firebase/firestore";
import { getStorage } from "firebase/storage";

  // Your web app's Firebase configuration
const config = {
    apiKey: "AIzaSyBcNkBmeBPpiQnP5oqaueXTQ5SSFBcH6hc",
    authDomain: "meals-40a7a.firebaseapp.com",
    databaseURL: "https://meals-40a7a-default-rtdb.firebaseio.com",
    projectId: "meals-40a7a",
    storageBucket: "meals-40a7a.appspot.com",
    messagingSenderId: "1039203497926",
    appId: "1:1039203497926:web:047e024ba4bfc5e305a4c7"
};

const app = initializeApp(config);
export const db = getDatabase(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

if (auth && auth.settings) {
    auth.settings.appVerificationDisabledForTesting = true
}

export const logInWithEmailAndPassword = async (email, password, onError) => {
    try {
        await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
        onError(err.message)
    }
};

// export const registerWithEmailAndPassword = async (name, email, password) => {
//     try {
//       const res = await createUserWithEmailAndPassword(auth, email, password);
//       const user = res.user;
//       await addDoc(collection(db, "users"), {
//             uid: user.uid,
//             name,
//             authProvider: "local",
//             email,
//       });
//     } catch (err) {
//         console.error(err);
//         alert(err.message);
//     }
//   };


export const sendPasswordReset = async (email, onSuccess, onError) => {
    try {
        await sendPasswordResetEmail(auth, email);
        onSuccess()
    } catch (err) {
        console.error(err);
        onError(err.message)
    }
};

export const logout = onSuccess => {
    signOut(auth)
    .then(() => onSuccess())
};