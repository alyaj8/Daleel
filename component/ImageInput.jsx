import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { images, screenWidth } from "../config/Constant";
import text from "../style/text";

const ImageInput = ({
  label = "ارفق صورة",
  imageUri,
  onRemoveImage = () => {
    console.log("onRemoveImage");
  },
  onPickImage = () => {
    console.log("onPickImage");
  },
  imageStye,
  ...rest
}) => {
  return (
    <View
      style={{
        marginLeft: 2,
        width: screenWidth.width40,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* Label */}
      <Text style={[text.themeDefault, text.text15]}>{label}</Text>

      {/* Image */}
      {!!imageUri ? (
        <View
          style={{
            // marginTop: screenWidth.width20,
            alignItems: "flex-end",
            height: screenWidth.width30,
          }}
        >
          <TouchableOpacity onPress={onRemoveImage}>
            <Image
              source={{ uri: imageUri }}
              style={{
                width: screenWidth.width30,
                height: screenWidth.width30,
                resizeMode: "contain",
                ...imageStye,
              }}
            />
          </TouchableOpacity>
        </View>
      ) : (
        // Pick Image
        <TouchableOpacity
          onPress={onPickImage}
          style={{ alignItems: "flex-end" }}
        >
          <Image
            source={images.photo}
            style={{
              width: screenWidth.width30,
              height: screenWidth.width30,
              resizeMode: "contain",
              ...imageStye,
            }}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default ImageInput;

const styles = StyleSheet.create({});
