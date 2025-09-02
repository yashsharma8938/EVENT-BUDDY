// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  deleteDoc, 
  updateDoc, 
  doc, 
  onSnapshot,
  query,
  orderBy 
} from "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyAm-9w1WaKCxCxD52cHOz3yKGxy6D5LbCc",
  authDomain: "gdg-event-buddy.firebaseapp.com",
  projectId: "gdg-event-buddy",
  storageBucket: "gdg-event-buddy.appspot.com",
  messagingSenderId: "26181504038",
  appId: "1:26181504038:web:5b653219f360b3b0476ae7",
  measurementId: "G-RH77DCY3QY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const eventNameInput = document.getElementById("eventName");
const eventDateInput = document.getElementById("eventDate");
const addEventBtn = document.getElementById("addEventBtn");
const eventList = document.getElementById("eventList");

// Add event
addEventBtn.addEventListener("click", async () => {
  const name = eventNameInput.value.trim();
  const date = eventDateInput.value;

  if (!name || !date) {
    alert("Please fill both fields");
    return;
  }

  await addDoc(collection(db, "events"), {
    name,
    date,
    completed: false
  });

  eventNameInput.value = "";
  eventDateInput.value = "";
});

// Real-time listener for events
const eventsQuery = query(collection(db, "events"), orderBy("date"));
onSnapshot(eventsQuery,(snapshot) => {
  eventList.innerHTML = ""; // Clear list
  snapshot.forEach((docSnap) => {
    const event = docSnap.data();

    const li = document.createElement("li");
    li.innerHTML = `
      <span style="text-decoration:${event.completed ? "line-through" : "none"}">
        ${event.name} - ${event.date}
      </span>
      <div class="actions">
        <button class="complete">✔</button>
        <button class="edit">✏</button>
        <button class="delete">❌</button>
      </div>
    `;

    // Complete button
    li.querySelector(".complete").addEventListener("click", async () => {
      await updateDoc(doc(db, "events", docSnap.id), { completed: !event.completed });
    });

    // Edit button
    li.querySelector(".edit").addEventListener("click", async () => {
      const newName = prompt("Edit name:", event.name);
      const newDate = prompt("Edit date:", event.date);
      if (newName && newDate) {
        await updateDoc(doc(db, "events", docSnap.id), {
          name: newName,
          date: newDate
        });
      }
    });

    // Delete button
    li.querySelector(".delete").addEventListener("click", async () => {
      await deleteDoc(doc(db, "events", docSnap.id));
    });

    eventList.appendChild(li);
  });
});
// Sprinkle stars when clicking Add Event
document.getElementById("addEventBtn").addEventListener("click", () => {
  for (let i = 0; i < 15; i++) {
    let star = document.createElement("div");
    star.classList.add("star");
    star.style.left = (window.innerWidth / 2 + Math.random() * 100 - 50) + "px";
    star.style.top = "120px";
    document.body.appendChild(star);

    setTimeout(() => {
      star.remove();
    }, 1200);
  }
});
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("heart");

  // Random horizontal position
  heart.style.left = Math.random() * window.innerWidth + "px";

  // Random size
  let size = Math.random() * 20 + 10;
  heart.style.width = size + "px";
  heart.style.height = size + "px";

  // Random animation duration
  heart.style.animationDuration = (Math.random() * 3 + 3) + "s";

  document.querySelector(".hearts-container").appendChild(heart);

  // Remove heart after animation
  setTimeout(() => {
    heart.remove();
  }, 6000);
}

// Keep generating hearts
setInterval(createHeart, 500);





