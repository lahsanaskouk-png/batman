import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: process.env.AIzaSyBmOOERF0KkDQ7G08L7_F7TuM7SItkoO_o,
  authDomain: process.env.brtiol.firebaseapp.com,
  projectId: process.env.brtiol,
  storageBucket: process.env.brtiol.firebasestorage.app,
  messagingSenderId: process.env.711908351848,
  appId: process.env.1:711908351848:web:a6c1ac4836988c4a7340dd
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
