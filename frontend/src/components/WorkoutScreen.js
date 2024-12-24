import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    Image,
    TouchableOpacity,
    Animated,
} from "react-native";
import Counter from "../components/Counter";
import AsyncStorage from '@react-native-async-storage/async-storage';

const { base_url } = require("../../config");

const InstructionText = ({ instructions, title }) => {
    return (
        <View>
            {title}
            {instructions.map((instruction, index) => (
                <View key={index} style={styles.bulletPointContainer}>
                    <Text style={styles.bulletPoint}>{index + 1}.</Text>
                    <Text style={styles.instructionTxt}>{instruction}</Text>
                </View>
            ))}
        </View>
    );
};

const Workouts = ({ navigation, route }) => {
    const { allExercises, currentExercise, currentIndex, isLastExercise, onWarmupComplete, onWorkoutComplete } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(currentIndex);
    const [currentExerciseData, setCurrentExerciseData] = useState(currentExercise);
    const [isLast, setIsLast] = useState(isLastExercise);
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [reps, setReps] = useState(0);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("@MyApp_user");

                setToken(token);
                setUserData(JSON.parse(data));
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        };

        fetchUserDetails();
    }, []);

    const moveToNextExercise = () => {
        if (currentExerciseIndex < allExercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            exerciseData = allExercises[nextIndex];
            setCurrentExerciseData(exerciseData);
            setIsLast(nextIndex === allExercises.length - 1);
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
        } else {
            exerciseData = allExercises[currentExerciseIndex];
            setCurrentExerciseData(exerciseData);
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
            navigation.goBack();
        }

        const calBurnPerRep = userData.gender === 'Male' ? exerciseData?.caloriesBurnedPerRepMen : exerciseData?.caloriesBurnedPerRepWomen;

        const data = {
            "email": userData.email,
            "name": userData.name,
            "type": "workout",
            "gender": userData.gender,
            "workoutName": exerciseData?.title,
            "workoutGIF": exerciseData?.image,
            "workoutDuration": exerciseData?.duration,
            "targettedBodyPart": typeof userData.selectedBodyParts == 'object' ? userData.selectedBodyParts.join() : userData.selectedBodyParts,
            "equipment": "Body weight",
            "level": userData.level,
            "suitableFor": "string",
            "isCompleted": true,
            "isSkipped": false,
            "totalCalBurnt": "0",
            "calBurnPerRep": calBurnPerRep,
            "reps": reps
          }
        updateExercises(data, token);
    };

    const updateExercises = (data, token) => {
        fetch (`${base_url}/wokout`,{
            method: "POST",
            headers: {
                accept: "application/json",
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
    }
    const handleCountChange = (newCount) => {
        setReps(newCount);
        console.log("Current Count:", newCount); // Handle count changes as needed
    };

    return (
        <ImageBackground
            source={require("../../assets/images/background.png")}
            style={styles.container}
        >
            {/* Back Button */}
            <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
            >
                <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>

            {/* Gif Image */}
            <View style={styles.gifContainer}>
                <ImageBackground
                    source={{ uri: currentExerciseData.image }}
                    style={styles.gifPlayer}
                ></ImageBackground>
                <View style={styles.gifDesc}>
                    <Text style={{ fontWeight: "bold" }}>{currentExerciseData.title}</Text>
                    <Text style={{ fontSize: 14, color: "#8860a2" }}>
                        {currentExerciseData.duration}
                    </Text>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={currentExerciseData.instruction} />
            </View>

            {/* Counter */}
            <Counter onCountChange={handleCountChange} />

            {/* Next Button */}
            <TouchableOpacity
                style={styles.nextButton}
                onPress={moveToNextExercise}
            >
                <Text style={styles.nextButtonText}>{isLast ? "Complete" : "Next"}</Text>
            </TouchableOpacity>

        </ImageBackground>
    );
};


const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    backButton: {
        position: "absolute",
        top: 40,
        left: 20,
        backgroundColor: "#000",
        padding: 10,
        borderRadius: 5,
    },
    backButtonText: {
        color: "#fff",
        fontSize: 16,
    },
    instructionTxt: {
        color: "white",
    },
    instructionHeader: {
        textAlign: "center",
        fontSize: 18,
        fontWeight: "bold",
        color: "#4CAF50",
        padding: 10,
    },
    instructionView: {
        width: "100%",
        height: 300,
        padding: 20,
        overflow: "scroll",
    },
    bulletPointContainer: {
        flexDirection: "row",
        alignItems: "flex-start",
        marginBottom: 5,
    },
    bulletPoint: {
        color: "white",
        marginRight: 5,
    },
    gifContainer: {
        marginHorizontal: 12,
        shadowOffset: { width: -5, height: 3 },
        shadowColor: "grey",
        shadowOpacity: 0.5,
        shadowRadius: 3,
        backgroundColor: "#fff",
    },
    gifPlayer: {
        height: 300,
        width: 400,
    },
    gifDesc: {
        backgroundColor: "white",
        padding: 10,
        borderRadius: 15,
    },
    nextButton: {
        position: "absolute",
        bottom: 70,
        right: 5,
        alignItems: "flex-end",
        backgroundColor: "#4CAF50",
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});

export default Workouts;