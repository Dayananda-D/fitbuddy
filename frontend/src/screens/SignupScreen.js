import React, { useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Alert,
    Image,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";

const googleLogo = require("../../assets/images/google.png");
const facebookLogo = require("../../assets/images/facebook.png");
const instagramLogo = require("../../assets/images/instagram.png");


const SignupScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const navigation = useNavigation();
    const handleSubmit = () => {
        // Basic validation
        if (!username || !email || !password) {
            Alert.alert("Error", "All fields are required!");
            return;
        }
        Alert.alert("Success", `Signed up successfully!\nUsername: ${username}`);
    };

    return (
        <ImageBackground source={require('../../assets/images/background.png')} style={{ width: '100%', height: '100%' }}>
            <View style={styles.container}>
                <Text style={styles.title}>Sign Up</Text>

                {/* Username Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                />

                {/* Email Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Date of Birth Picker */}
                <TouchableOpacity
                    style={styles.dobButton}
                    onPress={() => setShowDatePicker(true)}
                >
                    <Text style={styles.dobText}>
                        {dob ? dob.toLocaleDateString() : "Select DOB"}
                    </Text>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dob}
                        mode="date"
                        display="default"
                        onChange={(event, selectedDate) => {
                            setShowDatePicker(false);
                            if (selectedDate) setDob(selectedDate);
                        }}
                    />
                )}

                {/* Submit Button */}
                <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
                    <Text style={styles.submitButtonText}>Submit</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                {/* Link to Login */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Existing User?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("Login")}>
                        <Text style={styles.linkText}>Login</Text>
                    </TouchableOpacity>
                </View>

                {/* Social Login Buttons */}
                <View style={styles.socialLoginContainer}>
                    <TouchableOpacity
                        style={styles.socialButton}
                        onPress={() => handleSocialLogin("Google")}
                    >
                        <Image source={googleLogo} style={styles.socialIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.facebookButton]}
                        onPress={() => handleSocialLogin("Facebook")}
                    >
                        <Image source={facebookLogo} style={styles.socialIcon} />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.socialButton, styles.instagramButton]}
                        onPress={() => handleSocialLogin("Instagram")}
                    >
                        <Image source={instagramLogo} style={styles.socialIcon} />
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

export default SignupScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 20,
        color: "#4CAF50",
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
    dobButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    dobText: {
        color: "#666",
        fontSize: 16,
    },
    submitButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 20,
    },
    submitButtonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    orText: {
        fontSize: 16,
        color: "#fff",
        marginVertical: 20,
    },
    socialLoginContainer: {
        width: "50%",
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    socialButton: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 10,
        padding: 10,
        marginBottom: 10,
        justifyContent: "center",
    },
    socialIcon: {
        width: 20,
        height: 20,
        // marginRight: 10,
    },
    socialButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#333",
    },
    facebookButton: {
        backgroundColor: "#3b5998",
        borderColor: "#3b5998",
    },
    instagramButton: {
        backgroundColor: "#E1306C",
        borderColor: "#E1306C",
    },
    footer: {
        flexDirection: "row",
        padding: 15
    },
    footerText: {
        fontSize: 16,
        color: "#666",
    },
    linkText: {
        fontSize: 16,
        color: "#4CAF50",
        fontWeight: "bold",
        marginLeft: 5,
    },
});
