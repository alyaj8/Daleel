import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import TouristTourDetailedInformation from "../Screens/Tourist/TouristDetailedInformation";
import TouristTour from "../Screens/Tourist/TouristTour";
const Stack = createNativeStackNavigator();

/*const PUBLISHABLE_KEY =
  "pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr";*/
function TourStack() {
  // hide logbox warning

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TourDetail" component={TouristTour} />
      <Stack.Screen
        name="TourDetailedInformation"
        component={TouristTourDetailedInformation}
      />
    </Stack.Navigator>
  );
}

export default TourStack;
