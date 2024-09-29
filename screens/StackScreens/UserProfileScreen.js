import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

export default function UserProfileScreen() {
  return (
    <View style={styles.container}>
      <Text>Ikke implementeret</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 10,
    borderColor: 'yellow',
  },
});