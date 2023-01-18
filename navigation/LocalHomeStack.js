import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as React from "react";
import BookingDetail from "../Screens/Local/BookingDetail";
import EditTourV2 from "../Screens/Local/EditTourV2";
import TourDetailedInformation from "../Screens/Local/TourDetailedInformation";
import Local_Home from "../Screens/Local_Home";
const Stack = createNativeStackNavigator();

/*const PUBLISHABLE_KEY =
  "pk_test_51Ll5efFetd1JSL8vQ1WpbGvxBewQSJi8ZUzB6WD0i19CUUkzdnaHAQzja4LNFMZpUWAZKUPTdSklL2KZSI1k9Qfy00MZ31WOSr";*/
function App() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Local_Home" component={Local_Home} />
      <Stack.Screen name="BookingDetail" component={BookingDetail} />
      <Stack.Screen
        name="TourDetailedInformation"
        component={TourDetailedInformation}
      />
      <Stack.Screen name="EditTour" component={EditTourV2} />
    </Stack.Navigator>
  );
}

export default App;
