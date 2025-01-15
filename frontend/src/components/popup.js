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
import Icon from "react-native-vector-icons/MaterialIcons";

const Popup = ({ visible, onClose, data }) => {
  const [selectedWorkouts, setSelectedWorkouts] = useState([]);
  const [bookmarkedStatuses, setBookmarkedStatuses] = useState({});
  const [bookmarkedExercises, setBookmarkedExercises] = useState([]);


  useEffect(() => {
    const loadSelectedWorkouts = async () => {
      const storedWorkouts = await AsyncStorage.getItem("selectedWorkouts");
      if (storedWorkouts) {
        setSelectedWorkouts(JSON.parse(storedWorkouts));
      }
    };
    loadSelectedWorkouts();
  }, []);

  useEffect(() => {
    const saveSelectedWorkouts = async () => {
      await AsyncStorage.setItem(
        "selectedWorkouts",
        JSON.stringify(selectedWorkouts)
      );
    };
    saveSelectedWorkouts();
  }, [selectedWorkouts]);

  useEffect(() => {
    const updateBookmarkStatuses = async () => {
      const bookmarkedExercises = await AsyncStorage.getItem('bookmarkedExercises');
      const bookmarks = bookmarkedExercises ? JSON.parse(bookmarkedExercises) : [];
      const newStatuses = {};
      data?.forEach(item => {
        newStatuses[item.title] = bookmarks.includes(item.title);
      });
      setBookmarkedStatuses(newStatuses);
    };
    updateBookmarkStatuses();
  }, [data]);

  const handleWorkoutSelectionChange = (title) => {
    setSelectedWorkouts((prev) =>
      prev.includes(title)
        ? prev.filter((workout) => workout !== title)
        : [...prev, title]
    );
  };

  const toggleBookmark = async (title) => {
    try {
      const storedBookmarks = await AsyncStorage.getItem("bookmarkedExercises");
      const existingBookmarks = storedBookmarks ? JSON.parse(storedBookmarks) : [];

      const updatedBookmarks = existingBookmarks.includes(title)
        ? existingBookmarks.filter(exercise => exercise !== title)
        : [...existingBookmarks, title];

      setBookmarkedExercises(updatedBookmarks);

      // Update bookmarkedStatuses state synchronously
      setBookmarkedStatuses(prevStatuses => ({
        ...prevStatuses,
        [title]: !prevStatuses[title]
      }));

      await AsyncStorage.setItem("bookmarkedExercises", JSON.stringify(updatedBookmarks));
    } catch (error) {
      console.error("Error updating bookmarked exercises", error);
    }
  };

  const isWorkoutSelected = (title) => selectedWorkouts.includes(title);

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
                        <TouchableOpacity onPress={() => toggleBookmark(item.title)} style={styles.bookMarkIcon}>
                          <View style={styles.saveIcon}>
                            <Icon
                              name={bookmarkedStatuses[item.title] ? "bookmark" : "bookmark-border"}
                              size={24}
                              color="red"
                            />
                          </View>
                        </TouchableOpacity>
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
