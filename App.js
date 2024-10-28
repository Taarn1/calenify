// App.js
import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, onValue, remove } from 'firebase/database';

import AddEventScreen from './screens/AddEventScreen';
import HomeStack from './components/HomeStackComponent'; //homescreen, camera, image
import StackComponent from './components/StackComponent'; //Detailscreen

const Tab = createBottomTabNavigator();

const firebaseConfig = {
  apiKey: "AIzaSyBAJHyzdVPzKEjF7yHzHWZBK0sgnh2PySA",
  authDomain: "calenify-3bb1e.firebaseapp.com",
  projectId: "calenify-3bb1e",
  storageBucket: "calenify-3bb1e.appspot.com",
  messagingSenderId: "42782221228",
  databaseURL: "https://calenify-3bb1e-default-rtdb.europe-west1.firebasedatabase.app",
  appId: "1:42782221228:web:5dae10957178e37f7c9009"
};

// Initialize Firebase
let db;
if (getApps().length < 1) {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
} else {
  db = getDatabase();
}

export default function App() {
  const [events, setEvents] = useState([]);
  const [showEarlyEvents, setShowEarlyEvents] = useState(false); // Flag to show/hide early events

  // Fetch events from Firebase Realtime Database
  useEffect(() => {
    // Reference to the 'events' node in the Firebase Realtime Database
    const eventsRef = ref(db, 'events');
  
    // Set up a listener for changes to the 'events' node
    const unsubscribe = onValue(
      eventsRef,
      (snapshot) => {
        // Get the data from the snapshot
        const data = snapshot.val();
  
        // Convert the data into an array of event objects
        const eventsList = data ? Object.keys(data).map((key) => ({ id: key, ...data[key] })) : []; 
  
        // Update the state with the new list of events
        setEvents(eventsList);
      },
      (error) => {
        console.error("Error fetching events:", error);
      }
    );
  
    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Function to delete an event by ID
  const deleteEvent = (eventId) => {
    const eventRef = ref(db, `events/${eventId}`);
    remove(eventRef)
      .then(() => console.log(`Event ${eventId} deleted`))
      .catch((error) => console.error("Error deleting event:", error));
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Hjem">
          {(props) => (
            <HomeStack {...props} events={events} deleteEvent={deleteEvent} showEarlyEvents={showEarlyEvents} />
          )}
        </Tab.Screen>
        <Tab.Screen name="Nyt event" component={AddEventScreen} />
        <Tab.Screen name="Detaljer" component={StackComponent} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}