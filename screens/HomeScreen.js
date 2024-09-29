import React from 'react';
import { View, Text, Button, FlatList } from 'react-native';

const HomeScreen = ({ events, deleteEvent, showEarlyEvents }) => {
  // Sorter begivenheder baseret på dato
  const sortedEvents = [...events].sort((a, b) => new Date(a.date) - new Date(b.date));

  // Filtrer tidlige begivenheder, hvis flaget er sat
  const filteredEvents = showEarlyEvents
    ? sortedEvents.filter(event => new Date(event.date) > new Date()) // Tidligere begivenheder
    : sortedEvents;

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Begivenheder</Text>

      {filteredEvents.length === 0 ? (
        <Text>Ingen begivenheder endnu.</Text>
      ) : (
        <FlatList
          data={filteredEvents}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={{ padding: 10, marginVertical: 10, backgroundColor: '#eee' }}>
              <Text style={{ fontSize: 18 }}>{item.title}</Text>
              <Text>{item.date}</Text>
              <Text>{item.description}</Text>
              <Button title="Slet event" onPress={() => deleteEvent(item.id)} />
            </View>
          )}
        />
      )}
    </View>
  );
};

export default HomeScreen;