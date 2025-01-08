import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
  Dimensions,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FeatherIcons from "react-native-vector-icons/Feather";
import Icon from "react-native-vector-icons/MaterialIcons";

const Popup = ({ visible, onClose, data }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);

  // Load selected workouts from AsyncStorage on component mount
  useEffect(() => {
    const loadSelectedWorkouts = async () => {
      const storedWorkouts = await AsyncStorage.getItem("selectedWorkouts");
      if (storedWorkouts) {
        setSelectedWorkouts(JSON.parse(storedWorkouts));
      }
    };
    loadSelectedWorkouts();
  }, []);

  // Save selected workouts to AsyncStorage whenever they change
  useEffect(() => {
    const saveSelectedWorkouts = async () => {
      await AsyncStorage.setItem(
        "selectedWorkouts",
        JSON.stringify(selectedWorkouts)
      );
    };
    saveSelectedWorkouts();
  }, [selectedWorkouts]);

  // Handle workout selection or unselection
  const handleWorkoutSelectionChange = (title) => {
    if (selectedWorkouts.includes(title)) {
      // Unselect workout
      setSelectedWorkouts((prev) =>
        prev.filter((workout) => workout !== title)
      );
    } else {
      // Select workout
      setSelectedWorkouts((prev) => [...prev, title]);
    }
  };

  // Check if a workout is selected
  const isWorkoutSelected = (title) => selectedWorkouts?.includes(title);

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.mask}>
          <TouchableWithoutFeedback>
            <View style={styles.popup}>
              <Text style={styles.title}>Workouts</Text>
              <FlatList
                data={data}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <ScrollView>
                    <TouchableOpacity
                      onPress={() => handleWorkoutSelectionChange(item.title)}
                    >
                      <View
                        style={[
                          styles.listItem,
                          isWorkoutSelected(item.title) && styles.selectedItem,
                        ]}
                      >
                        <Text
                          style={[
                            styles.itemTitle,
                            isWorkoutSelected(item.title) &&
                              styles.selectedText,
                          ]}
                        >
                          {item.title}
                        </Text>

                        <FeatherIcons
                          name="bookmark"
                          size={24}
                          color={
                            isWorkoutSelected(item.title) ? "#fff" : "#000"
                          }
                        />

                        {/* {isWorkoutSelected(item.title) ? (
                          <FeatherIcons
                            name="bookmark"
                            size={24}
                            color="#000"
                          />
                        ) : (
                          <Icon name="bookmark" size={26} color="#f7a000" />
                        )} */}
                      </View>
                    </TouchableOpacity>
                  </ScrollView>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={onClose}>
                <Text style={styles.closeText}>Close</Text>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  mask: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  popup: {
    backgroundColor: "#e2e0e0",
    borderRadius: 10,
    padding: 20,
    width: "90%",
    maxHeight: Dimensions.get("screen").height * 0.6,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  listItem: {
    marginBottom: 10,
    borderRadius: 5,
    borderColor: "#77777780",
    borderWidth: 1,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  selectedItem: {
    backgroundColor: "#c3bdd2",
    borderColor:"#c3bdd2"
  },
  itemTitle: {
    fontSize: 14,
  },
  // selectedText: {
  //   color: "#fff",
  // },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#3d98fb",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  closeText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Popup;
