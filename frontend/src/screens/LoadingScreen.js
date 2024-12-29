import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

const LoadingScreen = ({ message = "Loading..." }) => {
  const fitnessQuotes = [
    "Strength grows in the moments when you think you can’t go on.",
    "Great things come to those who sweat.",
    "Every rep brings you closer to your goal.",
    "You don’t find willpower; you create it.",
    "Logging in is the first step to showing up.",
    "Believe in your potential – the journey begins now.",
    "The pain you feel today is the strength you feel tomorrow.",
    "Fitness is the key to unlocking your potential.",
    "Discipline is choosing what you want most over what you want now.",
    "Consistency is what transforms average into excellence.",
    "Your journey is about to start – give it your all.",
    "Think of every step as progress, not perfection.",
    "Small steps lead to big results – keep moving forward.",
    "Make today your masterpiece.",
    "Hard work beats talent when talent doesn’t work hard.",
    "Start where you are, use what you have, and do what you can.",
    "Your strongest muscle and your worst enemy is your mind – train it well.",
    "Dream big, work hard, stay focused, and surround yourself with good energy.",
    "Fitness is not about being better than someone else; it’s about being better than you used to be.",
    "You don’t get what you wish for; you get what you work for.",
    "Your body can stand almost anything – it’s your mind you have to convince.",
    "Progress, not perfection.",
    "Fall in love with taking care of yourself.",
    "What seems impossible today will one day be your warm-up.",
    "It’s not about being extreme; it’s about being consistent.",
    "Success starts with self-discipline.",
    "The only bad workout is the one you didn’t do.",
    "Excuses don’t burn calories.",
    "Fitness is not a destination; it’s a way of life.",
    "Your health is your wealth.",
    "Push harder than yesterday if you want a different tomorrow.",
    "Work out. Eat well. Be patient. Your body will reward you.",
    "Be stronger than your strongest excuse.",
    "You are capable of more than you know.",
    "A one-hour workout is just 4% of your day.",
    "There’s no secret formula – it’s hard work and determination.",
    "Don’t count the days – make the days count.",
    "Success isn’t always about greatness; it’s about consistency.",
    "You’re not logged in to stay the same – you’re here to transform.",
    "Good things come to those who sweat.",
    "Your future self will thank you for showing up today.",
    "Make yourself a priority.",
    "Let your determination define you, not your obstacles.",
    "Strive for progress, not perfection.",
    "Don’t watch the clock – do what it does. Keep going.",
    "Every day is a chance to get better.",
    "Your body achieves what your mind believes.",
    "Motivation gets you started; habit keeps you going.",
    "Fitness is not about how fast you run or how much you lift – it’s about never giving up."
  ];


  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % fitnessQuotes.length);
    }, 5000); // Change quote every 5 seconds

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#ffffff" />
      <Text style={styles.message}>{message}</Text>
      <Text style={styles.quote}>{fitnessQuotes[currentQuoteIndex]}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#121212', // Match your app's background
    padding: 20,
  },
  message: {
    marginBottom: 20,
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  quote: {
    marginTop: 10,
    color: '#4CAF50',
    fontSize: 16,
    fontWeight: '500',
    fontStyle: 'italic',
    textAlign: 'center',
    paddingHorizontal: 15,
  },
});

export default LoadingScreen;
