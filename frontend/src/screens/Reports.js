import React, { useRef, useState, useEffect } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import moment, { duration } from 'moment';
import Swiper from 'react-native-swiper';
import { Ionicons } from "@expo/vector-icons";
import LoadingScreen from './LoadingScreen';
import { jwtDecode } from 'jwt-decode';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width } = Dimensions.get('window');
const { base_url } = require("../../config");
const workout = require('../data/workoutData.json');
const category = 'calves';
const level = 'advanced';



const Reports = () => {
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);
    const [token, setToken] = useState();
    const [WorkoutData, setWorkoutData] = useState([]);
    const [loading, setLoading] = useState(true);

    const weeks = React.useMemo(() => {
        const start = moment().add(week, 'weeks').startOf('week');

        return [-1, 0, 1].map(adj => {
            return Array.from({ length: 7 }).map((_, index) => {
                const date = moment(start).add(adj, 'week').add(index, 'day');
                return {
                    weekday: date.format('ddd'),
                    date: date.toDate(),
                };
            });
        });
    }, [week]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                const token = await AsyncStorage.getItem("auth_token");
                const data = await AsyncStorage.getItem("@MyApp_user");
                const decodedToken = jwtDecode(token);
                const work = await getWorkoutData(value, decodedToken.email, token);
                setWorkoutData(work);
            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false); // Always set loading to false after fetch
            }
        };

        fetchUserDetails();
    }, []);
    

    // if (loading) {
    //     // Display a loading indicator while fetching user details
    //     return <LoadingScreen message="Loading your activities..." />;
    // }

    const calculateTotalExercise = () => {
        // return workout.exercises[category][level].length
        return WorkoutData.length
    };
    const calculateTotalTime = () => {
        let count = 0;
        // workout.exercises[category][level].forEach(item => {
            WorkoutData.forEach(item => {
            count += parseInt(item.workoutDuration.match(/\d+/)[0])
        });
        return count;
    };
    const calculateTotalcalories = () => {
        // onDateChange();
        let calCount = 0;
        // workout.exercises[category][level].forEach(item => {
            WorkoutData.forEach(item => {
            calCount += parseInt(item.calBurnPerRep.match(/\d+/)[0]);
        });
        return calCount;
    }

    return (
        // <SafeAreaView style={{ flex: 1 }}>
        <ImageBackground
            source={require('../../assets/images/background.png')}
            style={styles.container}
        >
            <View style={styles.container}>
                <View style={styles.header}>
                    <Text style={styles.maintitle}>Reports</Text>
                </View>
                {/* <View style={styles.picker}>
                    <Swiper
                        index={1}
                        ref={swiper}
                        loop={false}
                        showsPagination={false}
                        onIndexChanged={ind => {
                            if (ind === 1) {
                                return;
                            }
                            setTimeout(() => {
                                ;
                                const newIndex = ind - 1;
                                const newWeek = week + newIndex;
                                setWeek(newWeek);
                                setValue(moment(value).add(newIndex, 'week').toDate());
                                onDateChange(moment(value).add(newIndex, 'week').toDate());
                                // swiper.current.scrollTo(1, false);
                            }, 100);
                        }}
                        >
                        {weeks.map((dates, index) => (
                            <View style={styles.itemRow} key={index}>
                                {dates.map((item, dateIndex) => {
                                    const isActive =
                                        value.toDateString() === item.date.toDateString();
                                        // onDateChange(value);
                                    return (
                                        <TouchableWithoutFeedback
                                            key={dateIndex}
                                            onPress={() => setValue(item.date)}>
                                            <View
                                                style={[
                                                    styles.item,
                                                    isActive && {
                                                        backgroundColor: '#4caf5099',
                                                        borderColor: '#fff',
                                                    },
                                                ]}>
                                                <Text
                                                    style={[
                                                        styles.itemWeekday,
                                                        isActive && { color: '#fff' },
                                                    ]}>
                                                    {item.weekday}
                                                </Text>
                                                <Text
                                                    style={[
                                                        styles.itemDate,
                                                        isActive && { color: '#fff' },
                                                    ]}>
                                                    {item.date.getDate()}
                                                </Text>
                                            </View>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                            </View>
                        ))}
                    </Swiper>
                </View> */}
                <View style={styles.totalReport}>
                    <Text style={styles.subtitle}>Today's Total:</Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <View>
                            <Text style={styles.innerItems}>Calories Burnt:</Text>
                            <Text>{calculateTotalcalories() + 'Calories'}</Text>
                        </View>
                        <View>
                            <Text style={styles.innerItems}>Duration:</Text>
                            <Text>{calculateTotalTime() + 'Mins'}</Text>
                        </View>
                        <View>
                            <Text style={styles.innerItems}>Exercises:</Text>
                            <Text>{calculateTotalExercise()}</Text>
                        </View>
                    </View>
                </View>
                <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24, marginBottom: 24 }}>
                    <Text style={styles.subtitle}>{value.toDateString()}</Text>
                    <ScrollView>
                        {/* {workout.exercises[category][level].map((item, index) => ( */}
                        {WorkoutData.map((item, index) => (
                            <View key={index}>
                                {/* <Text style={styles.header}>Warm-up Exercises</Text> */}
                                <View style={styles.card}>
                                    <View>
                                        <Image
                                            source={{ uri: item.workoutGIF }}
                                            style={styles.image}
                                        />
                                        <Text style={styles.title}>{item.workoutName}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-around' }}>
                                        <Text style={styles.totalInnerItems}><Ionicons name="time" size={18} color="grey" /> Duration: {item.workoutDuration}</Text>
                                        <Text style={styles.totalInnerItems}> <Ionicons name="body" size={18} color="green" /> Total Reps: {item.reps}</Text>
                                        <Text style={styles.totalInnerItems}><Ionicons name="flame" size={18} color="red" /> Calorie Burnt: {item.calBurnPerRep * 10}</Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>
                </View>
            </View>
        </ImageBackground>
        // </SafeAreaView >
    );
}

export default Reports;

const getWorkoutData = async (date, email, token) => {
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

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingVertical: 24,
    },
    header: {
        paddingHorizontal: 16,
    },
    maintitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
        padding: 15,
    },
    totalReport: {
        padding: 15,
        width: "90%",
        height: '15%',
        alignSelf: "center",
        backgroundColor: 'rgb(161 152 208)',
        borderRadius: 10
    },
    totalInnerItems: {
        fontSize: 14,
        marginTop: 5,
        justifyContent: 'flex-start',
        textAlign: 'center',
        alignItems: 'center',
    },
    picker: {
        flex: 1,
        maxHeight: 74,
        paddingVertical: 12,
        flexDirection: 'row',
    },
    subtitle: {
        fontSize: 17,
        fontWeight: '600',
        color: '#fff',
        marginBottom: 12,
    },
    footer: {
        marginTop: 'auto',
        paddingHorizontal: 16,
    },
    item: {
        flex: 1,
        height: 50,
        marginHorizontal: 4,
        paddingVertical: 6,
        paddingHorizontal: 4,
        borderWidth: 1,
        borderRadius: 8,
        borderColor: '#fff',
        flexDirection: 'column',
        alignItems: 'center',
    },
    itemRow: {
        width: width,
        flexDirection: 'row',
        alignItems: 'flex-start',
        justifyContent: 'space-between',
        paddingHorizontal: 12,
    },
    itemWeekday: {
        fontSize: 13,
        fontWeight: '500',
        color: '#fff',
        marginBottom: 4,
    },
    itemDate: {
        fontSize: 15,
        fontWeight: '600',
        color: '#fff',
    },
    card: {
        backgroundColor: "#FFFFFF",
        borderRadius: 10,
        flexDirection: 'row',
        width: "100%",
        padding: 15,
        marginVertical: 10,
        justifyContent: 'space-between',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
    },
    image: {
        width: 100,
        height: 50,
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
        color: "lihgtgrey",
    },
    innerItems: {
        display: 'flex',
        fontSize: 14,
        fontWeight: '600',
        color: "#000",
        marginTop: 5,
        justifyContent: 'flex-start',
        textAlign: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: "#fff",
        fontSize: 16,
        fontWeight: "bold",
    },
});
