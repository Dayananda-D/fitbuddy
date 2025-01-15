import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Button,
    Image,
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import * as Progress from 'react-native-progress';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
const { base_url } = require("../../config");
import LoadingScreen from './LoadingScreen';
import { ToastService } from '../components/ToastMessage';
import WorkoutImage from "../components/workoutImage";
import Icon from "react-native-vector-icons/MaterialIcons";

const headerImage = require('../../assets/images/header.jpg');
const notification = require('../../assets/images/Notification.png');
const fire = require('../../assets/images/fire.png');
const model = require('../../assets/images/model.png');
const cycle = require('../../assets/images/cycle.png');
const yoga = require('../../assets/images/yoga.png');
const walk = require('../../assets/images/walk.png');
const next = require('../../assets/images/next.png');
const play = require('../../assets/images/play.png');
const disapprove = require('../../assets/images/disapprove.png');
const verify = require('../../assets/images/verify.png');
const book = require('../../assets/images/Book.png');
const workout = require('../data/workoutData.json');

const Dashboard = () => {
    const navigation = useNavigation();
    const [category, setCategory] = useState('chest');
    const [level, setLevel] = useState('beginner');
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [workoutData, setWorkoutData] = useState({});
    const [loading, setLoading] = useState(true);
    const [selectedWorkouts, setSelectedWorkouts] = useState([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("baseData");
                const decodedToken = jwtDecode(token);

                if (data) {
                    const userDate = JSON.parse(data)
                    setToken(token);
                    setUserData(userDate);
                    const workout = await getWorkoutData(userDate.email, token);
                    setWorkoutData(workout);
                    await AsyncStorage.setItem('workoutData', JSON.stringify(workout));
                    setCategory(JSON.parse(data).selectedBodyParts[0]);
                    setLevel(JSON.parse(data).level);
                    return;
                }

                if (token && decodedToken.email) {
                    setToken(token);
                    // const workout = await getWorkoutData(decodedToken.email, token);
                    await AsyncStorage.setItem('workoutData', JSON.stringify(workout));
                    setWorkoutData(workout);
                    await fetch(`${base_url}/user/${decodedToken.email}`, {
                        method: "GET",
                        headers: {
                            accept: "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                    })
                        .then((response) => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }

                            return response.json();
                        })
                        .then(async (data) => {
                            await AsyncStorage.setItem("selectedPart", data.selectedBodyParts[0]);
                            await AsyncStorage.setItem("level", data.level);
                            await AsyncStorage.setItem("warmupCompleted", JSON.stringify(Array(workout.exercises[data.selectedBodyParts[0]].warmup.length).fill(false)));
                            await AsyncStorage.setItem("workoutCompleted", JSON.stringify(Array(workout.exercises[data.selectedBodyParts[0]][data.level].length).fill(false)));
                            await AsyncStorage.setItem("baseData", JSON.stringify(data));
                            setUserData(data);
                            setCategory(data.selectedBodyParts[0]);
                            setLevel(data.level);
                            console.log(data);
                        })
                        .catch(async (error) => {
                            await AsyncStorage.clear();
                            navigation.navigate("Login");
                            console.error("Error:", error);
                        });
                }
            } catch (error) {
                ToastService.show('error', null, 'An error occurred while fetching user details. Please re-login again.', 3000);
                console.error("Error fetching user details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

    // Filter the exercises based on selectedWorkouts
    const filteredExercises = workout.exercises[category][level].filter(exercise =>
        selectedWorkouts.includes(exercise.title)
    );

    // If no exercises match, use all exercises
    const exercisesToRender = filteredExercises.length > 0 ? filteredExercises : workout.exercises[category][level];

    useEffect(() => {
        // If `selectedWorkouts` is updated, you can handle the update here.
        const fetchSelectedWorkouts = async () => {
            const workoutTitles = workout.exercises[category][level].map(item => item.title);

            if (selectedWorkouts !== undefined) {
                console.log("Selected Workouts Updated:", selectedWorkouts);
                try {
                    const storedWorkouts = await AsyncStorage.getItem("selectedWorkouts");
                    if (storedWorkouts) {
                        console.log("Fetched selected workouts from AsyncStorage:", storedWorkouts);
                        setSelectedWorkouts(storedWorkouts);
                        // Handle any logic you want to perform with the fetched workouts
                    }
                } catch (error) {
                    console.error("Error fetching selected workouts from AsyncStorage", error);
                }
            }
        };

        fetchSelectedWorkouts();
    }, [selectedWorkouts]); // Dependency array ensures this effect runs when `selectedWorkouts` changes

    if (loading) {
        // Display a loading indicator while fetching user details
        return <LoadingScreen message="Loading your activities..." />;
    }

    return (

        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            {/* <SafeAreaView> */}
            <ScrollView>
                <View style={styles.screen}>
                    <Header data={userData} />
                    <Banner data={userData} />
                </View>
                <View style={{ marginHorizontal: '3%', marginTop: 20 }}>
                    <Label>Your Activities</Label>
                    <View style={{ flexDirection: 'row' }}>
                        {data1.map((item, index) => (
                            <Card data={item} index={index} key={index} userData={userData} />
                        ))}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Label>Today's Warm-up</Label>
                        {/* <Text style={{ opacity: 0.5, fontSize: 12, color: 'white' }}> View All</Text> */}
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ flexDirection: 'row', overflow: 'scroll' }}>
                            {workout.exercises[category].warmup.map((item, index) => {
                                return (
                                    <VideoPlayWarmup
                                        category={category}
                                        level={level}
                                        userData={userData}
                                        index={index}
                                        key={index}
                                        data={workout}
                                    />
                                )
                            })}
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Label>Today's Workout</Label>
                        {/* <Text style={{ opacity: 0.5, fontSize: 12, color: 'white' }}> View All</Text> */}
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ paddingBottom: 80, flexDirection: 'row', overflow: 'scroll' }}>
                            {exercisesToRender.map((item, index) => {
                                const recWithOriginalIndex = workout.exercises[category][level]
                                    .map((exercise, index) => ({ ...exercise, originalIndex: index }))
                                    .filter(exercise => exercise.title.includes(item.title));
                                return (
                                    <VideoPlay
                                        category={category}
                                        level={level}
                                        originalIndex={recWithOriginalIndex[0].originalIndex}
                                        userdata={userData}
                                        index={index}
                                        key={index}
                                        data={workout}
                                    />
                                )
                            })}
                        </View>
                    </ScrollView>
                </View>
            </ScrollView>
            {/* </SafeAreaView> */}
        </ImageBackground>
    );
};

