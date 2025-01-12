import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"; // Icons library
import LoadingScreen from "./LoadingScreen";
import { ToastService } from '../components/ToastMessage';


const NewPasswordScreen = ({ navigation, route }) => {
  const token = route?.params?.token;
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);


  const resetPassword = async () => {
    if (code.length === 6 && newPassword === confirmPassword && newPassword.length > 6) {
      // Logic to update the user's password
      console.log("Password reset successful!");
      setLoading(true);
      await confirmResetPassword(code, newPassword, navigation);
      setLoading(false);
    } else {
      ToastService.show('warning', null, 'Passwords do not match or are too short.', 2000);
      setLoading(false);
    }
  };

  if (loading) {
    // Display a loading indicator while fetching user details
    return <LoadingScreen message="Updating your password.. Please Wait" />;
  }

  return (
    <ImageBackground
      source={require("../../assets/images/background.png")}
      style={{ width: "100%", height: "100%" }}
    >
      {/* Back Button*/}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
      >
        {/* <Text style={styles.backButtonText}>Back</Text> */}
        <Icon name="chevron-left" size={24} color="#dbdbdb" />
      </TouchableOpacity>

      <View style={styles.container}>
        <Text style={styles.title}>Enter Verification Code and Create New Password</Text>
        <TextInput
          style={styles.input}
          placeholder="6-digit code"
          keyboardType="number-pad"
          value={code}
          onChangeText={setCode}
        />
        {/* <Text style={styles.title}>Create New Password</Text> */}
        <TextInput
          style={styles.input}
          placeholder="New Password"
          secureTextEntry
          value={newPassword}
          onChangeText={setNewPassword}
        />
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        {/* <Button title="Reset Password" onPress={resetPassword} /> */}
        <TouchableOpacity style={styles.resetButton} onPress={resetPassword}>
          <Text style={styles.resetButtonText}>Reset Password</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const confirmResetPassword = async (token, newPassword, navigation) => {
  return await fetch(
    `https://fitbuddy-0n9o.onrender.com/reset-password/confirm?token=${encodeURIComponent(
      token
    )}&new_password=${encodeURIComponent(newPassword)}`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    }
  )
    .then((response) => {
      if (response.ok) {
        return response.json(); // Parse the response as JSON if successful
      } else {
        return response.json().then((errorData) => {
          throw new Error(errorData.detail || "Failed to reset the password");
        });
      }
    })
    .then((data) => {
      navigation.navigate("Login");
      ToastService.show('success', null, data.message, 3000);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      ToastService.show('error', null, error.message, 2000);
    })
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  backButton: {
    zIndex: 2,
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#000",
    padding: 10,
    borderRadius: 5,
  },
  backButtonText: {
    color: "#fff",
    fontSize: 16,
  },
  resetButton: {
    width: "100%",
    height: 50,
    backgroundColor: "#4CAF50",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  resetButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  title: {
    fontSize: 18,
    // fontWeight: "bold",
    color: "#dbdbdb",
    marginBottom: 30,
    paddingHorizontal: 10
  },
  input: {
    width: "100%",
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#ccc",
  },
});

export default NewPasswordScreen;
