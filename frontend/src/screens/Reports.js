import { useNavigation } from "@react-navigation/native";
import React, { useRef, useState } from "react";
import { View, Text, StyleSheet, Image, Dimensions, ImageBackground, TouchableWithoutFeedback, TouchableOpacity, ScrollView, SafeAreaView } from "react-native";
import moment from 'moment';
import Swiper from 'react-native-swiper';
const { width } = Dimensions.get('window');
const home = require('../../assets/images/Home.png');
const heart = require('../../assets/images/H.png');
const dumbbell = require('../../assets/images/dumbbell.png');
const profile = require('../../assets/images/User.png');
const workout = require('../data/workoutData.json');



const Reports = () => {
    const swiper = useRef();
    const [value, setValue] = useState(new Date());
    const [week, setWeek] = useState(0);
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
        <SafeAreaView style={{ flex: 1 }}>
            <ImageBackground
                source={require('../../assets/images/background.png')}
                style={styles.container}
            >
                <View style={styles.container}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Your Schedule</Text>
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
                                                            backgroundColor: '#fff',
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
                    {/* <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
                        <Text style={styles.subtitle}>{value.toDateString()}</Text>
                        <View style={styles.placeholder}>
                            <View style={styles.placeholderInset}>
                                
                            </View>
                        </View>
                    </View>
                    <View style={styles.footer}>
                        <TouchableOpacity
                            onPress={() => {
                                // handle onPress
                            }}>
                            <View style={styles.btn}>
                                <Text style={styles.btnText}>Schedule</Text>
                            </View>
                        </TouchableOpacity>
                    </View> */}
                </View>
            </ImageBackground>
        </SafeAreaView>
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
    title: {
        fontSize: 32,
        fontWeight: '700',
        color: '#fff',
        marginBottom: 12,
    },
    picker: {
        flex: 1,
        maxHeight: 74,
        paddingVertical: 12,
        flexDirection: 'row',
        alignItems: 'center',
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
    /** Item */
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
    /** Placeholder */
    placeholder: {
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
        height: 400,
        marginTop: 0,
        padding: 0,
        backgroundColor: 'yellow',
    },
    placeholderInset: {
        borderWidth: 4,
        borderColor: '#fff',
        borderStyle: 'dashed',
        borderRadius: 9,
        flexGrow: 1,
        flexShrink: 1,
        flexBasis: 0,
    },
    /** Button */
    btn: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 8,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderWidth: 1,
        backgroundColor: 'lightblue',
        borderColor: '#fff',
    },
    btnText: {
        fontSize: 18,
        lineHeight: 26,
        fontWeight: '600',
        color: '#fff',
    },
});
