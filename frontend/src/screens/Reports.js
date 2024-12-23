import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import moment, { duration } from 'moment';
import Swiper from 'react-native-swiper';
import { Ionicons } from "@expo/vector-icons";
const { width } = Dimensions.get('window');
const workout = require('../data/workoutData.json');
const category = 'calves';
const level = 'advanced';



const Reports = () => {
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);

    const calculateTotalExercise = () => {
        return workout.exercises[category][level].length
    };
    const calculateTotalTime = () => {
        let count = 0;
        workout.exercises[category][level].forEach(item => {
            count += parseInt(item.duration.match(/\d+/)[0])
        });
        return count;
    };
    const calculateTotalcalories = () => {
        let calCount = 0;
        workout.exercises[category][level].forEach(item => {
            calCount += parseInt(item.caloriesBurnedPerRepMen.match(/\d+/)[0]);
        });
        return calCount;
    }
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
                <View style={styles.picker}>
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
                                const newIndex = ind - 1;
                                const newWeek = week + newIndex;
                                setWeek(newWeek);
                                setValue(moment(value).add(newIndex, 'week').toDate());
                                swiper.current.scrollTo(1, false);
                            }, 100);
                        }}>
                        {weeks.map((dates, index) => (
                            <View style={styles.itemRow} key={index}>
                                {dates.map((item, dateIndex) => {
                                    const isActive =
                                        value.toDateString() === item.date.toDateString();
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
                </View>
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
                        {workout.exercises[category][level].map((item, index) => (
                            <View key={index}>
                                {/* <Text style={styles.header}>Warm-up Exercises</Text> */}
                                <View style={styles.card}>
                                    <View>
                                        <Image
                                            source={{ uri: item.image }}
                                            style={styles.image}
                                        />
                                        <Text style={styles.title}>{item.title}</Text>
                                    </View>
                                    <View style={{ justifyContent: 'space-around' }}>
                                        <Text style={styles.totalInnerItems}><Ionicons name="time" size={18} color="grey" /> Duration: {item.duration}</Text>
                                        <Text style={styles.totalInnerItems}> <Ionicons name="body" size={18} color="green" /> Total Reps: 10</Text>
                                        <Text style={styles.totalInnerItems}><Ionicons name="flame" size={18} color="red" /> Calorie Burnt: {item.caloriesBurnedPerRepMen * 10}</Text>
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
        backgroundColor: '#ffffff66',
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
