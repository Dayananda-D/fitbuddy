import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import SVGComponent from "../components/svgComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastService } from '../components/ToastMessage';

const { base_url } = require("../../config");

const bodyParts = [
    { name: "Abdominals", key: "abdominals" },
    { name: "Chest", key: "chest" },
    { name: "Calves", key: "calves" },
    { name: "Front Shoulders", key: "frontShoulders" },
    // { name: "Hands", key: "hands" },
    // { name: "Quads", key: "quads" },
    // { name: "Obliques", key: "obliques" },
    // { name: "Traps", key: "traps" },
    // { name: "Forearms", key: "forearms" },
    // { name: "Biceps", key: "biceps" },
];

const TargetAreaScreen = ({ navigation, route }) => {
    const UserData = route.params?.UserData || {};
    const [selectedIds, setSelectedIds] = useState([]);
    const [userEmail, setUserEmail] = useState();
    const [gender, setGender] = useState();
    const [goal, setGoal] = useState();

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const email = await AsyncStorage.getItem('email');

                if (email) setUserEmail(email);
            } catch (error) {
                console.error('Error fetching user details', error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(async () => {
        if (!UserData.hasOwnProperty("gender")) {
            try {
                const basedata = await AsyncStorage.getItem('baseData');
                const email = JSON.parse(basedata).email;
                const gender = JSON.parse(basedata).gender;
                const goal = JSON.parse(basedata).goal;

                setUserEmail(email);
                setGender(gender);
                setGoal(goal);
            } catch (error) {
                console.error('Error fetching user details', error);
            }

            UserData['gender'] = gender;
            UserData['goal'] = goal;
        }
    }, []);

    const handleSelectionChange = (key) => {
        setSelectedIds((prev) => {
            if (prev.includes(key)) {
                return prev.filter((id) => id !== key);
            } else if (prev.length >= 1) {
                ToastService.show('info', 'Selection Restriction', 'Only one body part selection is supported for now..!.', 3000);
                return prev;
            } else {
                return [...prev, key];
            }
        });
    };

    const inputAccumulator = () => {debugger
        const updatedUserData = {
            ...UserData,
            selectedBodyParts: selectedIds
        };
        if (!updatedUserData.hasOwnProperty("gender")) {
            updatedUserData['gender'] = gender;
            updatedUserData['goal'] = goal;
        }
        if (userEmail) {
            fetch(`${base_url}/user/${userEmail}`, {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedUserData),
            })
                .then((response) => {
                    if (!response.ok) {
                        // Handle HTTP errors
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                    return response.json(); // Parse JSON response
                })
                .then(async (data) => {
                    console.log("Response:", data); // Handle successful response
                    await AsyncStorage.removeItem('baseData');
                    await AsyncStorage.setItem('selectedBodyPartsAdded', JSON.stringify(true));
                    navigation.navigate("Main", { UserData: updatedUserData });
                })
                .catch((error) => {
                    console.error("Error updating user:", error); // Handle errors
                });
        } else {
            navigation.navigate("Login");
        }
    };
    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What do you want to workout?</Text>
                <View style={styles.buttonContainer}>

                    <View style={styles.leftColumn}>
                        {bodyParts.slice(0, 5).map((part) => (
                            <TouchableOpacity
                                key={part.key}
                                style={[
                                    styles.bodyPartButton,
                                    selectedIds.includes(part.key) && styles.selectedButton,
                                ]}
                                onPress={() => handleSelectionChange(part.key)}
                            >
                                <Text style={styles.buttonText}>{part.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>

                    <SVGComponent
                        onSelectionChange={handleSelectionChange}
                        selectedIds={selectedIds}
                        style={styles.svgComponent}
                    />

                    {/* <View style={styles.rightColumn}>
                        {bodyParts.slice(5).map((part) => (
                            <TouchableOpacity
                                key={part.key}
                                style={[
                                    styles.bodyPartButton,
                                    selectedIds.includes(part.key) && styles.selectedButton,
                                ]}
                                onPress={() => handleSelectionChange(part.key)}
                            >
                                <Text style={styles.buttonText}>{part.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View> */}
                </View>

                <TouchableOpacity
                    style={[styles.startButton, selectedIds.length === 0 && styles.disabledButton]}
                    onPress={() => {
                        if (selectedIds.length === 0) {
                            ToastService.show('error', 'Selection Error', 'Please select any one body part.', 3000);
                        } else {
                            inputAccumulator();
                        }
                    }}
                >
                    <Text style={styles.buttonText}>Let’s Begin</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    backgroundImage: {
        flex: 1,
        resizeMode: "cover",
    },
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "#fff",
        marginBottom: 100,
        textAlign: "center",
    },
    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        marginTop: 20,
    },
    leftColumn: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    rightColumn: {
        flex: 1,
        justifyContent: "space-around",
        alignItems: "center",
    },
    bodyPartButton: {
        backgroundColor: "#4CAF50",
        padding: 10,
        borderRadius: 5,
        marginBottom: 10,
        width: 100,
        alignItems: "center",
    },
    selectedButton: {
        backgroundColor: "#FF5722",
    },
    buttonText: {
        color: "#fff",
        fontSize: 12,
        fontWeight: "bold",
        textAlign: "center",
    },
    startButton: {
        backgroundColor: "#4CAF50",
        padding: 15,
        borderRadius: 10,
        marginBottom: 10,
        width: 200,
        alignItems: "center",
        position: "absolute",
        bottom: 60,
    },
    svgComponent: {
        flex: 1,
        height: "100%",
    },
    disabledButton: {
        backgroundColor: '#d3d3d3',
    },
});

export default TargetAreaScreen;
