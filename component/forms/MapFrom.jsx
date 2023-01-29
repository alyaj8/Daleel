import React from "react";
import { useController } from "react-hook-form";
import { StyleSheet, Text } from "react-native";
import InputMap from "../maps/InputMap";

const MapFrom = ({
  name,
  control,
  errors,

  // rest
  label,
  placeholder,
  onSelectLocation,
  onClearLocation,
  style,
}) => {
  const {
    field: { onBlur, value },
    fieldState: { invalid, isTouched, isDirty, error },
  } = useController({
    name,
    control,
  });

  console.log("🚀 ~ name", name);
  console.log("🚀 ~ isTouched", isTouched);
  console.log("🚀 ~ value", value);
  console.log("🚀 ~ error", error);
  return (
    <>
      <InputMap
        label={label}
        placeholder={placeholder}
        onSelectLocation={onSelectLocation}
        onClearLocation={onClearLocation}
        style={style}
        value={value}
        onBlur={onBlur}
      />

      {error && <Text style={{ color: "red" }}>{error?.message}</Text>}
    </>
  );
};

export default MapFrom;

const styles = StyleSheet.create({});
