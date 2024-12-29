import { useFocusEffect, useNavigation } from '@react-navigation/native';
import React, { useState, useEffect, useCallback } from 'react';
import {
    Alert,
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
import { useFormState } from 'react-dom';
const { base_url } = require("../../config");
import LoadingScreen from './LoadingScreen';

const headerImage = require('../../assets/images/header.jpg');
const notification = require('../../assets/images/Notification.png');
const banner = require('../../assets/images/bg.png');
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
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const workout = require('../data/workoutData.json');

const Dashboard = () => {
    const navigation = useNavigation();
    const [category, setCategory] = useState('chest');
    const [level, setLevel] = useState('beginner');
    const [userData, setUserData] = useState({});
    const [token, setToken] = useState();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("baseData");
                const decodedToken = jwtDecode(token);

                if (data) {
                    setToken(token);
                    setUserData(JSON.parse(data));
                    setCategory(JSON.parse(data).selectedBodyParts[0]);
                    setLevel(JSON.parse(data).level);
                    return;
                }

                if (token && decodedToken.email) {
                    setToken(token);
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
                Alert.alert("Error", "An error occurred while fetching user details. Please re-login again.");
                console.error("Error fetching user details", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserDetails();
    }, []);

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
                            {workout.exercises[category].warmup.map((item, index) => (
                                <VideoPlayWarmup
                                    category={category}
                                    level={level}
                                    userData={userData}
                                    index={index}
                                    key={index}
                                    data={workout}
                                />
                            ))}
                        </View>
                    </ScrollView>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 20 }}>
                        <Label>Today's Workout</Label>
                        {/* <Text style={{ opacity: 0.5, fontSize: 12, color: 'white' }}> View All</Text> */}
                    </View>
                    <ScrollView horizontal={true}>
                        <View style={{ paddingBottom: 80, flexDirection: 'row', overflow: 'scroll' }}>
                            {workout.exercises[category][level].map((item, index) => (
                                <VideoPlay
                                    category={category}
                                    level={level}
                                    userdata={userData}
                                    index={index}
                                    key={index}
                                    data={workout}
                                />
                            ))}
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
    const currentIndex = data.index;
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

    const fetchWarmupCompleted = useCallback(async () => {
        try {
            const storedWarmupCompleted = JSON.parse(await AsyncStorage.getItem("warmupCompleted")) || [];
            const storedWorkoutCompleted = JSON.parse(await AsyncStorage.getItem("workoutCompleted")) || [];
            setWarmupCompleted(storedWarmupCompleted);
            setWorkoutCompleted(storedWorkoutCompleted);

            if (storedWarmupCompleted.length > 0 && storedWarmupCompleted.every((completed) => completed)) {
                setAllWarmupsCompleted(true);
            }
        } catch (error) {
            console.error("Error fetching warmup and workout completed:", error);
        }
    }, []);

    useFocusEffect(
        useCallback(() => {
            fetchWarmupCompleted();
        }, [fetchWarmupCompleted])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Workouts", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex, onWorkoutComplete: onWorkoutComplete })} disabled={warmupCompleted[lastIndex]}>
            {allWarmupsCompleted && (
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
                    <Text style={{
                        // fontFamily: 'Poppins-Regular' 
                    }}>
                        {currentExercise.title}
                    </Text>
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
    const isLastExercise = currentIndex === data.data.exercises[category].warmup.length - 1;
    const allExercises = data.data.exercises[category].warmup;
    const currentExercise = data.data.exercises[category].warmup[currentIndex];
    const [warmupCompleted, setWarmupCompleted] = useState([]);

    useFocusEffect(
        useCallback(() => {
            const fetchWarmupCompleted = async () => {
                try {
                    const storedWarmupCompleted = JSON.parse(await AsyncStorage.getItem("warmupCompleted")) || [];
                    setWarmupCompleted(storedWarmupCompleted);
                } catch (error) {
                    console.error("Error fetching warmup completed:", error);
                }
            };

            fetchWarmupCompleted();
        }, [])
    );

    return (
        <TouchableOpacity onPress={() => navigation.navigate("Warmups", { allExercises: allExercises, currentExercise: currentExercise, isLastExercise: isLastExercise, currentIndex: currentIndex })}>
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
                    <Text style={{
                        // fontFamily: 'Poppins-Regular' 
                    }}>
                        {currentExercise.title}
                    </Text>
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
        <ImageBackground style={styles.banner} source={banner}>
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
        <Image source={model} style={styles.model} resizeMode="contain" />
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
        height: '75%',
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