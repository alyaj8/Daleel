import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import BookingDetail from "../Screens/Local/BookingDetail";
import TouristDetailedInformation from "../Screens/Tourist/TouristDetailedInformation";
import Tourist_Home from "../Screens/Tourist_Home";
import StripeApp from "../Screens/Tourist/StripeApp";
import Comment from "../Screens/Tourist/Comment";
import Review2 from "../Screens/Tourist/Review2";

const Stack = createNativeStackNavigator();

function TouristHomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Tourist_Home" component={Tourist_Home} />

      <Stack.Screen name="BookingDetail" component={BookingDetail} />

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
      <Stack.Screen
        name="StripeApp"
        component={StripeApp}
      />
    </Stack.Navigator>
  );
}
export default TouristHomeStack;
