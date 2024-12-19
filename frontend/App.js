import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import WelcomeScreen from "./src/screens/welcomeScreen";
import GenderScreen from "./src/screens/GenderScreen";
import GoalScreen from "./src/screens/GoalScreen";
import TargetAreaScreen from "./src/screens/TargetAreaScreen";
import Dashboard from "./src/screens/Dashboard";
import Warmups from "./src/screens/Warmups";
import Login from "./src/screens/LoginScreen";
import SignUp from "./src/screens/SignupScreen";
import WorkoutsTab from "./src/screens/WorkoutsTab";
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();

export default function App() {
  const [token, setToken] = useState();
  const [workoutFlag, setWorkoutFlag] = useState();
  const [loading, setLoading] = useState(true); // Add a loading state

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const token = await AsyncStorage.getItem("auth_token");
        const workoutFlag = await AsyncStorage.getItem(
          "selectedBodyPartsAdded"
        );
        const selectedBodyPartsAdded = workoutFlag === null ? false : JSON.parse(workoutFlag);

        if (token) setToken(token);
        if (selectedBodyPartsAdded) setWorkoutFlag(selectedBodyPartsAdded);

      } catch (error) {
        console.error("Error fetching user details", error);
      } finally {
        setLoading(false); // Mark loading as complete
      }
    };

    fetchUserDetails();
  }, []);

  if (loading) {
    // Display a loading indicator while fetching user details
    return <LoadingIndicator />;
  }
  
  const landingPage = token ?  (workoutFlag ? "Dashboard": "Gender") : "Welcome";
  
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName= {landingPage}
        screenOptions={{
          headerShown: false, // Hide the header for a fullscreen experience
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="TargetAreaScreen" component={TargetAreaScreen} />
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="Warmups" component={Warmups} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="WorkoutsTab" component={WorkoutsTab} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function LoadingIndicator() {
  return <div>Loading...</div>;
}
