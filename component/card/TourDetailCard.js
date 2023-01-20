import * as React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { images, screenWidth ,colors} from "../../config/Constant";
import text from "../../style/text";

export default function Input({ onpress, source, title }) {
  //   console.log("🚀 ~ title", title);
  //   console.log("🚀 ~ source", source);
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onpress} style={[styles.card]}>
        <View style={[styles.flexDirection]}>
          <View style={{}}>
            {source.uri ? (
              <Image source={source} style={[styles.img]} />
            ) : (
              <Image source={images.photo} style={[styles.img]} />
            )}
          </View>
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text
              style={[
                
                text.text20,
                { textAlign: "center", fontWeight: "bold", color:colors.textHeadingColor },
              ]}
            >
              {title}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    width: screenWidth.width90,
    padding: 20,
    borderRadius: 10,
    backgroundColor: "#fff",
    alignSelf: "center",
      ///shadowEffect
      shadowColor: '#171717',
      shadowOffset: {width: -1, height: 4},
      shadowOpacity: 0.3,
      shadowRadius: 3, 
  },
  flexDirection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  img: {
    width: screenWidth.width30,
    height: screenWidth.width40,
    resizeMode: "contain",
  },
});
