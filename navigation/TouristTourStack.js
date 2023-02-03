import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import TouristDetailedInformation from "./../Screens/Tourist/TouristDetailedInformation";
import TouristTour from "./../Screens/Tourist/TouristTour";

const Stack = createNativeStackNavigator();

function TouristTourStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TouristTour" component={TouristTour} />
      <Stack.Screen
        name="TouristDetailedInformation"
        component={TouristDetailedInformation}
      />
    </Stack.Navigator>
  );
}

export default TouristTourStack;
