import React, { useState } from "react";
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
  TouchableHighlight
} from "react-native";
import FeatherIcons from "react-native-vector-icons/Feather"; // Icons library
import Icon from "react-native-vector-icons/MaterialIcons";

const Popup = ({ visible, onClose, data }) => {
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
                    <TouchableOpacity>
                      <View style={styles.listItem}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <FeatherIcons name="bookmark" size={24} color="#000" />

                        {/* after seleting workout hilight the icon */}
                        {/* <Icon name="bookmark" size={24} color="#fff" /> */} 
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
    backgroundColor: "white",
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
    borderColor: "rgba(0, 0, 0, 0.5)",
    borderWidth: 1,
    padding: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  itemTitle: {
    fontSize: 14,
    // fontWeight: "bold",
  },
  itemDescription: {
    fontSize: 14,
    color: "gray",
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: "#007BFF",
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
