import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from "react-native";

const Counter = ({ initialCount = 0, onCountChange }) => {
    const [count, setCount] = useState(initialCount);

    const increment = () => {
        const newCount = count + 1;
        setCount(newCount);
        onCountChange(newCount);
    };

    const decrement = () => {
        const newCount = count > 0 ? count - 1 : 0;
        setCount(newCount);
        onCountChange(newCount);
    };

    return (
        <View style={styles.counterContainer}>
            <TouchableOpacity style={styles.button} onPress={decrement}>
                <Text style={styles.buttonText}>-</Text>
            </TouchableOpacity>
            <TextInput style={styles.counterText} value={count} maxLength={3} inputMode="numeric" onChange={(val) => setCount(eval(val.nativeEvent.text))} />
            <TouchableOpacity style={styles.button} onPress={increment}>
                <Text style={styles.buttonText}>+</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    counterContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-around",
        width: 150,
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 15,
        shadowOffset: { width: 0, height: 2 },
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    button: {
        backgroundColor: "#4CAF50",
        height: 40,
        width: 40,
        borderRadius: 10,
        padding: 20,
        alignItems: "center",
        justifyContent: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    counterText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#000",
        width: 30,
        borderWidth: 0,
        textAlign: "center",
    },
});

export default Counter;
