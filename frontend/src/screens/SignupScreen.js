import React, { useState, useEffect, useRef } from "react";
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    ImageBackground,
    Image,
    Pressable,
    Animated,
    Dimensions,
    Platform
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import DropDownPicker from 'react-native-dropdown-picker';
import LoadingScreen from "./LoadingScreen";

const googleLogo = require("../../assets/images/google.png");
const facebookLogo = require("../../assets/images/facebook.png");
const instagramLogo = require("../../assets/images/instagram.png");
const calendar = require("../../assets/images/Calender.png");
const { base_url } = require("../../config");
import { ToastService } from '../components/ToastMessage';

const { width } = Dimensions.get("window");

const SignupScreen = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState(new Date());
    const [birthDate, setBirthDate] = useState();
    const [level, setLevel] = useState("beginner");
    const [open, setOpen] = useState(false);
    const [items, setItems] = useState([
        { label: 'Beginner', value: 'beginner' },
        { label: 'Intermediate', value: 'intermediate' },
        { label: 'Advanced', value: 'advanced' },
    ]);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [loading, setLoading] = useState(false);
    const today = new Date();
    const minimumDate = new Date(today.getFullYear() - 16, today.getMonth(), today.getDate());


    const navigation = useNavigation();
    const animation = useRef(new Animated.Value(0)).current;
    const textAnimations = useRef(items.map(() => new Animated.Value(1))).current; // One animation per item
    const segmentWidth = width * 0.9 / items.length;

    useEffect(() => {
        const index = items.findIndex((item) => item.value === level);

        // Animate the indicator
        Animated.spring(animation, {
            toValue: index * segmentWidth,
            useNativeDriver: true,
        }).start();

        // Animate text properties
        textAnimations.forEach((anim, i) => {
            Animated.timing(anim, {
                toValue: i === index ? 1.1 : 0.9, // Active text grows to 1.2x size
                duration: 300,
                useNativeDriver: false,
            }).start();
        });
    }, [level]);

    const handleSubmit = () => {
        // Basic validation
        console.log(base_url);
        if (!username || !email || !password) {
            ToastService.show('warning', null, 'All fields are required!', 2000);
            return;
        }
        setLoading(true);
        fetch(`${base_url}/user/signup`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: username,
                email: email,
                password: password,
                dateOfBirth: dob,
                level: level
            })
        }).then(response => {
            if (response.ok) {
                return response.json();
            } else {
                return response.json().then((errorData) => {
                    throw new Error(errorData.detail || "Failed to Signup");
                });
            }
        }).then(data => {
            console.log('Success:', data);
            fetch(`${base_url}/login`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    username: email,
                    password: password
                }).toString()
            }).then(response => {
                if (response.ok) {
                    return response.json();
                } else {
                    return response.json().then((errorData) => {
                        throw new Error(errorData.detail || "Failed to Signup");
                    });
                }

            }).then(async data => {
                const { access_token, token_type } = data;
                await AsyncStorage.setItem('auth_token', access_token);
                await AsyncStorage.setItem('token_type', token_type);
                await AsyncStorage.setItem('email', email);
                await AsyncStorage.setItem('user_name', username);
                await AsyncStorage.setItem('user_level', level);

                navigation.navigate("Gender", {
                  UserData: {
                    name: username,
                    email: email,
                    password: password,
                    dateOfBirth: dob,
                    level: level,
                  },
                });
                ToastService.show('success', null, `Signed up successfully!\nUsername: ${username}`, 2000);
            }).catch(error => {
                console.error('Error:', error);
                ToastService.show('error', null, error.message, 2000);
            });
        }).catch(error => {
            console.error('Error:', error);
            ToastService.show('error', error.message, 'Please try again later', 2000);
        }).finally(() => {
            setLoading(false);
        })

    };

    const handleSocialLogin = (platform) => {
        ToastService.show('info', null, `Currently ${platform} login is not supported It will be available soon.`, 2000);
    };

    const handleDateChange = (event, selectedDate) => {
        setShowDatePicker(false);
        if (selectedDate) {
            const age = today.getFullYear() - selectedDate.getFullYear();
            if (age >= 16) {
                setDob(selectedDate);
                setBirthDate(selectedDate);
            } else {
                ToastService.show('warning', null, 'Age should be 16 or older to use the workout.', 3000);
            }
        }
    };

    if (loading) {
        // Display a loading indicator while fetching user details
        return <LoadingScreen message="Building your account – paving the way to a better you." />;
    }

    return (
        <ImageBackground source={require('../../assets/images/background.png')} style={{ width: '100%', height: '100%' }}>
            {/* Back Button*/}
            {/* <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity> */}
            <View style={styles.container}>
                <Text style={styles.title}>Sign up</Text>

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

                {/* Level Dropdown */}
                {/* <DropDownPicker
                    open={open}
                    value={level}
                    items={items}
                    setOpen={setOpen}
                    setValue={setLevel}
                    setItems={setItems}
                    style={styles.dropdown}
                    dropDownContainerStyle={styles.dropdownContainer}
                    placeholder="Select Level"
                /> */}
                {/* <View style={styles.groupButton}> */}
                <View style={styles.segmentedControl}>
                    <Animated.View
                        style={[
                            styles.indicator,
                            { width: `${100 / items.length}%`, transform: [{ translateX: animation }] },
                        ]}
                    />
                    {items.map((item, index) => (
                        <Pressable
                            key={item.value}
                            onPress={() => setLevel(item.value)}
                            style={styles.segmentButton}
                        >
                            <Animated.Text
                                style={[
                                    styles.segmentText,
                                    {
                                        color: textAnimations[index].interpolate({
                                            inputRange: [0.9, 1.1],
                                            outputRange: ["#000", "#fff"], // Active text becomes white
                                        }),
                                        transform: [
                                            {
                                                scale: textAnimations[index],
                                            },
                                        ],
                                    },
                                ]}
                            >
                                {item.label}
                            </Animated.Text>
                        </Pressable>
                    ))}
                </View>
                {/* </View> */}

                {/* Date of Birth Picker */}
                <TextInput
                    style={styles.input}
                    placeholder="Date of Birth"
                    // value={dob ? dob.toLocaleDateString() : "Select DOB"}
                    inputMode='numeric'
                    returnKeyType="done"
                    value={birthDate?.toLocaleDateString()}
                    onPress={() => setShowDatePicker(true)}
                />
                <TouchableOpacity onPress={() => setShowDatePicker(true)}>
                    <Image source={calendar} style={styles.dobCalender}></Image>
                </TouchableOpacity>

                {showDatePicker && (
                    <DateTimePicker
                        value={dob || minimumDate}
                        mode="date"
                        display="default"
                        minimumDate={new Date(1900, 0, 1)}
                        maximumDate={minimumDate}
                        onChange={handleDateChange}
                        style={{ backgroundColor: 'rgba(233, 227, 230, 0.57)', borderRadius: 10, bottom: 20 }}
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
    dropdown: {
        width: '100%',
        height: 50,
        borderColor: '#ccc',
        borderRadius: 10,
        marginBottom: 15,
        backgroundColor: "#fff",
    },
    dropdownContainer: {
        width: '100%',
        borderColor: '#ccc',
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
    dobCalender: {
        width: 25,
        height: 25,
        left: '40%',
        bottom: 55,
        alignSelf: 'flex-end',
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
    segmentedControl: {
        flexDirection: "row",
        width: "100%",
        position: "relative",
        overflow: "hidden",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        // paddingHorizontal: 5,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: "#ccc",
    },
    segmentButton: {
        flex: 1,
        paddingVertical: 10,
        alignItems: "center",
        justifyContent: "center"
    },
    segmentText: {
        fontSize: 15,
    },
    indicator: {
        position: "absolute",
        height: "100%",
        backgroundColor: "#8c579a",
        borderRadius: 10,
        zIndex: -1,
    },
    level: {
        marginTop: 20,
        fontWeight: "bold",
    },
});
