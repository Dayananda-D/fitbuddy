import React, { useState, useEffect, Profiler } from "react";
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
import LoadingScreen from "./src/screens/LoadingScreen";
import Workouts from "./src/components/WorkoutScreen";
import Reports from "./src/screens/Reports";
import ProfileScreen from "./src/screens/ProfileScreen";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from "@expo/vector-icons";
import { View, Text, StyleSheet } from "react-native";

const Tab = createBottomTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Dashboard") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "WorkoutsTab") {
            iconName = focused ? "barbell" : "barbell-outline";
          } else if (route.name === "Reports") {
            iconName = focused ? "pulse" : "pulse-outline";
          } else if (route.name === "ProfileScreen") {
            iconName = focused ? "person" : "person-outline";
          }
          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: "#4CAF50",
        tabBarInactiveTintColor: "gray",
        headerShown: false,
        tabBarLabel: ({ focused }) => {
          // Optionally hide the text for a cleaner UI
          // return focused ? <Text style={styles.tabLabel}>{route.name}</Text> : null;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={Dashboard} />
      <Tab.Screen name="WorkoutsTab" component={WorkoutsTab} />
      <Tab.Screen name="Reports" component={Reports} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

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
    return <LoadingScreen message="Loading your activities..." />;
  }

  const landingPage = token ? (workoutFlag ? "Main" : "Welcome") : "Welcome";

  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName={landingPage}
        screenOptions={{
          headerShown: false, // Hide the header for a fullscreen experience
        }}
      >
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="Gender" component={GenderScreen} />
        <Stack.Screen name="Goal" component={GoalScreen} />
        <Stack.Screen name="TargetAreaScreen" component={TargetAreaScreen} />
        <Stack.Screen name="Main" component={MyTabs} />
        {/* <Stack.Screen name="Dashboard" component={Dashboard} /> */}
        <Stack.Screen name="Warmups" component={Warmups} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="Login" component={Login} />
        {/* <Stack.Screen name="WorkoutsTab" component={WorkoutsTab} /> */}
        {/* <Stack.Screen name="Reports" component={Reports} /> */}
        <Stack.Screen name="Workouts" component={Workouts} />
        {/* <Stack.Screen name="ProfileScreen" component={ProfileScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
    height: 40,
    backgroundColor: "#fff",
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 4,
  },
});