export default Dashboard;

const VideoPlay = (data) => {
    const navigation = useNavigation();
    const currentIndex = data.originalIndex;
    const category = data.category;
    const level = data.level;
    const isLastExercise = currentIndex === data.data.exercises[category][level].length - 1;
    const lastIndex = data.data.exercises[category][level].length - 1;
    const allExercises = data.data.exercises[category][level];
    const currentExercise = data.data.exercises[category][level][currentIndex];
    const onWorkoutComplete = data.onWorkoutComplete;
    const [warmupCompleted, setWarmupCompleted] = useState([]);
    const [workoutCompleted, setWorkoutCompleted] = useState([]);
    const [allWarmupsCompleted, setAllWarmupsCompleted] = useState(false);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Add this function to check bookmark status
    const checkBookmarkStatus = async () => {
        try {
            const bookmarkedExercises = await AsyncStorage.getItem('bookmarkedExercises');
            if (bookmarkedExercises !== null) {
                const bookmarks = JSON.parse(bookmarkedExercises);
                setIsBookmarked(bookmarks.includes(currentExercise.title));
            }
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const fetchWarmupCompleted = async () => {
        try {
            const storedWarmupCompleted = JSON.parse(await AsyncStorage.getItem("warmupCompleted")) || [];
            const storedWorkoutCompleted = JSON.parse(await AsyncStorage.getItem("workoutCompleted")) || [];
            setWarmupCompleted([...storedWarmupCompleted]);
            setWorkoutCompleted([...storedWorkoutCompleted]);

            if (storedWarmupCompleted.length > 0 && storedWarmupCompleted.every((completed) => completed)) {
                setAllWarmupsCompleted(true);
            } else {
                setAllWarmupsCompleted(false);
            }

        } catch (error) {
            console.error("Error fetching warmup and workout completed:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWarmupCompleted();
            checkBookmarkStatus();
        }, [])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Workouts", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWorkoutComplete: onWorkoutComplete })} disabled={!warmupCompleted[lastIndex]}>
            {!allWarmupsCompleted && (
                <View
                    style={{
                        position: 'absolute',
                        width: '93%',
                        height: '100%',
                        backgroundColor: 'rgba(0,0,0,0.7)',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 2,
                        marginLeft: 12,
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
            <View
                style={{
                    borderRadius: 15,
                    marginHorizontal: 12,
                    shadowOffset: { width: -5, height: 3 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    backgroundColor: '#fff',
                }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <ImageBackground
                        source={{ uri: currentExercise.image }}
                        style={{
                            height: 150,
                            width: 300,
                        }}>
                        <LinearGradient
                            locations={[0, 1.0]}
                            colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        ></LinearGradient>
                    </ImageBackground>
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 5,
                            left: 10,
                            // fontFamily: 'Poppins-Regular',
                            color: '#fff',
                        }}>
                        {currentExercise.type}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#fff',
                            padding: 5,
                            right: 10,
                            top: 10,
                            borderRadius: 5,
                        }}>
                        <Image source={workoutCompleted[currentIndex] ? verify : disapprove} style={{ height: 15, width: 15 }} />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 15,
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#8860a2',
                            padding: 10,
                            right: 25,
                            top: -15,
                            borderRadius: 15,
                            zIndex: 3,
                        }}>
                        <Image source={play} style={{ height: 10, width: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                        <Text>
                            {currentExercise.title}
                        </Text>
                        {isBookmarked && <Icon name="bookmark" size={24} color="red" />}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{
                            // fontFamily: 'Poppins-Regular',
                            fontSize: 12
                        }}>
                            <Image source={book} style={{ height: 25, width: 25 }} />
                            {'    ' + currentExercise.type}
                        </Text>
                        <Text
                            style={{
                                // fontFamily: 'Poppins-Regular',
                                fontSize: 12,
                                color: '#8860a2',
                            }}>
                            8-10 Reps
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};

const VideoPlayWarmup = (data) => {
    const navigation = useNavigation();
    const currentIndex = data.index;
    const category = data.category;
    const allExercises = data.data.exercises[category].warmup;
    const currentExercise = data.data.exercises[category].warmup[currentIndex];
    const [warmupCompleted, setWarmupCompleted] = useState([]);
    const [isBookmarked, setIsBookmarked] = useState(false);

    // Add this function to check bookmark status
    const checkBookmarkStatus = async () => {
        try {
            const bookmarkedExercises = await AsyncStorage.getItem('bookmarkedExercises');
            if (bookmarkedExercises !== null) {
                const bookmarks = JSON.parse(bookmarkedExercises);
                setIsBookmarked(bookmarks.includes(currentExercise.title));
            }
        } catch (error) {
            console.error('Error checking bookmark status:', error);
        }
    };

    const fetchWarmupCompleted = async () => {
        try {
            const storedWarmupCompleted = JSON.parse(await AsyncStorage.getItem("warmupCompleted")) || [];
            setWarmupCompleted([...storedWarmupCompleted]);
            console.log("Warmup completed:", storedWarmupCompleted);
        } catch (error) {
            console.error("Error fetching warmup completed:", error);
        }
    };

    useFocusEffect(
        useCallback(() => {
            fetchWarmupCompleted();
            checkBookmarkStatus();
        }, [])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, currentIndex: currentIndex })}>
            <View
                style={{
                    borderRadius: 15,
                    marginHorizontal: 12,
                    shadowOffset: { width: -5, height: 3 },
                    shadowColor: 'grey',
                    shadowOpacity: 0.5,
                    shadowRadius: 3,
                    backgroundColor: '#fff',
                }}>
                <View style={{ borderRadius: 10, overflow: 'hidden' }}>
                    <ImageBackground
                        source={{ uri: currentExercise.image }}
                        style={{
                            height: 150,
                            width: 300,
                        }}>
                        <LinearGradient
                            locations={[0, 1.0]}
                            colors={['rgba(0,0,0,0.00)', 'rgba(0,0,0,0.60)']}
                            style={{
                                position: 'absolute',
                                width: '100%',
                                height: '100%',
                            }}
                        ></LinearGradient>
                    </ImageBackground>
                    <Text
                        style={{
                            position: 'absolute',
                            bottom: 5,
                            left: 10,
                            // fontFamily: 'Poppins-Regular',
                            color: '#fff',
                        }}>
                        {currentExercise.type}
                    </Text>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#fff',
                            padding: 5,
                            right: 10,
                            top: 10,
                            borderRadius: 5,
                        }}>
                        <Image source={warmupCompleted[currentIndex] ? verify : disapprove} style={{ height: 15, width: 15 }} />
                    </View>
                </View>
                <View
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 15,
                    }}>
                    <View
                        style={{
                            position: 'absolute',
                            backgroundColor: '#8860a2',
                            padding: 10,
                            right: 25,
                            top: -15,
                            borderRadius: 15,
                            zIndex: 3,
                        }}>
                        <Image source={play} style={{ height: 10, width: 10 }} />
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10, marginBottom: 10 }}>
                        <Text>
                            {currentExercise.title}
                        </Text>
                        {isBookmarked && <Icon name="bookmark" size={24} color="red" />}
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Text style={{ fontSize: 12 }}>
                            <Image source={book} style={{ height: 25, width: 25 }} />
                            {'    ' + currentExercise.type}
                        </Text>
                        <Text style={{ fontSize: 12, color: '#8860a2', }}>
                            {currentExercise.duration}
                        </Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    )
};
const Card = ({ data, userData }) => {
    const navigation = useNavigation();
    return (
        <TouchableOpacity style={{ flex: 1 }} onPress={() => navigation.navigate('Activities')}>
            <View
                style={{
                    flex: 1,
                    height: '100%',
                    padding: 20,
                    alignSelf: 'center',
                    backgroundColor: data.color,
                    justifyContent: 'space-between',
                    marginHorizontal: 8,
                    borderRadius: 10,
                    shadowColor: 'lightgrey',
                    shadowOffset: { width: -5, height: 5 },
                    shadowOpacity: 0.5,
                    shadowRadius: 2,
                }}>
                <Image source={data.image} style={{ height: 25, width: 25 }} />
                <View style={{ alignSelf: 'center', margin: 5 }}>
                    <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                        <Progress.Circle
                            size={50}
                            progress={data.status / 100}
                            indeterminate={false}
                            animated={true}
                            color={data.darkColor}
                            unfilledColor="#ededed"
                            borderWidth={0}
                            thickness={5}
                            strokeCap="round"
                            style={{
                                shadowColor: 'grey',
                                shadowOffset: { width: 2, height: 2 },
                                shadowOpacity: 0.1,
                                shadowRadius: 1,
                            }}
                        />
                        <Text style={{ position: 'absolute', fontSize: 16, fontWeight: 'bold', color: data.darkColor }}>
                            {Math.round(data.status)}%
                        </Text>
                    </View>

                </View>
                <View>
                    <Text style={{
                        fontSize: 10,
                    }}>
                        {calculateDayCount(userData.created_at) || "Day - 1"}
                    </Text>
                    <Text style={{
                        fontSize: 10,
                    }}>
                        {'Time   0 min'}
                    </Text>
                </View>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}>
                    <Text>{data.name}</Text>
                    <View
                        style={{
                            backgroundColor: data.lightColor,
                            padding: 2,
                            borderRadius: 10,
                        }}>
                        <Image
                            resizeMode='contain'
                            source={next}
                            style={{
                                height: 12,
                                width: 12
                            }}
                        />
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};
const Header = ({ data }) => {
    const navigation = useNavigation();
    return (
        <View style={styles.header}>
            <ImageContainer image={headerImage} />
            <HeaderTitle data={data} />
            <TouchableOpacity onPress={() => navigation.navigate('Activities')}>
                <ImageContainer image={notification} height={'50%'} width={'50%'} />
            </TouchableOpacity>
        </View>
    );
}

