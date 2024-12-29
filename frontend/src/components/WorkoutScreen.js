import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
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
    const { allExercises, currentExercise, currentIndex, isLastExercise } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(currentIndex);
    const [currentExerciseData, setCurrentExerciseData] = useState(currentExercise);
    const [isLast, setIsLast] = useState(isLastExercise);
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [reps, setReps] = useState(0);
    const [elapsedTimes, setElapsedTimes] = useState(Array(allExercises.length).fill(0));
    const timerRef = useRef(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("baseData");

                setToken(token);
                setUserData(JSON.parse(data));
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        };

        fetchUserDetails();
    }, []);

    useEffect(() => {
        startTimer();

        return () => {
            clearTimer(); // Clean up the timer on component unmount
        };
    }, [currentExerciseIndex]); // Restart the timer whenever the exercise changes

    const startTimer = () => {
        clearTimer(); // Clear any previous timer
        timerRef.current = setInterval(() => {
            setElapsedTimes((prevTimes) => {
                const updatedTimes = [...prevTimes];
                updatedTimes[currentExerciseIndex] += 1; // Increment the timer for the current exercise
                return updatedTimes;
            });
        }, 1000);
    };

    const clearTimer = () => {
        if (timerRef.current) {
            clearInterval(timerRef.current);
            timerRef.current = null;
        }
    };

    const formatTime = (seconds) => {
        const hrs = Math.floor(seconds / 3600).toString().padStart(2, '0');
        const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
        const secs = (seconds % 60).toString().padStart(2, '0');
        return `${mins}:${secs}`;
    };

    const moveToPrevExercise = () => {
        clearTimer(); // Clear the timer
        if (currentExerciseIndex !== 0) {
            const prevIndex = currentExerciseIndex - 1;
            setCurrentExerciseIndex(prevIndex);
            setCurrentExerciseData(allExercises[prevIndex]);
            setIsLast(prevIndex === allExercises.length - 1);
        } else {
            navigation.goBack();
        }
    };

    const moveToNextExercise = async () => {
        clearTimer(); // Clear the timer
        const exerciseData = allExercises[currentExerciseIndex];
        const calBurnPerRep = userData.gender === 'Male' ? exerciseData?.caloriesBurnedPerRepMen : exerciseData?.caloriesBurnedPerRepWomen;

        const data = {
            email: userData.email,
            name: userData.name,
            type: "workout",
            gender: userData.gender,
            workoutName: exerciseData?.title,
            workoutGIF: exerciseData?.image,
            workoutDuration: exerciseData?.duration,
            targettedBodyPart: typeof userData.selectedBodyParts === 'object' ? userData.selectedBodyParts.join() : userData.selectedBodyParts,
            equipment: "Body weight",
            level: userData.level,
            suitableFor: "string",
            isCompleted: true,
            isSkipped: false,
            totalCalBurnt: "0",
            calBurnPerRep: calBurnPerRep,
            reps: reps,
        };
        updateExercises(data, token);

        if (currentExerciseIndex < allExercises.length - 1) {
            const nextIndex = currentExerciseIndex + 1;
            setCurrentExerciseIndex(nextIndex);
            setCurrentExerciseData(allExercises[nextIndex]);
            setIsLast(nextIndex === allExercises.length - 1);
        } else {
            navigation.goBack();
        }

        // Update workoutCompleted in AsyncStorage
        try {
            const workoutCompleted = JSON.parse(await AsyncStorage.getItem("workoutCompleted")) || [];
            workoutCompleted[currentExerciseIndex] = true;
            await AsyncStorage.setItem("workoutCompleted", JSON.stringify(workoutCompleted));
            console.log("workout completed updated:", workoutCompleted);
        } catch (error) {
            console.error("Error updating workout completed:", error);
        }
    };

    const updateExercises = (data, token) => {
        fetch(`${base_url}/wokout`, {
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
                        Duration: {formatTime(elapsedTimes[currentExerciseIndex])}
                    </Text>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={currentExerciseData.instruction} />
            </View>

            <View style={styles.bottomContainer}>
                {/* Previous Button */}
                <TouchableOpacity
                    style={currentExerciseIndex !== 0 ? styles.prevButton : styles.prevButtonDis}
                    onPress={moveToPrevExercise}
                    disabled={currentExerciseIndex === 0}
                >
                    <Text style={styles.nextButtonText}>Previous</Text>
                </TouchableOpacity>

                {/* Counter */}
                <Counter onCountChange={handleCountChange} />

                {/* Next Button */}
                <TouchableOpacity
                    style={styles.nextButton}
                    onPress={moveToNextExercise}
                >
                    <Text style={styles.nextButtonText}>{isLast ? "Complete" : "Next"}</Text>
                </TouchableOpacity>
            </View>
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
        padding: 10
    },
    gifPlayer: {
        height: 300,
        width: 400,
    },
    gifDesc: {
        backgroundColor: "white",
        padding: 20,
        borderRadius: 15,
    },
    nextButton: {
        position: "absolute",
        right: 5,
        alignItems: "flex-end",
        backgroundColor: "#4CAF50",
        padding: 10,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10
    },
    prevButton: {
        position: "absolute",
        alignSelf: "flex-start",
        left: 5,
        backgroundColor: "#4CAF50",
        padding: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    prevButtonDis: {
        position: "absolute",
        alignSelf: "flex-start",
        left: 5,
        backgroundColor: "#9bde9e",
        padding: 10,
        borderTopRightRadius: 10,
        borderBottomRightRadius: 10
    },
    nextButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
    bottomContainer: {
        width: '100%',
        justifyContent: 'space-around',
        alignItems: 'center'
    }
});

export default Workouts;