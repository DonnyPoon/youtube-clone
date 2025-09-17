import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
    getAuth,
    signInWithPopup, 
    GoogleAuthProvider,
    onAuthStateChanged,
    User    
} from "firebase/auth"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB5aNHPTQhznKuZUeKHfV8vneLePRBWTUw",
  authDomain: "yt-clone-8f245.firebaseapp.com",
  projectId: "yt-clone-8f245",
  appId: "1:311334182152:web:a6627b92d55cb6037620bd",
  measurementId: "G-1TFRWF34KP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

/**
 * Signs the user in with a Google popup.
 * @returns A promise that resolves with the user's credentials.
 */
export function signInWithGoogle(){
    return signInWithPopup(auth, new GoogleAuthProvider());
}

/**
 * Signs the user out.
 * @returns A promise that resolves when the user is signed out.
 */
export function signOut() {
    return auth.signOut();
}

/**
 * Trigger a callback when user auth state changes.
 * @returns A function to unsubscribe callback.
 */
export function onAuthStateChangedHelper(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}