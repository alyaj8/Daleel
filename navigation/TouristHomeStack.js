import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import BookingDetail from "../Screens/local/BookingDetail";
import Comment from "./../Screens/tourist/Comment";
import Review2 from "./../Screens/tourist/Review2";
import StripeApp from "./../Screens/tourist/StripeApp";
import TouristDetailedInformation from "./../Screens/tourist/TouristDetailedInformation";
import Tourist_Home from "./../Screens/Tourist_Home";

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

      <Stack.Screen name="Comment" component={Comment} />
      <Stack.Screen name="Review2" component={Review2} />
      <Stack.Screen name="StripeApp" component={StripeApp} />
    </Stack.Navigator>
  );
}
export default TouristHomeStack;
