// Firebase imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import {
    getFirestore,
    collection,
    addDoc,
    getDocs,
    query,
    where
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-firestore.js";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut
} from "https://www.gstatic.com/firebasejs/10.11.0/firebase-auth.js";

// Firebase config
const firebaseConfig = {
    apiKey: "AIzaSyD35G1K7gxBiG4byCryGtbs78b5294iTYk",
    authDomain: "gonzalez-team-f1.firebaseapp.com",
    projectId: "gonzalez-team-f1",
    storageBucket: "gonzalez-team-f1.appspot.com",
    messagingSenderId: "318954197346",
    appId: "1:318954197346:web:5f95420271ccdcdb8a5c3b"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();
const provider = new GoogleAuthProvider();

// DOM references
const form = document.getElementById("circuitForm");
const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

// Initialize map
const map = L.map("map").setView([20, 0], 2);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
}).addTo(map);

let currentUser = null;

// Auth state listener
onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        document.getElementById("loginStatus").textContent = `Welcome, ${user.displayName}`;
        loginBtn.style.display = "none";
        logoutBtn.style.display = "inline-block";
        form.style.display = "block";
        await loadCircuits();
    } else {
        currentUser = null;
        document.getElementById("loginStatus").textContent = "Please sign in to use the app";
        loginBtn.style.display = "inline-block";
        logoutBtn.style.display = "none";
        form.style.display = "none";
    }
});

// Login with Google
loginBtn.addEventListener("click", async () => {
    try {
        await signInWithPopup(auth, provider);
    } catch (error) {
        console.error("Login error:", error);
        alert("Login failed. Check the console for details.");
    }
});

// Logout
logoutBtn.addEventListener("click", async () => {
    try {
        await signOut(auth);
        location.reload();
    } catch (error) {
        console.error("Logout error:", error);
    }
});

// Load circuits from Firestore
async function loadCircuits() {
    try {
        const circuitsRef = collection(db, "circuits");
        const q = query(circuitsRef, where("uid", "==", currentUser.uid));
        const querySnapshot = await getDocs(q);

        querySnapshot.forEach((doc) => {
            const data = doc.data();
            const marker = L.marker([data.lat, data.lng]).addTo(map);
            marker.bindPopup(`<b>${data.name}</b><br>${data.country}`);
        });
    } catch (error) {
        console.error("Error loading circuits:", error);
    }
}

// Handle form submission
form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const lat = parseFloat(document.getElementById("lat").value);
    const lng = parseFloat(document.getElementById("lng").value);
    const country = document.getElementById("country").value;

    try {
        await addDoc(collection(db, "circuits"), {
            name,
            lat,
            lng,
            country,
            uid: currentUser.uid
        });
        alert("Circuit added!");
        location.reload(); // Reload to show new marker
    } catch (error) {
        console.error("Error adding circuit:", error);
        alert("Failed to add circuit. See console for details.");
    }
});
