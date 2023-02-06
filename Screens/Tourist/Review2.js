import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Image,
    ImageBackground,
    Pressable,
} from "react-native";
import React, { useState } from "react";
import Icon from "react-native-vector-icons/Ionicons";
import { AirbnbRating, Rating } from "react-native-ratings";
import { doc, updateDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../../config/firebase";
import { colors, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";

export default function Review2({ route, navigation }) {
    const book = route.params;
    const auth = getAuth();
    const user = auth.currentUser;

    let [review, setReview] = useState(0);
    let [comment, setComment] = useState("");

    let PostReview = async () => {
        let ReviewObj = {
            review,
            comment,
            commentuser: user.email,
            comenteuseruid: user.uid,
            time: new Date().toLocaleTimeString(),
            date: new Date().toLocaleDateString(),
        };

        let reviewArray = book.reviews ? book.reviews : [];
        reviewArray.push(ReviewObj);
        book.reviews = reviewArray;

        await updateDoc(doc(db, "tours", book.id), { reviews: reviewArray });
        navigation.goBack()
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    style={{ flex: 1 }}
                    source={images.abackgroundImg}
                    resizeMode="cover"
                >
                    <Icon
                        name="arrow-back-outline"
                        size={45}
                        style={{ color: colors.brown, marginTop: 15, marginLeft:  20 }}
                        onPress={() => navigation.goBack()}
                    />
                    <View style={[styles.alignCenter, { marginTop: -35 }]}>
                        <Text style={[text.text25, text.bold, { color: colors.Blue }]}>
                            تقييم  {book.title}
                        </Text>
                    </View>


                    <View style={styles.card}>
                        <Rating
                            startingValue={0}
                            imageSize={35}
                            fractions={20}
                            showRating={true}
                            jumpValue={0.5}
                            onFinishRating={(res) => {
                                console.log(res);
                                setReview(res);
                            }}
                            starContainerStyle={{
                                marginTop: 20,
                            }}
                        />
                        <TextInput
                            style={styles.review}
                            placeholder="اكتب هنا التقييم"
                            multiline={true}
                            onChangeText={(text) => setComment(text)}
                        />
                        <TouchableOpacity
                            style={{
                                borderRadius: 25,
                                backgroundColor:
                                    review === 0 || comment === "" ? colors.gray : colors.brown,
                                width: "48%",
                                alignSelf: "center",
                                marginTop: 30,
                                marginBottom: 20,
                                height: 50,
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                            onPress={() => PostReview()}
                            disabled={review === 0 || comment === "" ? true : false}
                        >
                            <Text
                                style={{
                                    fontWeight: "bold",
                                    alignSelf: "center",
                                    fontSize: 16,
                                    color: "white",
                                }}
                            >
                                قيم الرحلة
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ImageBackground>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    alignCenter: {
        alignItems: "center",
    },
    dummyImg: {
        width: screenWidth.width50,
        height: screenWidth.width50,
        resizeMode: "contain",
        opacity: 0.7,
    },
    img: {
        width: screenWidth.width80,
        height: screenWidth.width60,
        resizeMode: "contain",
        borderRadius: 10,
        marginBottom: 15,
    },
    bookTitle: {
        fontSize: 22,
        fontWeight: "bold",
        color: "white",
        marginLeft: 10,
    },
    card: {
        width: screenWidth.width95,
        padding: 10,
        borderRadius: 10,
        backgroundColor: "white",
        alignSelf: "center",
        marginTop: 50,
        marginBottom: 250,
        ///shadowEffect
        shadowColor: "#171717",
        shadowOffset: { width: -2, height: 4 },
        shadowOpacity: 0.2,
        shadowRadius: 3,
    },
    review: {
        // backgroundColor: "White",
        width: "90%",
        height: 200,
        borderRadius: 10,
        textAlignVertical: "top",
        borderWidth: 1,
        alignSelf: "center",
        padding: 10,
        marginTop: 30,
        textAlign: "right"

    },
    arrowIcon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        tintColor: colors.lightBrown,
    },
});
