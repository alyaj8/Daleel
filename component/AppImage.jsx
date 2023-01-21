import CachedImage from "expo-cached-image";
import React from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import sh from "shorthash";
import { colors } from "../config/Constant";

const AppImage = ({ sourceURI, ...otherProps }) => {
  const name = sh.unique(sourceURI);

  return (
    <CachedImage
      source={{ uri: sourceURI }}
      cacheKey={name}
      placeholderContent={
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ActivityIndicator
            color={colors.outlineBg}
            size="small"
            style={{
              flex: 1,
              alignContent: "center",
              alignSelf: "center",
              justifyContent: "center",
            }}
          />
        </View>
      }
      // resizeMode="contain"
      {...otherProps}
    />
  );
};

export default AppImage;

const styles = StyleSheet.create({});
