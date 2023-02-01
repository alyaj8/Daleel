import React from "react";
import { useController } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import ImageInput from "../ImageInput";

const ImageForm = ({
  name,
  control,
  errors,

  // rest
  label,
  style,
  onRemoveImage,
  onPickImage,
  imageStye,
  ...rest
}) => {
  const {
    field: { onBlur, value },
    fieldState: { invalid, isTouched, isDirty, error },
  } = useController({
    name,
    control,
  });

  // console.log("ImageForm ~ name", name);
  // console.log("ImageForm ~ value", value);
  // console.log("ImageForm ~ isTouched", isTouched);
  // console.log("ImageForm ~ error", error);
  return (
    <View style={style}>
      <ImageInput
        label={label}
        imageUri={value}
        onRemoveImage={onRemoveImage}
        onPickImage={onPickImage}
        imageStye={imageStye}
        {...rest}
      />

      {error && (
        <Text style={{ color: "red", fontWeight: "bold" }}>
          {error?.message}
        </Text>
      )}
    </View>
  );
};

export default ImageForm;

const styles = StyleSheet.create({});
