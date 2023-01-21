import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import TouristDetailedInformation from "./../Screens/tourist/TouristDetailedInformation";
import TouristTour from "./../Screens/tourist/TouristTour";

const Stack = createNativeStackNavigator();

/*const PUBLISHABLE_KEY =
  "pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr";*/
function TouristTourStack() {
  // hide logbox warning

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TourDetail" component={TouristTour} />
      <Stack.Screen
        name="TourDetailedInformation"
        component={TouristDetailedInformation}
      />
    </Stack.Navigator>
  );
}

export default TouristTourStack;
