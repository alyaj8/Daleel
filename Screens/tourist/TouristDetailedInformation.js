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
import React, { useState, useEffect } from "react";
import { images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
export default function BookingDetail({ navigation, route }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisibleAccept, setModalVisibleAccept] = useState(false);



    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };

    const toggleModalAccept = () => {
        setModalVisibleAccept(!isModalVisibleAccept);
    };


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
                                source={images.photo}
                                style={[styles.dummyImg]}
                            />
                        </View>
                        <View style={{ alignSelf: "center" }}>
                            <Text
                                style={[text.themeDefault, text.text20, { fontWeight: "bold" }]}
                            >
                                جولة بلدة العلا القديمة

                            </Text>
                        </View>
                        <View style={{ alignSelf: "center", marginVertical: 5 }}>
                            <Text style={[text.themeDefault, text.text18, {}]}>
                                Rs. 70
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
                                    12/12/12
                                </Text>

                            </View>
                            <View style={{}}>
                                <Text style={[text.themeDefault, text.text14]}>
                                    {/* {convertUnixIntoTime(data?.time)} */}
                                    20:14 P.M
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
                                    {/* {data?.location} */}
                                    مركز زوار بلدة العلا القديمة
                                </Text>
                            </View>
                            <View>
                                <Image source={images.location} style={[styles.icon]} />
                            </View>
                        </View>
                        <View
                            style={[
                                {
                                    alignSelf: "flex-end",
                                    marginVertical: 10,
                                },
                            ]}
                        >
                            <View style={{ marginHorizontal: 10 }}>
                                <Text style={[text.themeDefault, text.text20]}>
                                    امام الجبل
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
                                        10-20
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
                                        8
                                    </Text>
                                </View>
                                <View>
                                    <Image source={images.user} style={[styles.iconLg]} />
                                </View>
                            </View>
                        </View>
                        <View style={{ marginHorizontal: 5 }}>
                            <Text style={[text.themeDefault, text.text18, text.right]}>
                                سيحتاج الضيوف إلى التواجد في مركز زوار بلدة العلا القديمة قبل 15 دقيقة من موعد بدء الجولة.
                            </Text>
                        </View>
                        
                        <View
                     style={{alignSelf:'center',marginVertical:20}}
                        >
                           
                            <Button title={"حجز "}  />
                        </View>
                        {/* )} */}
                    </View>

                    <StatusBar style="auto" />
                    {/* <Modal isVisible={isModalVisibleAccept}>
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
                                        هل أنت متأكد من نشر هذه الجولة؟
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{}}>
                                        <Button title="تحديث "
                                            style={{ backgroundColor: '#9cd644' }}
                                            onpress={() => navigation.navigate('EditTour')}
                                        />
                                    </View>
                                    <View style={{}}>
                                        <Button title="الغاء"
                                            style={{ backgroundColor: '#a5d5db' }}
                                            onpress={toggleModalAccept}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal> */}
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
                                        هل أنت متأكد من نشر هذه الجولة؟
                                    </Text>
                                </View>
                                <View
                                    style={{
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                    }}
                                >
                                    <View style={{}}>
                                        <Button title="حذف"
                                            style={{ backgroundColor: '#c6302c' }}
                                            onpress={toggleModal}
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
    arrowIcon:{
        width:30,
        height:30,
        resizeMode:'contain',
        tintColor:'#fff'
      },
});
