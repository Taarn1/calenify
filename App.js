import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, set, push, onValue, remove } from 'firebase/database';

import HomeScreen from './screens/HomeScreen';
import AddEventScreen from './screens/AddEventScreen';
import StackComponent from './components/StackComponent';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBAJHyzdVPzKEjF7yHzHWZBK0sgnh2PySA",
  authDomain: "calenify-3bb1e.firebaseapp.com",
  projectId: "calenify-3bb1e",
  storageBucket: "calenify-3bb1e.appspot.com",
  messagingSenderId: "42782221228",
  databaseURL: "https://calenify-3bb1e-default-rtdb.europe-west1.firebasedatabase.app",
  appId: "1:42782221228:web:5dae10957178e37f7c9009"
};




const Tab = createBottomTabNavigator();

let db;
if (getApps().length < 1) {
const app = initializeApp(firebaseConfig);
db = getDatabase(app);
console.log("Firebase On!");
} else {
db = getDatabase();
console.log("Firebase already running!");
}

export default function App() {

  const [events, setEvents] = useState([]);
  const [showEarlyEvents, setShowEarlyEvents] = useState(false);

  useEffect(() => {
    const eventsRef = ref(db, 'events');
    onValue(eventsRef, (snapshot) => {
      const data = snapshot.val();
      const eventsList = data ? Object.keys(data).map(key => ({ id: key, ...data[key] })) : [];
      setEvents(eventsList);
    });
  }, []);

  const deleteEvent = (eventId) => {
    const eventRef = ref(db, `events/${eventId}`);
    remove(eventRef);
  };

  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="Hjem">
          {(props) => (
            <HomeScreen
              {...props}
              events={events}
              deleteEvent={deleteEvent}
              showEarlyEvents={showEarlyEvents}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Nyt event">
          {(props) => <AddEventScreen {...props}/>}
        </Tab.Screen>
        <Tab.Screen name="Detaljer">
          {(props) => (
            <StackComponent
              {...props}
              showEarlyEvents={showEarlyEvents}
              setShowEarlyEvents={setShowEarlyEvents}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}