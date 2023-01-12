import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Pressable
} from "react-native";
import React, { useState, useEffec, useCallback } from "react";
import text from "../../style/text";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
import { useFocusEffect } from "@react-navigation/native";
import { upload, insertRequest, getUserId ,getUserObj} from "../../network/ApiService";
import { images, screenWidth, TOURS_REQUEST, REQUEST_TABLE } from "../../config/Constant";


export default function BookingDetail({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [dateString, setDateString] = useState(null);
    const [startTimeString, setStartTimeString] = useState(null);
    const [endTimeString, setEndTimeString] = useState(null);
    const [userName, setUserName] = useState(null);




    const [data, setData] = useState(null);
    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    useFocusEffect(
        useCallback(() => {
            getTourDetail();
        }, [navigation]),
    );
    const getTourDetail = async () => {
        let tourDetail = route.params.item;
        setData(tourDetail)
        const date = tourDetail?.date;
        const startTime = tourDetail?.startTime;
        const endTime = tourDetail?.endTime;
        const DateSet = new Date(date * 1000)
        const StartTimeSet = new Date(startTime * 1000)
        const EndTimeSet = new Date(endTime * 1000)
        const dateShow = DateSet.toDateString()
        const startTimeShow = StartTimeSet.toTimeString()
        const endTimeShow = EndTimeSet.toTimeString()
        setDateString(dateShow)
        setStartTimeString(startTimeShow)
        setEndTimeString(endTimeShow)
        console.log('response-----------------.>',dateShow) 

     
    };
    
    const onReserveTour = async () => {
       

        setModalVisible(!isModalVisible);
        let tourId = route.params.tourId;
        setIsLoading(true);
        const userData = await getUserObj()
        const touristId = await getUserId();
        const params = {
            localId: data?.requestBy,
            tourId: tourId,
            touristId: touristId,
            status: 0,
            title: data?.title,
            imageUrl: data?.imageUrl,
            touristName:userData?.firstname,
            dateCreated: Date.now(),
        };
        console.log(params)
        const response = await insertRequest(params, TOURS_REQUEST);
        // console.log('response-----------------.>',userdata) 
        setIsLoading(false);
        navigation.goBack()
    }
    return (
        <View style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground
                    style={{ flex: 1 }}
                    source={images.backgroundImg}
                    resizeMode="cover"
                >
                    <Pressable
                        onPress={() => navigation.goBack()}
                        style={{ position: 'absolute', margin: 15 }}>
                        <Image source={images.arrow} style={[styles.arrowIcon]} />
                    </Pressable>
                    <View style={[styles.alignCenter, { marginTop: 20 }]}>
                        <Text style={[text.white, text.text30]}>جولاتي</Text>
                    </View>
                    <View style={[styles.card]}>
                        <View style={[styles.alignCenter, {}]}>
                            <Image
                                source={{ uri: data?.imageUrl }}
                                style={[styles.dummyImg]}
                            />
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Text
                                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
                            >
                                {data?.title}
                            </Text>
                        </View>
                        <View style={{ alignSelf: "center", marginVertical: 5 }}>
                            <Text style={[text.themeDefault, text.text18, {}]}>
                                SAR {data?.price}
                            </Text>
                        </View>
                        <View
                            style={[
                                styles.flexRow,
                                { justifyContent: "space-between", marginVertical: 10 },
                            ]}
                        >
                            <View style={{}}>
                                <Text style={[text.themeDefault, text.text14]}>
                                    {/* {getFormattedDate(data?.date)} */}
                                    {startTimeString}{'\n'}
                                    {endTimeString}
                                </Text>
                            </View>
                            <View style={{}}>
                                <Text style={[text.themeDefault, text.text14]}>
                                    {dateString}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.flexRow,
                                {
                                    alignSelf: "flex-end",
                                    marginHorizontal: 10,
                                    marginVertical: 10,
                                },
                            ]}
                        >
                            <View style={{ marginHorizontal: 10 }}>
                                <Text style={[text.themeDefault, text.text16]}>
                                    {data?.location}
                                </Text>
                                {/* <Text style={[text.themeDefault, text.text16]}>
                                    {data?.city}
                                </Text> */}
                            </View>
                            <View>
                                <Image source={images.location} style={[styles.icon]} />
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 5 }}>
                            <Text style={[text.themeDefault, text.text18, text.right]}>
                                {data?.description}
                            </Text>
                        </View>
                        <View
                            style={[
                                {
                                    alignSelf: "flex-end",
                                    marginVertical: 10,
                                },
                            ]}
                        >
                            <View style={{ marginHorizontal: 20, marginVertical: 10 }}>
                                <Text style={[text.themeDefault, text.text20, { fontWeight: 'bold' }]}>
                                    {data?.meetingPoint}
                                </Text>
                            </View>
                        </View>
                        <View
                            style={[
                                styles.flexRow,
                                { justifyContent: "space-between", marginVertical: 10, marginHorizontal: 10 },
                            ]}
                        >
                            <View style={[styles.flexRow]}>
                                <View>
                                    <Text
                                        style={[
                                            text.themeDefault,
                                            text.text20,
                                            { fontWeight: "bold" },
                                        ]}
                                    >
                                        {data?.age}
                                    </Text>
                                </View>
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={[text.themeDefault, text.text20]}>سنة</Text>
                                </View>
                            </View>

                            <View
                                style={[
                                    styles.flexRow,
                                    {
                                        alignSelf: "flex-end",
                                    },
                                ]}
                            >
                                <View style={{ marginHorizontal: 10 }}>
                                    <Text style={[text.themeDefault, text.text20]}>
                                        {data?.qty}
                                    </Text>
                                </View>
                                <View>
                                    <Image source={images.user} style={[styles.iconLg]} />
                                </View>
                            </View>
                        </View>

                        <View
                            style={{ alignSelf: 'center', marginVertical: 20 }}
                        >

                            <Button title={"حجز "}
                                onpress={toggleModal}
                            />
                        </View>

                        {/* )} */}
                    </View>





                    <StatusBar style="auto" />

                    <Modal isVisible={isModalVisible}>
                        <View style={[styles.modalView]}>
                            <View style={[styles.main]}>
                                <View style={{ marginVertical: 40 }}>
                                    <Text
                                        style={[
                                            text.themeDefault,
                                            text.text22,
                                            { textAlign: "center", fontWeight: "bold" },
                                        ]}
                                    >
                                        هل أنت متأكد أنك تريد حجز هذه الجولة؟
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{}}>
                                        <Button title="حجز"
                                            style={{ backgroundColor: '#80cc28' }}
                                            onpress={onReserveTour}
                                        />
                                    </View>
                                    <View style={{}}>
                                        <Button title="الغاء"
                                            style={{ backgroundColor: '#a5d5db' }}
                                            onpress={toggleModal}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </ScrollView>
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
    dummyImg: {
        width: screenWidth.width50,
        height: screenWidth.width50,
        resizeMode: "contain",
        opacity: 0.7,
    },
    alignRight: {
        alignSelf: "flex-end",
    },
    smallInputDiv: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
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
    card: {
        width: screenWidth.width90,
        padding: 30,
        borderRadius: 10,
        backgroundColor: "#ececec",
        alignSelf: "center",
        marginVertical: 50,
    },
    icon: {
        width: 25,
        height: 25,
        tintColor: "#5398a0",
    },
    flexRow: {
        flexDirection: "row",
        alignItems: "center",
    },
    iconLg: {
        width: 40,
        height: 40,
        tintColor: "#5398a0",
    },
    arrowIcon: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
        tintColor: '#fff'
    },
});
