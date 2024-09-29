import { createStackNavigator } from '@react-navigation/stack';
import DetailsScreen from '../screens/DetailScreen';
import UserProfileScreen from '../screens/StackScreens/UserProfileScreen';
import AppDetailsScreen from '../screens/StackScreens/AppDetailsScreen';

const Stack = createStackNavigator();

export default function StackComponent({ showEarlyEvents, setShowEarlyEvents }) {
  return (
    <Stack.Navigator initialRouteName="Details Screen">
      <Stack.Screen name="Details Screen" component={DetailsScreen} />
      <Stack.Screen name="User Profile" component={UserProfileScreen} />
      <Stack.Screen name="App Details">
        {(props) => (
          <AppDetailsScreen
            {...props}
            showEarlyEvents={showEarlyEvents}
            setShowEarlyEvents={setShowEarlyEvents}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}