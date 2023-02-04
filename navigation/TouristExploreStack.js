import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import TouristExplore from "../Screens/Tourist/TouristExplore";
import TouristDetailedInformation from "./../Screens/Tourist/TouristDetailedInformation";

const Stack = createNativeStackNavigator();

function TouristExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TouristExplore" component={TouristExplore} />
      <Stack.Screen
        name="TouristDetailedInformation"
        component={TouristDetailedInformation}
      />
    </Stack.Navigator>
  );
}

export default TouristExploreStack;
