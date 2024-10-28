// ImageScreen.js
import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

export default function ImageScreen({ route }) {
  const { image } = route.params; 

  return (
    <View style={styles.container}>
      <Image
        source={{ uri: image }}
        style={styles.image}
      />
    </View>
  );
}

//move to styles folder todo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  image: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
});
