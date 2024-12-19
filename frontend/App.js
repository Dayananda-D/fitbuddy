import React from "react";
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

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Dashboard"
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
