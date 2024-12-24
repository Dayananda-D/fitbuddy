import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Dimensions,
    ImageBackground,
    TouchableOpacity,
    ScrollView,
} from "react-native";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import AsyncStorage from '@react-native-async-storage/async-storage';

const workout = require('../data/workoutData.json');
const verify = require('../../assets/images/verify.png');
const disapprove = require('../../assets/images/disapprove.png');
// const category = 'chest';
// const level = 'advanced';

const WarmupTab = ({ allWarmupsCompleted, setAllWarmupsCompleted }) => {
    const navigation = useNavigation();
    const [category, setCategory] = useState('chest');
    const [level, setLevel] = useState('beginner');
    const [warmupCompleted, setWarmupCompleted] = useState(Array(workout.exercises[category].warmup.length).fill(false));

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const selectedPart = await AsyncStorage.getItem("selectedPart");
                const level = await AsyncStorage.getItem("level");
                setCategory(selectedPart);
                setLevel(level);
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        }
        fetchUserDetails();
    }, []);

    const navigateWarmup = (item, index) => {
        navigation.navigate("Warmups", {
            allExercises: workout.exercises[category].warmup,
            currentExercise: item,
            currentIndex: index,
            isLastExercise: index === workout.exercises[category].warmup.length - 1,
            onWarmupComplete: () => handleWarmupComplete(),
        });

        if (index === workout.exercises[category].warmup.length - 1) {
            setAllWarmupsCompleted(true); // Update the state in the parent component
        }
    };

    const handleWarmupComplete = (index) => {
        setWarmupCompleted((prev) => {
            const updatedWarmupCompleted = [...prev];
            updatedWarmupCompleted[index] = true;
            return updatedWarmupCompleted;
        });
    };

    return (
        <ScrollView>
            {workout.exercises[category].warmup.map((item, index) => (
                <View style={styles.scene} key={index}>
                    <View style={styles.card}>
                        <View>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.time}>Duration: {item.duration}</Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: '#fff',
                                padding: 5,
                                right: 10,
                                top: 10,
                                borderRadius: 5,
                            }}
                        >
                            <Image source={warmupCompleted[index] ? verify : disapprove} style={{ height: 20, width: 20 }} />
                        </View>
                        <View style={{ justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => navigateWarmup(item, index)}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <Text>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};


const WorkoutTab = ({ allWarmupsCompleted }) => {
    const navigation = useNavigation();
    const [category, setCategory] = useState('chest');
    const [level, setLevel] = useState('beginner');
    const [workoutCompleted, setWorkoutCompleted] = useState(Array(workout.exercises[category][level].length).fill(false));

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const selectedPart = await AsyncStorage.getItem("selectedPart");
                const level = await AsyncStorage.getItem("level");
                setCategory(selectedPart);
                setLevel(level);
            } catch (error) {
                console.error("Error fetching user details", error);
            }
        }
        fetchUserDetails();
    }, []);

    const navigateWorkout = (item, index) => {
        if (allWarmupsCompleted) {
            navigation.navigate("Workouts", {
                allExercises: workout.exercises[category][level],
                currentExercise: item,
                currentIndex: index,
                isLastExercise: index === workout.exercises[category][level].length - 1,
            });
        }
    };

    return (
        <ScrollView>
            {workout.exercises[category][level].map((item, index) => (
                <View style={styles.scene} key={index}>
                    {!allWarmupsCompleted && (
                        <View
                            style={{
                                position: 'absolute',
                                marginVertical: 10,
                                width: '90%',
                                height: '89%',
                                backgroundColor: 'rgba(0,0,0,0.7)',
                                justifyContent: 'center',
                                alignItems: 'center',
                                zIndex: 2,
                                // marginLeft: 12,
                                borderRadius: 10,
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    textAlign: 'center',
                                }}
                            >
                                Complete the warmups to unlock workout
                            </Text>
                        </View>
                    )}
                    <View style={styles.card}>
                        <View>
                            <Image source={{ uri: item.image }} style={styles.image} />
                            <Text style={styles.title}>{item.title}</Text>
                            <Text style={styles.time}>Duration: {item.duration}</Text>
                        </View>
                        <View
                            style={{
                                position: 'absolute',
                                backgroundColor: '#fff',
                                padding: 5,
                                right: 10,
                                top: 10,
                                borderRadius: 5,
                            }}
                        >
                            <Image source={workoutCompleted[index] ? verify : disapprove} style={{ height: 20, width: 20 }} />
                        </View>
                        <View style={{ justifyContent: 'space-around' }}>
                            <TouchableOpacity
                                style={styles.startButton}
                                onPress={() => navigateWorkout(item, index)}
                            >
                                <Text style={styles.buttonText}>Start</Text>
                            </TouchableOpacity>
                            <Text>Calorie Burn/Rep: {item.caloriesBurnedPerRepMen}</Text>
                        </View>
                    </View>
                </View>
            ))}
        </ScrollView>
    );
};

const initialLayout = { width: Dimensions.get("window").width };

const WorkoutTabs = () => {
    const [allWarmupsCompleted, setAllWarmupsCompleted] = useState(false);

    const renderScene = SceneMap({
        warmup: () => <WarmupTab allWarmupsCompleted={allWarmupsCompleted} setAllWarmupsCompleted={setAllWarmupsCompleted} />,
        workouts: () => <WorkoutTab allWarmupsCompleted={allWarmupsCompleted} />,
    });

    return (
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            <TabView
                navigationState={{
                    index: 0,
                    routes: [
                        { key: "warmup", title: "Warm-Up" },
                        { key: "workouts", title: "Workouts" },
                    ],
                }}
                renderScene={renderScene}
                onIndexChange={() => { }}
                initialLayout={initialLayout}
                renderTabBar={(props) => (
                    <TabBar
                        {...props}
                        indicatorStyle={{ backgroundColor: "#4CAF50" }}
                        style={{ backgroundColor: "#6c5c80", borderRadius: 10, marginTop: 50, width: "95%", alignSelf: 'center' }}
                        labelStyle={{ color: "black", fontWeight: "bold" }}
                    />
                )}
            />
        </ImageBackground>
    );
};

export default WorkoutTabs;

const styles = StyleSheet.create({
    scene: {
        flex: 1,
        alignItems: "center",
        // paddingTop: 20,
    },
    container: {
        flex: 1,
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        width: "90%",
        padding: 15,
        marginVertical: 10,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    image: {
        width: 160,
        height: 80,
    },
    header: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 10,
        color: "#4CAF50",
    },
    title: {
        fontSize: 16,
        fontWeight: "600",
        color: "#333",
    },
    time: {
        fontSize: 14,
        color: "#777",
        marginTop: 5,
    },
    startButton: {
        backgroundColor: "#4CAF50",
        padding: 5,
        borderRadius: 10,
        width: 100,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
