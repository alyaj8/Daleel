import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import EditTourV2 from "../Screens/Local/EditTourV2";
import TourDetail from "../Screens/Local/TourDetail";
import TourDetailedInformation from "../Screens/Local/TourDetailedInformation";
const Stack = createNativeStackNavigator();

function TourStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="TourDetail" component={TourDetail} />

      <Stack.Screen
        name="TourDetailedInformation"
        component={TourDetailedInformation}
      />
      <Stack.Screen name="EditTour" component={EditTourV2} />
    </Stack.Navigator>
  );
}

export default TourStack;