const Banner = ({ data }) => (
    <>
        <ImageBackground style={styles.banner}>
            <View style={styles.bannerContainer}>
                <View style={styles.rowLabel}>
                    <Text style={styles.offer}>Start Your work out now</Text>
                    <View style={styles.fireContainer}>
                        <Image
                            source={fire}
                            style={styles.fireImage}
                            resizeMode='contain'
                        />
                    </View>
                </View>
                <BannerText>{calculateDayCount(data.created_at) || "Day - 1"}</BannerText>
                <BannerText>{toSentenceCase(data.selectedBodyParts[0]) + "  workout"}</BannerText>
            </View>
        </ImageBackground>
        <WorkoutImage userGender={data.gender} userSelectedWorkout={data.selectedBodyParts[0]} style={styles.model} />
    </>
);

const BannerText = ({ children }) => (
    <Text style={styles.bannerText}>{children}</Text>
);

const ImageContainer = ({ image, height = '100%', width = '100%', tintColor }) => (
    <View style={styles.imageContainer}>
        <Image source={image} style={[{ height, width, tintColor }]} />
    </View>
);

const HeaderTitle = ({ data }) => {
    return (
        <View style={styles.title}>
            <Text style={styles.bigTitle}>Hi, {data.name}</Text>
            <Text style={styles.smallTitle}>{data.level}</Text>
        </View>
    );
};

