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
import { ToastService } from '../components/ToastMessage';


const { base_url } = require("../../config");

const ResetPasswordScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");

  const sendCode = () => {
    if (email) {
      // Logic to send the 6-digit code to the user's email
      console.log(`Sending code to: ${email}`);
      requestResetPassword(email, navigation);
    } else {
      ToastService.show('info', '', 'Please enter your email.', 2000);
    }
  };

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
        <Text style={styles.title}>Reset Password</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your email"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />
        {/* <Button title="Send Code" onPress={sendCode} /> */}
        <TouchableOpacity style={styles.resetButton} onPress={sendCode}>
          <Text style={styles.resetButtonText}>Send Code</Text>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};

const requestResetPassword = (email, navigation) => {
    fetch(`${base_url}/reset-password/request?email=${email}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
      .then((response) => {
        if (response.ok) {
          return response.json(); // Parse the response as JSON if successful
        } else {
          return response.json().then((errorData) => {
            throw new Error(errorData.detail || 'Failed to send reset code');
          });
        }
      })
      .then((data) => {
        console.log('Reset password request sent successfully:', data);
        navigation.navigate("NewPassword");
        ToastService.show('success', '', 'A reset code has been sent to your email.', 3000);
      })
      .catch((error) => {
        ToastService.show('error', '', error.message, 3000);
      });
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
    fontSize: 28,
    fontWeight: "bold",
    color: "#4CAF50",
    marginBottom: 30,
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

export default ResetPasswordScreen;
