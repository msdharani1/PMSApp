import { initializeApp } from 'firebase/app';
import { firebaseConfig } from './firebaseConfig';


// Initialize Firebase app
const app = initializeApp(firebaseConfig);

export default app;
