// Import necessary libraries and components
import { Camera, CameraType } from 'expo-camera/legacy';
import { useState, useRef, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TouchableOpacity, View, Image, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function CameraTest({ navigation }) {
  const [type, setType] = useState(CameraType.back);
  const [permission, requestPermission] = Camera.useCameraPermissions();
  const [imagesArr, setImagesArr] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gallery, setGallery] = useState(false);
  const cameraRef = useRef();

  // Use effect to handle permissions asynchronously
  useEffect(() => {
    if (!permission) {
      requestPermission();
    }
  }, [permission]);

  // Early return if permission is not granted
  if (!permission || !permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera</Text>
        <Button onPress={requestPermission} title="Grant Permission" />
      </View>
    );
  }
  // Load images from AsyncStorage
  const loadImages = async () => {
    try {
        const savedImages = await AsyncStorage.getItem('savedImages');
        if (savedImages) {
            setImagesArr(JSON.parse(savedImages));
        }
    } catch (error) {
        console.error("Error loading images from AsyncStorage: ", error);
    }
  }; 

  const snap = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
        //takes the picture
        const result = await cameraRef.current.takePictureAsync();

        // Check if the result contains a URI
        if (!result.uri) {
            throw new Error("Image URI is undefined");
        }

        // Update the images array with the new image
        const imageUri = result.uri;
        const updatedImagesArr = [...imagesArr, { uri: imageUri }];
        setImagesArr(updatedImagesArr);

        // Save the updated images array to AsyncStorage
        await AsyncStorage.setItem('savedImages', JSON.stringify(updatedImagesArr));

        loadImages();// Load images from AsyncStorage because app crashed when using useEffect(() =>...

    } catch (error) {
        console.error("Error capturing image: ", error);
    } finally {
      // Reset the loading state
        setLoading(false);
    }
  };
  //gallery component. Could be moved to a separate file
  const CameraGallery = () => (
    <View style={styles.gallery}>
      <Text style={styles.buttonGallery}>Billeder taget: {imagesArr.length}</Text>
      <ScrollView horizontal>
        {imagesArr.length > 0 ? /*Terinary check if there are any images in the array*/
        (
          imagesArr.map((image, index) => (
            <TouchableOpacity
              key={index}
              style={styles.imageContainer}
              onPress={() => navigation.navigate('ImageScreen', { image: image.uri })}
            >
              <Image source={{ uri: image.uri }} style={styles.galleryImage} />
            </TouchableOpacity>
          ))
        ) : (
          <Text style={{ color: "white" }}>Ingen billeder taget</Text>
        )}
      </ScrollView>
    </View>
  );

  //we fancy
  const toggleCameraType = () => {
    setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
  };

  const toggleGallery = () => {
    loadImages();//load images from AsyncStorage on press, might be a better way to do this but it works
    setGallery(current => !current);
  };

  return (
    <SafeAreaView style={styles.safeview}>
      <View style={styles.container}>
        <Camera style={styles.camera} type={type} ref={cameraRef}>
          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.flipbtn} onPress={toggleCameraType}>
              <Ionicons name="camera-reverse-outline" size={32} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.snapbtn} onPress={snap}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.text}>Tag billede</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={styles.gallerybtn} onPress={toggleGallery}>
              <Ionicons name="copy-outline" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </Camera>
        {gallery && <CameraGallery />}
      </View>
      <StatusBar style="light" />
    </SafeAreaView>
  );
}

//move to styles folder todo
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    width: '100%',
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: '100%',
    justifyContent: 'flex-end',
  },
  buttonContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    margin: 32,
    alignSelf: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
  },
  buttonGallery: {
    fontSize: 15,
    color: "white",
    padding: 10,
    borderRadius: 10,
  },
  gallery: {
    flex: 0.2,
    paddingTop: 10,
    width: "100%",
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black',
  },
  safeview: {
    backgroundColor: 'black',
    flex: 1,
    width: '100%',
  },
  snapbtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    height: 80,
    width: 80,
    borderRadius: 100,
    padding: 10,
    margin: 5,
    borderWidth: 4,
    borderColor: 'white',
    justifyContent: 'center',
  },
  flipbtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    padding: 5,
    justifyContent: 'center',
  },
  gallerybtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 100,
    padding: 5,
    justifyContent: 'center',
  },
  imageContainer: {
    paddingHorizontal: 10,
  },
  galleryImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
  },
});
