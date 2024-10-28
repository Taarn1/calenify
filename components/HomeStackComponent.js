// HomeStack.js
import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import HomeScreen from '../screens/HomeScreen';
import CameraScreen from '../screens/CameraScreen';
import ImageScreen from '../screens/imageScreen';

const Stack = createStackNavigator();

// Stack Navigator for Home Screen and related components
export default function HomeStack({ events, deleteEvent, showEarlyEvents }) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeScreen">
        {(props) => (
          <HomeScreen {...props} events={events} deleteEvent={deleteEvent} showEarlyEvents={showEarlyEvents} />
        )}
      </Stack.Screen>
      <Stack.Screen name="CameraScreen" component={CameraScreen} />
      <Stack.Screen name="ImageScreen" component={ImageScreen} />
    </Stack.Navigator>
  );
}