import { StatusBar } from "expo-status-bar";
import React, { useState, useCallback } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
} from "react-native";
import text from "../../style/text";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import TourDetailCard from "../../component/card/TourDetailCard";
import {
    collection,
    query,
    where,
    getFirestore,
    onSnapshot,
} from "firebase/firestore";
import { useFocusEffect } from "@react-navigation/native";
import { getUserId } from "../../network/ApiService";
import Loader from "../../component/Loaders/Loader";
export default function Local_Home({ navigation }) {
    const [data, setData] = useState([]);
    const [tourId, setTourId] = useState(null);

    const db = getFirestore();
    useFocusEffect(
        useCallback(() => {
            getAllRequests();
        }, [navigation])
    );
    const getAllRequests = async () => {
        getLocalGuideRequests();
    };
    const getLocalGuideRequests = async () => {
        const uid = await getUserId();
        const data = [];
        const q = query(
            collection(db, REQUEST_TABLE),
            where("requestBy", "==", uid)
        );
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            querySnapshot.forEach((doc) => {
                data.push(doc.data());
                setTourId(doc.id);

            });
            setData(data);
            console.log('data', data)

        });
    };
    console.log('tour id',tourId)
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
                <View style={[styles.alignCenter, { marginVertical: 10 }]}>
                    <Text style={[text.white, text.text30]}>جولاتي</Text>
                </View>
                <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                    <View
                        style={[styles.cardDiv, { marginTop: screenWidth.width15 }]}
                    >

                        {data?.length ? (
                            data?.map((item, index) => {
                                // console.log('item', item.title)
                                return (
                                    <View key={index} style={{ marginVertical: 20 }}>
                                        <TourDetailCard
                                            source={{ uri: item?.imageUrl }}
                                            title={item?.title}
                                            onpress={() => navigation.navigate('TourDetailedInformation', item)}
                                        />
                                    </View>
                                );
                            })
                        ) : (
                            <View style={{ marginTop: 200, alignItems: "center" }}>
                                <Text style={[text.text12, text.themeDefault]}>
                                    No message found
                                </Text>
                            </View>
                        )}
                    </View>
                </ScrollView>
            </ImageBackground>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: screenWidth.width10,
        backgroundColor: "#fff",
    },
    alignCenter: {
        alignItems: "center",
    },
    cardDiv: {
        marginTop: 20,
    },
    modalView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    main: {
        backgroundColor: "#fff",
        width: screenWidth.width80,
        padding: 20,
        borderRadius: 20,
    },

});
