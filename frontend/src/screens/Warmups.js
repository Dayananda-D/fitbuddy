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

const Warmups = ({ navigation, route }) => {
    const { allExercises, currentExercise, currentIndex, isLastExercise, onWarmupComplete, onWorkoutComplete } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(currentIndex);
    const [currentExerciseData, setCurrentExerciseData] = useState(currentExercise);
    const [isLast, setIsLast] = useState(isLastExercise);
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();

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
            setCurrentExerciseData(allExercises[nextIndex]);
            setIsLast(nextIndex === allExercises.length - 1);
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
        } else {
            onWarmupComplete ? onWarmupComplete(currentExerciseIndex) : onWorkoutComplete(currentExerciseIndex);
            navigation.goBack();
        }
        const exerciseData = allExercises[currentExerciseIndex];
        const calBurnPerRep = userData.gender === 'Male' ? exerciseData?.caloriesBurnedPerRepMen : exerciseData?.caloriesBurnedPerRepWomen;

        const data = {
            "email": userData.email,
            "name": userData.name,
            "type": "warmup",
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
          }
        updateExercises(data, token);
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

            {/* Animated Progress Bar */}
            <TimerButton
                key={currentExerciseIndex} // Reset TimerButton when exercise changes
                duration={currentExerciseData.duration}
                onComplete={moveToNextExercise} // Callback when timer completes
                isLast={isLast}
            />
        </ImageBackground>
    );
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

const TimerButton = ({ duration, onComplete, isLast }) => {
    const numericDuration = parseInt(duration.match(/\d+/)[0]);
    let durationInSeconds;

    if (duration.toLowerCase().includes("min")) {
        durationInSeconds = numericDuration * 60;
    } else if (duration.toLowerCase().includes("sec")) {
        durationInSeconds = numericDuration;
    }

    const durationInMilliseconds = durationInSeconds * 1000;
    const [timer, setTimer] = useState("00:00");
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState(false);
    const progress = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        let interval;
        if (isRunning) {
            let seconds = 0;
            interval = setInterval(() => {
                seconds++;
                const minutes = Math.floor(seconds / 60);
                const secs = seconds % 60;
                setTimer(
                    `${minutes.toString().padStart(2, "0")}:${secs
                        .toString()
                        .padStart(2, "0")}`
                );

                if (seconds >= durationInSeconds) {
                    clearInterval(interval);
                    setIsRunning(false);
                    setCompleted(true);
                }
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    const startAnimation = () => {
        setIsRunning(true);
        Animated.timing(progress, {
            toValue: 1,
            duration: durationInMilliseconds,
            useNativeDriver: false,
        }).start();
    };

    const progressWidth = progress.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "100%"],
    });

    const handleClick = () => {
        if (!isRunning && !completed) {
            startAnimation();
        } else if (completed) {
            onComplete();
        }
    };

    return (
        <View style={styles.progressBarContainer}>
            <Animated.View
                style={[
                    styles.progressBar,
                    {
                        backgroundColor: completed ? "#4CAF50" : "#9bde9e",
                        width: progressWidth,
                    },
                ]}
            />
            <TouchableOpacity
                style={styles.progressButton}
                onPress={handleClick}
            >
                <Text style={[styles.buttonText, { color: completed ? "#fff" : "#525453" }]}>
                    {isRunning ? timer : completed ? (isLast ? "Complete" : "Next") : "Start"}
                </Text>
            </TouchableOpacity>
        </View>
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
    progressBarContainer: {
        width: "50%",
        height: 50,
        position: "absolute",
        bottom: 25,
        backgroundColor: "#e0e0e0",
        borderRadius: 10,
        overflow: "hidden",
    },
    progressBar: {
        height: "100%",
        position: "absolute",
    },
    progressButton: {
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
    },
    buttonText: {
        fontSize: 18,
        fontWeight: "bold",
    },
});

export default Warmups;