const calculateDayCount = (createdAt) => {
    // Parse the created_at timestamp
    const createdDate = new Date(createdAt);

    // Get the current date
    const currentDate = new Date();

    // Calculate the difference in milliseconds
    const timeDifference = currentDate - createdDate;

    // Convert milliseconds to days
    const dayCount = Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1; // Add 1 for Day One

    return `Day - ${dayCount}`;
};

const toSentenceCase = (str) => {
    if (!str) return str;
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};


const getWorkoutData = async (email, token) => {
    const date = new Date();
    try {
        const response = await fetch(`${base_url}/wokout/${date}/${email}`, {
            method: "GET",
            headers: {
                "Accept": "application/json",
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Workout data:", data);
        return data
    } catch (error) {
        console.error("Error fetching workout:", error);
    }
};


const Label = ({ children }) => <Text style={styles.label}>{children}</Text>;
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 5,
        marginHorizontal: 15,
        marginTop: 10,
        flexDirection: 'row',
        alignItems: 'center',
    },
    title: { paddingHorizontal: 10, flex: 1, justifyContent: 'center' },
    bigTitle: {
        fontSize: 16,
        color: 'white'
        // fontFamily: 'Poppins-Medium' 
    },
    smallTitle: {
        fontSize: 10,
        color: 'white',
        //  fontFamily: 'Poppins-Regular', 
        opacity: 0.6
    },
    image: { height: '100%', width: '100%' },
    fireImage: { height: 15, width: 15, alignSelf: 'center', margin: 5 },
    banner: {
        marginTop: 20,
        marginHorizontal: 15,
        padding: 30,
        resizeMode: 'contain',
        borderRadius: 20,
        overflow: 'hidden',
        flexDirection: 'row',
        backgroundColor: '#8860a3'
    },
    bannerContainer: { flex: 1 },
    label: {
        // fontFamily: 'Poppins-Medium',
        color: 'white',
        fontSize: 20, marginVertical: 10
    },
    model: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        zIndex: 10,
        height: '70%',
        width: '50%',
        transform: [{ rotateY: '180deg' }],
    },
    imageContainer: {
        height: 50,
        width: 50,
        borderRadius: 25,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
    },
    screen: { marginTop: 50 },
    offer: {
        color: 'white',
        // fontFamily: 'Poppins-Regular', 
        fontSize: 10
    },
    bannerText: {
        color: 'white', fontSize: 16,
        //  fontFamily: 'Poppins-Regular' 
    },

    rowLabel: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    fireContainer: {
        justifyContent: 'center',
        alignItems: 'center',
    },
});

const data1 = [
    {
        name: 'Cycling',
        status: 0,
        image: cycle,
        lightColor: '#f8e4d9',
        color: '#fcf1ea',
        darkColor: '#fac5a4',
    },
    {
        name: 'Walking',
        status: 0,
        image: walk,
        lightColor: '#d7f0f7',
        color: '#e8f7fc',
        darkColor: '#aceafc',
    },
    {
        name: 'Yoga',
        status: 0,
        image: yoga,
        lightColor: '#dad5fe',
        color: '#e7e3ff',
        darkColor: '#8860a2',
    },
];