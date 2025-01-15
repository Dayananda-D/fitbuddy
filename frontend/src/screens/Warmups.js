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
import { Audio } from "expo-av";
import Icon from "react-native-vector-icons/MaterialIcons";

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
    const { allExercises, currentExercise, currentIndex, isButtonRequired } = route.params;

    const [currentExerciseIndex, setCurrentExerciseIndex] = useState(currentIndex);
    const [currentExerciseData, setCurrentExerciseData] = useState(currentExercise);
    const [isLast, setIsLast] = useState(false);
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Load bookmark status when component mounts
    useEffect(() => {
        const loadBookmarkStatus = async () => {
            try {
                const bookmarkedExercises = await AsyncStorage.getItem('bookmarkedExercises');
                if (bookmarkedExercises !== null) {
                    const bookmarks = JSON.parse(bookmarkedExercises);
                    setIsBookmarked(bookmarks.includes(currentExerciseData.title)); // Using title instead of id
                }
            } catch (error) {
                console.error('Error loading bookmark status:', error);
            }
        };
        loadBookmarkStatus();
    }, [currentExerciseData.title]);

    // Toggle bookmark function
    const toggleBookmark = async () => {
        try {
            let bookmarkedExercises = await AsyncStorage.getItem('bookmarkedExercises');
            let bookmarks = [];

            // If bookmarkedExercises exists, parse it
            if (bookmarkedExercises !== null) {
                bookmarks = JSON.parse(bookmarkedExercises);
            }

            // Make sure bookmarks is an array
            if (!Array.isArray(bookmarks)) {
                bookmarks = [];
            }

            // Update bookmarks array using title as identifier
            if (isBookmarked) {
                bookmarks = bookmarks.filter(title => title !== currentExerciseData.title);
            } else {
                bookmarks.push(currentExerciseData.title);
            }

            // Save updated bookmarks
            await AsyncStorage.setItem('bookmarkedExercises', JSON.stringify(bookmarks));
            setIsBookmarked(!isBookmarked);

            console.log('Saved bookmarks:', bookmarks); // Debug log
        } catch (error) {
            console.error('Error toggling bookmark:', error);
        }
    };

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

    const moveToNextExercise = async () => {
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

        // Update warmupCompleted in AsyncStorage
        try {
            const warmupCompleted = JSON.parse(await AsyncStorage.getItem("warmupCompleted")) || [];
            warmupCompleted[currentExerciseIndex] = true;
            await AsyncStorage.setItem("warmupCompleted", JSON.stringify(warmupCompleted));

            const allCompleted = warmupCompleted.length > 0 && warmupCompleted.every((completed) => completed);

            if (!allCompleted) {
                const incompleteIndex = warmupCompleted.findIndex(completed => !completed);
                if (incompleteIndex !== -1) {
                    setCurrentExerciseIndex(incompleteIndex);
                    setCurrentExerciseData(allExercises[incompleteIndex]);
                    setIsLast(incompleteIndex === warmupCompleted.lastIndexOf(false));
                }
            } else {
                // Handle the case where all exercises are completed
                console.log("All warmups are completed");
                navigation.goBack();
            }
        } catch (error) {
            console.error("Error updating warmup completed:", error);
        }
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
                <View style={styles.saveIcon}>
                    <TouchableOpacity onPress={toggleBookmark}>
                        <Icon
                            name={isBookmarked ? "bookmark" : "bookmark-border"}
                            size={24}
                            color="red"
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Instructions */}
            <View style={styles.instructionView}>
                <Text style={styles.instructionHeader}>Instructions</Text>
                <InstructionText instructions={currentExerciseData.instruction} />
            </View>

            {/* Animated Progress Bar */}
            {isButtonRequired || !null && (
                <TimerButton
                    key={currentExerciseIndex} // Reset TimerButton when exercise changes
                    duration={currentExerciseData.duration}
                    onComplete={moveToNextExercise} // Callback when timer completes
                    isLast={isLast}
                />
            )}
        </ImageBackground>
    );
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

const TimerButton = ({ duration, onComplete, isLast }) => {
    const numericDuration = parseInt(duration.match(/\d+/)[0]);
    let durationInSeconds;

    if (duration.toLowerCase().includes("min")) {
        durationInSeconds = numericDuration * 60;
    } else if (duration.toLowerCase().includes("sec")) {
        durationInSeconds = numericDuration;
    }

    const formatTime = (totalSeconds) => {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    };

    const durationInMilliseconds = durationInSeconds * 1000;
    const [timer, setTimer] = useState(formatTime(durationInSeconds));
    const [isRunning, setIsRunning] = useState(false);
    const [completed, setCompleted] = useState(false);
    const [remainingSeconds, setRemainingSeconds] = useState(durationInSeconds);
    const progress = useRef(new Animated.Value(0)).current;
    const [countdownPlayed, setCountdownPlayed] = useState(false);

    const startSound = useRef(null);
    const endCountdownSound = useRef(null);

    useEffect(() => {
        // Load audio files
        const loadSounds = async () => {
            startSound.current = new Audio.Sound();
            endCountdownSound.current = new Audio.Sound();
            await startSound.current.loadAsync(require("../../assets/go.mp3"));
            await endCountdownSound.current.loadAsync(require("../../assets/10countdown.mp3"));
        };
        loadSounds();

        return () => {
            // Unload sounds when the component unmounts
            if (startSound.current) startSound.current.unloadAsync();
            if (endCountdownSound.current) endCountdownSound.current.unloadAsync();
        };
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setRemainingSeconds((prev) => {
                    const newRemaining = prev - 1;

                    if (newRemaining <= 10 && !countdownPlayed) {
                        playEndCountdown();
                        setCountdownPlayed(true);
                    }

                    if (newRemaining <= 0) {
                        clearInterval(interval);
                        setIsRunning(false);
                        setCompleted(true);
                        return 0;
                    }

                    return newRemaining;
                });
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning, countdownPlayed]);

    useEffect(() => {
        setTimer(formatTime(remainingSeconds));
    }, [remainingSeconds]);



    const playStartSound = async () => {
        if (startSound.current) {
            await startSound.current.replayAsync();
        }
    };

    const playEndCountdown = async () => {
        if (endCountdownSound.current) {
            await endCountdownSound.current.replayAsync();
        }
    };

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
            playStartSound(); // Play start sound
            setCountdownPlayed(false); // Reset countdown flag
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
    saveIcon: {
        position: "absolute",
        right: 16,
        bottom: "10%"
    }
});

export default Warmups;
