import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Button,
    Alert,
    ActivityIndicator,
    ImageBackground,
    TouchableOpacity,
    Image,
    SafeAreaView,
    ScrollView,
} from "react-native";
import { CardField, useConfirmPayment } from "@stripe/stripe-react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { getAuth } from "firebase/auth";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import Icon from "react-native-vector-icons/Ionicons";

//ADD localhost address of your server
const API_URL = "http://localhost:19003";

const StripeApp = ({ navigation }) => {
    //const book = route.params;
    const { confirmPayment } = useStripe();
    const [loading, setLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState();
    const [cardError, setCardError] = useState(false);
    // const { confirmPayment, loading } = useConfirmPayment();

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
            text2: "Book Successfully Added",
            position: "top",
        });
    };
    const handlePayPress = async () => {
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
            <View
                style={{
                    height: "13%",
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
                    style={{ color: "black", marginTop: 30, marginLeft: -15 }}
                    onPress={() => navigation.goBack()}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: -10,
                        width: "100%",
                        marginLeft: 11
                    }}
                >
                    <Text
                        style={{
                            marginLeft: 50,
                            marginTop: -40,
                            fontSize: 29,
                            color: "#FFF",
                            fontWeight: "bold",
                            alignSelf: "center",
                        }}
                    >
                        أتمم عملية الشراء</Text>
                </View>
            </View>
            <View>
                <Text>show</Text>
                <Text>tour name</Text>
                <Text>tour price</Text>


            </View>
            <ScrollView>

                <View style={styles.dd}>
                    <Image
                        style={{ height: 30, width: 40, borderRadius: 10, marginTop: 60, marginLeft: 19 }}
                        source={require("../../assets/IMG_3821.jpg")}
                    />

                    <CardField
                        postalCodeEnabled={true}
                        cardStyle={{
                            placeholderColor: cardError ? "#ff0000" : "#0000",
                        }}
                        style={styles.cardContainer}
                        onCardChange={(cardDetails) => {
                            setCardError(false);
                            setCardDetails(cardDetails);
                        }}
                    />
                    {loading ? (
                        <ActivityIndicator size={"large"} color="blue" />
                    ) : (
                        <View>
                            <TouchableOpacity
                                onPress={handlePayPress}
                                style={styles.fixToText}
                                color="black"
                            >
                                <Text style={styles.buyit}>ادفع الان</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            </ScrollView>
        </ImageBackground>);
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
        backgroundColor: "#5398a0",
        marginTop: 19,
        paddingLeft: 10,
        marginBottom: 4,
        alignSelf: "center",
    },
    dd: {
        backgroundColor: "lightgrey",
        borderColor: "black",
        borderWidth: 0.7,
        justifyContent: "center",
        marginTop: 200,
        borderWidth: 0.9,
        flex: 1,
        paddingBottom: 8,
        borderRadius: 30,
        marginHorizontal: 9
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
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
        marginRight: 18,
    },
});
