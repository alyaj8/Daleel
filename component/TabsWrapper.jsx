import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors, screenWidth } from "../config/Constant";

const TabsWrapper = ({
  menuTabs = [
    { title: "Tab 1", selected: false },
    { title: "Tab 2", selected: false },
  ],
  onPressTab = (index) => {
    console.log("onPressTab", index);
  },
  selectedMenu = 0,
  setSelectedMenu,
}) => {
  const [localSelectedMenu, setLocalSelectedMenu] = useState(selectedMenu);

  const onPressTabHandler = (index) => {
    setLocalSelectedMenu(index);
    setSelectedMenu && setSelectedMenu(index);
    onPressTab && onPressTab(index);
  };

  return (
    <View style={styles.container}>
      {menuTabs.map((menu, index) => {
        return (
          <View key={index}>
            <TouchableOpacity
              onPress={() => onPressTabHandler(index)}
              style={{
                ...styles.tab,
                backgroundColor:
                  localSelectedMenu == index ? "#d9d9d9" : "#f1f1f1",
              }}
            >
              <Text style={styles.tabText}>{menu?.title}</Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
};

export default TabsWrapper;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
    backgroundColor: "#f1f1f1",
    // width: screenWidth.width90,
    alignSelf: "center",
    borderRadius: 15,

    // drop shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.75,
    shadowRadius: 5,
    elevation: 6,
  },
  tab: {
    backgroundColor: "#f1f1f1",
    borderRadius: 15,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },

  tabText: {
    color: colors.themeDefault,
    fontWeight: "bold",
    width: "100%",
    fontSize: 20,
    textAlign: "center",
  },
});
