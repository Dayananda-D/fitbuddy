import React, { useState, useRef, useEffect } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    Alert,
    Image,
    ImageBackground
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import LoadingScreen from "./LoadingScreen";
import { ToastService } from '../components/ToastMessage';

const { base_url } = require("../../config");
const googleLogo = require("../../assets/images/google.png");
const facebookLogo = require("../../assets/images/facebook.png");
const instagramLogo = require("../../assets/images/instagram.png");

const LoginScreen = ({ route }) => {
    const UserData = route?.params?.UserData || {};
    const [emailOrNumber, setEmailOrNumber] = useState("");
    const [password, setPassword] = useState("");
    const navigation = useNavigation();
    const [loading, setLoading] = useState(false);
    
    const handleLogin = () => {
        console.log(base_url);
        if (!emailOrNumber || !password) {
            ToastService.show('info', '', 'Please enter your username and password to log in.', 3000)
            return;
        }
        setLoading(true);
        fetch(`${base_url}/login`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                username: emailOrNumber,
                password: password
            }).toString()
        }).then(async response => {
            const responseData = await response.json();
            if (!response.ok) {
                throw new Error(responseData.detail);
            }
            return responseData;
        }).then(async data => {
            const { access_token, token_type } = data;
            // Save the token and token_type in AsyncStorage
            await AsyncStorage.setItem('auth_token', access_token);
            await AsyncStorage.setItem('token_type', token_type);
            const decodedToken = jwtDecode(access_token);

            await AsyncStorage.setItem('user_name', decodedToken.name || "Jane");
            await AsyncStorage.setItem('user_level', decodedToken.level || 'Beginner');
            await AsyncStorage.setItem('selectedBodyPartsAdded', JSON.stringify(true));

            navigation.navigate('Main');
        }).catch(error => {
            setTimeout(() => {
                ToastService.show('error', error.message, 'Please try again later', 3000)
            }, 200);
        }).finally(() => {
            setLoading(false);
        });

    };

    const handleSocialLogin = (platform) => {
        Alert.alert("Regret", `Currently ${platform} login is not supported It will be available soon.`);
    };

    if (loading) {
        // Display a loading indicator while fetching user details
        return <LoadingScreen message="Logging you in – unlocking your fitness journey, one step at a time!" />;
    }

    return (
        <ImageBackground source={require('../../assets/images/background.png')} style={{ width: '100%', height: '100%' }}>
            {/* Back Button*/}
            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity> */}

            <View style={styles.container}>
                <Text style={styles.title}>Login</Text>

                {/* Email or Number Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Username or Email"
                    keyboardType="email-address"
                    value={emailOrNumber}
                    onChangeText={setEmailOrNumber}
                />

                {/* Password Input */}
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />

                {/* Login Button */}
                <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
                    <Text style={styles.loginButtonText}>Login</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>OR</Text>

                {/* Link to SignUp */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}>Create accound?</Text>
                    <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
                        <Text style={styles.linkText}>SignUp</Text>
                    </TouchableOpacity>
                </View>
                {/* Link to Reset password */}
                <View style={styles.footer}>
                    <Text style={styles.footerText}></Text>
                    <TouchableOpacity onPress={() => navigation.navigate("ResetPassword")}>
                        <Text style={styles.linkText}>forgot password</Text>
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

export default LoginScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    backButton: {
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
    loginButton: {
        width: "100%",
        height: 50,
        backgroundColor: "#4CAF50",
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        marginTop: 10,
    },
    loginButtonText: {
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
