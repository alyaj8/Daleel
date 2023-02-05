import { CardField, useStripe } from "@stripe/stripe-react-native";
import { getAuth } from "firebase/auth";
import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  ImageBackground,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-toast-message";
import Icon from "react-native-vector-icons/Ionicons";
import { highlights, images } from "../../config/Constant";
import { db } from "../../config/firebase";
import {
  getUserObj,
  updateRequest,
  updateTour,
} from "../../network/ApiService";

//ADD localhost address of your server
const API_URL = "http://localhost:19003";

const initialCardDetails = {
  number: "4242424242424242",
  expMonth: 12,
  expYear: 24,
  cvc: "123",
  postalCode: "12345",
};

const StripeApp = ({ route, navigation }) => {
  const { confirmPayment } = useStripe();
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState();
  const [cardError, setCardError] = useState(false);
  // const { confirmPayment, loading } = useConfirmPayment();
  const req = route.params;

  const fetchPaymentIntentClientSecret = async () => {
    const response = await fetch(`${API_URL}/create-payment-intent`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const { clientSecret, error } = await response.json();
    return { clientSecret, error };
  };

  const showToast = () => {
    Toast.show({
      type: "success",
      text1: "Success",
      text2: "Tour Successfully paid",
      position: "top",
    });
  };

  const handlePayPress = async () => {
    // update this tour to isPaid = true
    // add paidAt date
    // go back to home screen
    // show toast
    if (!cardDetails?.complete) {
      console.log("---red", cardDetails);
      setCardError(true);
      return;
    }
    try {
      setLoading(true);
      const currUser = await getUserObj();
      console.log("🚀 ~ currUser", currUser?.firstname);
      console.log("🚀 ~ currUser", currUser);

      // TODO: update tour to isPaid = true
      await updateTour(req.tourId, {
        isPaid: true,
        paidAt: new Date(),
        bookedByName: currUser?.firstname,
      });

      // TODO: update request to isPaid = true
      await updateRequest(req.id, {
        isPaid: true,
        paidAt: new Date(),
        bookedByName: currUser?.firstname,
      });

      // TODO: Update all other requests of the same tour to rejected
      const q = query(
        collection(db, "requests"),
        where("tourId", "==", req.tourId)
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach(async (doc) => {
        // TODO: Dont update the current request
        if (doc.id !== req.id) {
          // doc.data() is never undefined for query doc snapshots
          const result = await updateRequest(doc.id, {
            status: 2,
            rejectedAt: new Date(),
          });
        }
      });

      setLoading(false);
      showToast();

      // go back to home screen
      navigation.navigate("Tourist_Home");
    } catch (error) {
      setLoading(false);
      console.log("Unable to process payment", error);
    }
  };

  const handlePayPressOld = async () => {
    // 1.Gather the customer's billing information (e.g., email)
    if (!cardDetails?.complete) {
      console.log("---red", cardDetails);
      setCardError(true);
      return;
    }
    //2.Fetch the intent client secret from the backend
    try {
      setLoading(true);
      const { clientSecret, error } = await fetchPaymentIntentClientSecret();
      //2. confirm the payment
      if (error) {
        setLoading(false);
        console.log("Unable to process payment");
      } else {
        const { paymentIntent, error } = await confirmPayment(clientSecret, {
          type: "Card",
          paymentMethodType: "Card",
        });
        console;
        if (error) {
          setLoading(false);
          alert(`Payment Confirmation Error ${error.message}`);
        } else if (paymentIntent) {
          setLoading(false);
          /// showToast();
          const Auth = getAuth();
          const uid = Auth?.currentUser?.uid;
          const db = getFirestore();
          // const data = book;
          //data.orderUserId = uid;
          // await addDoc(collection(db, "orderBook"), data);
          navigation.navigate("Tourist_Manage_Account");
          //console.log("Payment successful ", paymentIntent);
        }
      }
    } catch (e) {
      setLoading(false);
      console.log("errror", e.message);
    }
    // 3.Confirm the payment with the card details
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={images.backgroundImg}
      resizeMode="cover"
    >
      {/* Header */}
      <View
        style={{
          //   height: "13%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
          marginBottom: 15,
          marginTop: 9,
        }}
      >
        <Icon
          name="arrow-back-outline"
          size={45}
          style={{ color: "white", marginTop: 30, marginLeft: -10 }}
          onPress={() => navigation.goBack()}
        />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: -10,
            width: "100%",
            marginLeft: 11,
          }}
        >
          <Text
            style={{
              marginLeft: 80,
              marginTop: -20,
              fontSize: 29,
              color: "#FFF",
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            أتمم عملية الشراء
          </Text>
        </View>
      </View>

      {/* Body */}
      <View style={styles.dd}>
        <Image
          style={{
            height: 30,
            width: 40,
            borderRadius: 10,

            marginTop: 60,
            marginLeft: 19,
          }}
          source={require("../../assets/IMG_3821.jpg")}
        />

        <CardField
          postalCodeEnabled={true}
          cardStyle={{
            placeholderColor: !!cardError ? "#ff0000" : "#000000",
          }}
          style={styles.cardContainer}
          onCardChange={(cardDetails) => {
            setCardError(false);
            setCardDetails(cardDetails);
          }}
        />
        {loading ? (
          <ActivityIndicator size={"large"} color="white" />
        ) : (
          <View>
            <TouchableOpacity
              onPress={handlePayPress}
              style={styles.fixToText}
              color="white"
            >
              <Text style={styles.buyit}>ادفع الان</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Footer */}
      <View
        style={{
          backgroundColor: "white",
          height: 400,
          borderRadius: 30,
          marginHorizontal: 4,
          paddingHorizontal: 20,
          paddingBottom: 10,
          marginTop: 3,
          borderColor: "#BDBDBD",
          borderWidth: 3,
        }}
      >
        <ScrollView>
          <View>
            <Text
              style={{
                textAlign: "center",
                fontSize: 25,
                fontWeight: "900",
                marginTop: 15,
                color: "#c66b3d",
              }}
            >
              تفاصيل الطلبية
            </Text>
            <Text
              style={{
                textAlign: "right",
                fontSize: 30,
                fontWeight: "bold",
                color: "#c66b3d",
                marginTop: 20,
              }}
            >
              عنوان الجولة:{" "}
            </Text>

            <Text
              style={{
                textAlign: "right",
                padding: 15,
                fontSize: 25,
                fontWeight: "500",
              }}
            >
              {req?.title}
            </Text>
            <Text
              style={{
                textAlign: "right",
                fontSize: 30,
                fontWeight: "bold",
                color: "#c66b3d",
                marginTop: 20,
              }}
            >
              سعر الجولة:
            </Text>
            <Text
              style={{
                textAlign: "right",
                padding: 20,
                fontSize: 25,
                fontWeight: "500",
              }}
            >
              {req?.price} ريال
            </Text>
          </View>
        </ScrollView>
      </View>
    </ImageBackground>
  );
};
export default StripeApp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    margin: 20,
  },
  input: {
    backgroundColor: "#efefefef",

    borderRadius: 8,

    fontSize: 20,
    height: 50,
    padding: 10,
  },
  card: {
    backgroundColor: "#efefef",
  },
  cardContainer: {
    height: 50,
    color: "green",
    backgroundColor: "lightgrey",
  },
  cardContainer1: {
    height: 9,
    marginVertical: 6,
    borderColor: "red",
    borderWidth: 2,
    color: "red",
  },
  fixToText: {
    width: 180,
    height: 50,
    justifyContent: "center",
    alignContent: "center",
    borderRadius: 50,
    backgroundColor: "#c4a35a",
    marginTop: 8,
    paddingLeft: 10,
    marginBottom: 10,
    alignSelf: "center",
  },
  dd: {
    backgroundColor: "lightgrey",
    borderColor: "black",
    borderWidth: 0.7,
    justifyContent: "center",
    borderWidth: 0.9,
    paddingBottom: 8,
    borderRadius: 30,
    marginHorizontal: 9,
    marginBottom: 10,

    shadowColor: "lightgrey",
    shadowOffset: { height: 5, width: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 0.2,

    ...highlights.brdr1,
  },
  aa: {
    alignSelf: "center",
    // marginTop: -11,
  },
  picc: {
    marginTop: 50,
    height: 300,
    width: 350,
    alignSelf: "center",
  },
  check: {
    alignSelf: "center",
    marginTop: 60,
    fontSize: 30,
    color: "white",
    fontWeight: "bold",
  },
  buyit: {
    fontSize: 18,
    color: "white",
    fontWeight: "800",
    alignSelf: "center",
    marginTop: 10,
    marginBottom: 10,
    marginRight: 18,
  },
});
