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
import { ToastService } from '../components/ToastMessage';

const EnterCodeScreen = ({ navigation }) => {
  const [code, setCode] = useState("");

  const verifyCode = () => {
    if (code.length === 6) {
      // Logic to verify the code
      console.log(`Verifying code: ${code}`);
      navigation.navigate("NewPassword", {token: code});
    } else {
      ToastService.show('warning', null, 'Please enter a valid 6-digit code.', 2000);
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
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>


    <View style={styles.container}>
      <Text style={styles.title}>Enter Verification Code</Text>
      <TextInput
        style={styles.input}
        placeholder="6-digit code"
        keyboardType="number-pad"
        value={code}
        onChangeText={setCode}
      />
      {/* <Button title="Verify Code" onPress={verifyCode} /> */}
      <TouchableOpacity style={styles.resetButton} onPress={verifyCode}>
          <Text style={styles.resetButtonText}>Verify Code</Text>
        </TouchableOpacity>
    </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 16 },
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

export default EnterCodeScreen;
