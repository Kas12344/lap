
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAnalytics, type Analytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore"; // Added for Firestore

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDHZxrsg9-JzuiTNBvThViXN2whZMDuPNw",
  authDomain: "lapzen-whatsapp-cart.firebaseapp.com",
  projectId: "lapzen-whatsapp-cart",
  storageBucket: "lapzen-whatsapp-cart.firebasestorage.app",
  messagingSenderId: "268834899360",
  appId: "1:268834899360:web:4cc349a969d5f5932450c5"
  // measurementId is not in your provided config, so Analytics will not be initialized by default here
};

// Initialize Firebase
let app: FirebaseApp;
let analytics: Analytics | undefined;
let db: ReturnType<typeof getFirestore> | undefined;


if (typeof window !== 'undefined') {
  if (!getApps().length) {
    app = initializeApp(firebaseConfig);
    // Initialize Analytics only if measurementId is available and we are on the client side
    // @ts-ignore
    if (firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        console.error("Failed to initialize Firebase Analytics", e);
      }
    }
  } else {
    app = getApp();
    // Ensure analytics is initialized on subsequent loads if app already exists and measurementId is available
    // @ts-ignore
    if (firebaseConfig.measurementId) {
      try {
        analytics = getAnalytics(app);
      } catch (e) {
        // Analytics might already be initialized or measurementId is missing
      }
    }
  }
  // Initialize Firestore only on the client-side and if 'app' is available
  if (app) {
    db = getFirestore(app);
  }

} else {
  // Handle server-side initialization if necessary, or leave app undefined
  // For typical web app usage, Firebase is initialized client-side.
  // If you need server-side admin SDK, that's a different setup.
  // For server components/actions in Next.js that need Firebase Admin, that's a separate admin initialization.
  // For now, client-side 'db' will be used by client components and data fetching methods that run client-side.
  // Server actions will use admin SDK if they need direct DB access not through client.
}

// Export the initialized Firebase app and analytics instance
export { app, analytics, db };
