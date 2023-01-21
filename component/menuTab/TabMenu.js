import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { screenWidth } from "../../config/Constant";
import text from "../../style/text";
export default function TabMenu({ navigation }) {
  const menuTab = [
    { title: "الكل", selected: false },
    { title: "مرفوضة ", selected: false },
    { title: "مقبولة", selected: false },
  ];
  const [selectedMenu, setSelectedMenu] = useState(0);

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.flexDirection, styles.tabColor]}>
        {menuTab.map((menu, index) => {
          return (
            <View key={index}>
              <TouchableOpacity
                onPress={() => onPressTab(index)}
                style={[
                  styles.headerTab,
                  {
                    backgroundColor:
                      selectedMenu == index ? "#d9d9d9" : "#f1f1f1",
                  },
                ]}
              >
                <Text style={[text.themeDefault, text.text20]}>
                  {menu?.title}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // flex: 1,
  },

  headerTab: {
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    paddingVertical: 10,
    width: screenWidth.width30,
    alignItems: "center",
  },
  tabColor: {
    backgroundColor: "#f1f1f1",
    width: screenWidth.width90,
    alignSelf: "center",
    borderRadius: 20,
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
});
