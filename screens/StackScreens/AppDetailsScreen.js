import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import ButtonComponent from '../../components/ButtonComponent';

export default function AppDetailsScreen({ showEarlyEvents, setShowEarlyEvents }) {
  return (
    <View style={styles.container}>
      <ButtonComponent 
        onPress={() => setShowEarlyEvents(!showEarlyEvents)} // Skift tilstand
        title={showEarlyEvents ? "Vis tidlige begivenheder" : " Skjul tidlige begivenheder"} 
      />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 10,
    borderColor: 'red',
  },
});