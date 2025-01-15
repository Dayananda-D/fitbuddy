import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground } from "react-native";
import SVGComponent from "../components/svgComponent";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { ToastService } from '../components/ToastMessage';
import Popup from "../components/popup";
import LoadingScreen from './LoadingScreen';
const workout = require('../data/workoutData.json');

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
    const userData = route.params?.UserData || {};
    const [selectedIds, setSelectedIds] = useState([]);
    const [baseData, setBasedata] = useState();
    const [isPopupVisible, setPopupVisible] = useState(false);

    useEffect(() => {
      (async () => {
        setBasedata(userData);
        if (!userData.hasOwnProperty("gender")) {
          try {
            const data = await AsyncStorage.getItem("baseData");
            const userDetails = JSON.parse(data);
            setBasedata(userDetails);
            if (userDetails?.selectedBodyParts[0]) {
              handleSelectionChange(userDetails?.selectedBodyParts[0]);
            }
          } catch (error) {
            console.error("Error fetching user details", error);
          }
        }
      })();
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

    const inputAccumulator = () => {
        const updatedUserData = {
            ...userData,
            selectedBodyParts: selectedIds
        };
        if (!updatedUserData.hasOwnProperty("gender")) {
            updatedUserData['gender'] = baseData.gender;
            updatedUserData['goal'] = baseData.goal;
        }
        if (baseData.email) {
            fetch(`${base_url}/user/${baseData.email}`, {
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

    if (!baseData?.gender) {
        return <LoadingScreen message="Loading your activities..." />;
    }
    


    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>What do you want to workout?</Text>

                {selectedIds.length ? (
                    <TouchableOpacity
                        style={styles.workoutButton}
                        onPress={() => setPopupVisible(true)}
                    >
                        <Text style={styles.buttonText}>Select workouts</Text>
                    </TouchableOpacity>
                ) : null}
                <Popup
                    visible={isPopupVisible}
                    onClose={() => setPopupVisible(false)}
                    data={workout.exercises[selectedIds[0]]?.[baseData.level]}
                />

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
                        gender={baseData.gender}
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
        marginBottom: 10,
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
    workoutButton: {
        marginTop: 20,
        backgroundColor: "#007BFF",
        padding: 10,
        borderRadius: 5,
        alignItems: "center",
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
