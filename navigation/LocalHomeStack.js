import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import BookingDetail from "../Screens/Local/BookingDetail";
import EditTourV4 from "../Screens/Local/EditTourV4";
import TourDetailedInformation from "../Screens/Local/TourDetailedInformation";
import Local_Home from "../Screens/Local_Home";
import Localcomments from "../Screens/Local/Localcomments"; 

const Stack = createNativeStackNavigator();

function LocalHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Local_Home" component={Local_Home} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} />
      <Stack.Screen
        name="TourDetailedInformation"
        component={TourDetailedInformation}
      />
      <Stack.Screen name="EditTour" component={EditTourV4} />
      <Stack.Screen name = "Localcomments" component={Localcomments} /> 
    </Stack.Navigator>
  );
}

export default LocalHomeStack;
