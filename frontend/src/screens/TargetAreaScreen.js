import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import SVGComponent from "../components/svgComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";

const { base_url } = require("../../config");

const bodyParts = [
    { name: "Abdominals", key: "abdominals" },
    { name: "Chest", key: "chest" },
    { name: "Calves", key: "calves" },
    { name: "Front Shoulders", key: "frontShoulders" },
    { name: "Hands", key: "hands" },
    { name: "Quads", key: "quads" },
    { name: "Obliques", key: "obliques" },
    { name: "Traps", key: "traps" },
    { name: "Forearms", key: "forearms" },
    { name: "Biceps", key: "biceps" },
];

const TargetAreaScreen = ({ navigation, route }) => {
    const { UserData } = route.params;
    const [selectedIds, setSelectedIds] = useState([]);
    const [userEmail, setUserEmail] = useState();

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

    const handleSelectionChange = (key) => {
        setSelectedIds((prev) =>
            prev.includes(key) ? prev.filter((id) => id !== key) : [...prev, key]
        );
    };

    const inputAccumulator = () => {
        const updatedUserData = {
            ...UserData,
            selectedBodyParts: selectedIds
        };
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

                    <View style={styles.rightColumn}>
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
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.startButton}
                    onPress={() => inputAccumulator()}
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
        marginBottom: 20,
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
        height: "60%",
    },
});

export default TargetAreaScreen;
