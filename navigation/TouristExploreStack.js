import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import TouristExplore from "../Screens/Tourist/TouristExplore";
import TouristDetailedInformation from "./../Screens/Tourist/TouristDetailedInformation";
import Comment from "../Screens/Tourist/Comment";
import Review2 from "../Screens/Tourist/Review2";
const Stack = createNativeStackNavigator();

function TouristExploreStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TouristExplore" component={TouristExplore} />
      <Stack.Screen
        name="TouristDetailedInformation"
        component={TouristDetailedInformation}
      />
      <Stack.Screen
        name="Comment"
        component={Comment}
      />

      <Stack.Screen
        name="Review2"
        component={Review2}
      />



    </Stack.Navigator>
  );
}

export default TouristExploreStack;
