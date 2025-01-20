import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Button,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';

export default function ReminderScreen() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [notificationTime, setNotificationTime] = useState({ hour: 12, minute: 0 });
  const [selectedDays, setSelectedDays] = useState([]);
  const [repeatDays, setRepeatDays] = useState([]);
  const [selectedReminder, setSelectedReminder] = useState(null);
  const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    const loadReminders = async () => {
      const savedReminders = await AsyncStorage.getItem('reminders');
      if (savedReminders) {
        setReminders(JSON.parse(savedReminders));
      }
    };
    loadReminders();
  }, []);

  const saveReminders = async (updatedReminders) => {
    await AsyncStorage.setItem('reminders', JSON.stringify(updatedReminders));
  };
  
  const scheduleNotification = async (hour, minute, repeatDays) => {
    const now = new Date();
    const triggerDate = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      hour,
      minute,
      0
    );

    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Reminder',
        body: 'It’s time for your scheduled activity!',
      },
      trigger: {
        hour: triggerDate.getHours(),
        minute: triggerDate.getMinutes(),
        repeats: repeatDays.length > 0,
      },
    });

    const newReminder = { id, hour, minute, repeatDays, enabled: true };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
  };

  const handleAddReminder = () => {
    if (selectedReminder) {
      const updatedReminders = reminders.map((reminder) =>
        reminder.id === selectedReminder.id
          ? { ...reminder, hour: notificationTime.hour, minute: notificationTime.minute, repeatDays }
          : reminder
      );
      setReminders(updatedReminders);
      saveReminders(updatedReminders);
    } else {
      scheduleNotification(notificationTime.hour, notificationTime.minute, repeatDays);
    }
    setIsModalVisible(false);
    setSelectedReminder(null);
  };

  const toggleModal = (reminder) => {
    if (reminder) {
      setSelectedReminder(reminder);
      setNotificationTime({ hour: reminder.hour, minute: reminder.minute });
      setRepeatDays(reminder.repeatDays);
    } else {
      setSelectedReminder(null);
      setNotificationTime({ hour: 20, minute: 0 });
      setRepeatDays([]);
    }
    setIsModalVisible(!isModalVisible);
  };

  const toggleReminderEnabled = async (id) => {
    const updatedReminders = reminders.map((reminder) =>
      reminder.id === id ? { ...reminder, enabled: !reminder.enabled } : reminder
    );
    setReminders(updatedReminders);
    saveReminders(updatedReminders);

    const reminder = updatedReminders.find((reminder) => reminder.id === id);
    if (!reminder.enabled) {
      await Notifications.cancelScheduledNotificationAsync(id);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reminder</Text>
      {reminders.map((reminder, index) => (
        <View key={index} style={styles.reminder}>
          <Text style={styles.reminderText}>
            {`Time: ${reminder.hour}:${reminder.minute} - Repeat: ${reminder.repeatDays.join(', ')}`}
          </Text>
          <Switch
            value={reminder.enabled}
            onValueChange={() => toggleReminderEnabled(reminder.id)}
          />
          <Button title="Edit" onPress={() => toggleModal(reminder)} />
        </View>
      ))}
      
      <TouchableOpacity style={styles.addButton} onPress={() => toggleModal(null)}>
        <Text style={styles.addButtonText}>+ Add</Text>
      </TouchableOpacity>

      <Modal visible={isModalVisible} animationType="slide">
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Set Reminder</Text>
<ScrollView>
          {/* Hour Picker */}
          <Text style={styles.pickerLabel}>Hour</Text>
          <Picker
            selectedValue={String(notificationTime.hour)} // Convert to string to avoid type mismatch
            onValueChange={(value) =>
              setNotificationTime((prev) => ({ ...prev, hour: parseInt(value, 10) })) // Ensure value is parsed as a number
            }
          >
            {Array.from({ length: 24 }, (_, i) => (
              <Picker.Item key={i} label={String(i)} value={String(i)} /> // Ensure both label and value are strings
            ))}
          </Picker>

          {/* Minute Picker */}
          <Text style={styles.pickerLabel}>Minute</Text>
          <Picker
            selectedValue={String(notificationTime.minute)} // Convert to string to prevent type mismatch
            onValueChange={(value) =>
              setNotificationTime((prev) => ({ ...prev, minute: parseInt(value, 10) })) // Parse as an integer
            }
          >
            {Array.from({ length: 60 }, (_, i) => (
              <Picker.Item key={i} label={String(i)} value={String(i)} /> // Ensure both label and value are strings
            ))}
          </Picker>

          {/* Day Picker */}
          <Text style={styles.pickerLabel}>Repeat Days</Text>
          {daysOfWeek.map((day) => (
            <View key={day} style={styles.dayOption}>
              <Text>{day}</Text>
              <Button
                title={repeatDays?.includes(day) ? 'Remove' : 'Add'}
                onPress={() =>
                  setRepeatDays((prev) =>
                    prev?.includes(day)
                      ? prev.filter((d) => d !== day)
                      : [...prev, day]
                  )
                }
              />
            </View>
          ))}
</ScrollView>
          <Button title="Set Reminder" onPress={handleAddReminder} />
          <Button title="Close" onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  reminder: {
    padding: 15,
    backgroundColor: '#f9f9f9',
    marginVertical: 5,
    borderRadius: 5,
  },
  reminderText: {
    fontSize: 16,
  },
  addButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 5,
    marginTop: 20,
  },
  addButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  pickerLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 20,
  },
  dayOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 5,
  },
});
