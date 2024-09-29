import React, { useState } from 'react';
import { View, TextInput, Button, Text, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Platform } from 'react-native';
import { getDatabase, ref, push, set } from 'firebase/database'; // Import Firebase Database functions

export default function AddEventScreen({ navigation}) {
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

    const handleSubmit = () => {  
    if (title.length === 0 || date.length === 0 || description.length === 0) {
      return Alert.alert('Udfyld alle felter!');
    }
  
    const newEvent = {
      title,
      date: date.toISOString().split('T')[0], // Format date to YYYY-MM-DD
      description,
    };
  
    try {
      uploadEventToFirebase(newEvent); // Upload event to Firebase
      navigation.navigate('Hjem'); // Navigate back to Home tab
      setTitle('');
      setDate('');
      setDescription('');
    } catch (error) {
      console.error(`Error: ${error.message}`);
      Alert.alert('Der opstod en fejl ved gemning af begivenheden.');
    }
  };

  const uploadEventToFirebase = async (event) => {
    const db = getDatabase();
    const eventsRef = ref(db, 'events');
    const newEventRef = push(eventsRef);
    await set(newEventRef, event);
  };

  const handleDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || date;
    setShowDatePicker(Platform.OS === 'ios');
    setDate(currentDate);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Opret Begivenhed</Text>
      <View style={{ marginBottom: 10 }}>
        <Button title="Vælg Dato" onPress={() => setShowDatePicker(true)} />
        {showDatePicker && (
          <DateTimePicker
            value={date || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
          />
        )}{date ? (
          <Text style={{ marginTop: 10 }}>Valgt Dato: {date.toDateString()}</Text>
        ) : null}
        
      </View>
      <TextInput
        placeholder="Titel"
        value={title}
        onChangeText={setTitle}
        style={{ borderWidth: 1, marginBottom: 10, padding: 5 }}
      />
      <TextInput
        placeholder="Beskrivelse"
        value={description}
        onChangeText={setDescription}
        style={{ borderWidth: 1, marginBottom: 20, padding: 5 }}
      />
      <Button title="Tilføj Begivenhed" onPress={handleSubmit} />
    </View>
  );
}