import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    Image,
    ImageBackground,
    ScrollView,
    TouchableOpacity,
    Alert,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import text from "../../style/text";
import Input from "../../component/inputText/Input";
import SmallInput from "../../component/inputText/smallInput";
import Button from "../../component/button/Button";
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";
import DateTimePicker from "@react-native-community/datetimepicker";
import { PortalProvider } from "@gorhom/portal";
import RBSheet from "react-native-raw-bottom-sheet";
import { upload, insertRequest, getUserId } from "../../network/ApiService";
import Loader from "../../component/Loaders/Loader";
import Icon from "react-native-vector-icons/Ionicons";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../config/firebase";
import { getAuth, signOut } from "firebase/auth";

export default function Local_profile({ navigation }) {

    const [isModalVisible, setModalVisible] = useState(false);

    const [fname, setFname] = useState("");
    const [filePath, setFilePath] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [infoList, setinfoList] = useState([]);

    const [value, setValue] = React.useState({
        username: "",
    });

    const auth = getAuth();
    const user = auth.currentUser;

    const modalizeRefAge = useRef(null);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 0,
        });
        if (!result.canceled) {
            setFilePath(result.assets[0].uri);
        }
    };

    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };


    const submitRequest = async () => {
        setModalVisible(!isModalVisible);
        setIsLoading(true);
        const imageUrl = await upload(filePath);
        console.log('imageurl in screen', imageUrl)
        if (imageUrl) {
            const data = {
                imageUrl,
                by,

            };
            setIsLoading(false);
            navigation.navigate('Local_Manage_Account')
            return;
        }
        setIsLoading(false);
        alert("Error while saving data. Pls try again later.");
    };


    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        try {
            const colRef = query(
                collection(db, "users"),
                where("uid", "==", user.uid)
            );
            const snapshot = await getDocs(colRef);
            var myData = [];
            //store the data in an array myData
            snapshot.forEach((doc) => {
                let userinfo2 = doc.data();

                setFname(userinfo2.firstname);

                userinfo2.id = doc.id;

                myData.push(userinfo2);
            });
            setinfoList(myData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <ImageBackground
            style={{ flex: 1 }}
            source={images.backgroundImg}
            resizeMode="cover"
        >

            <View
                style={{
                    height: "10%",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingHorizontal: 20,
                    marginTop: 11,
                }}
            >
                <View style={{
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingHorizontal: 20,
                    marginTop: 30,

                }}>
                    <Text
                        style={{
                            borderBottomLeftRadius: 20,
                            borderBottomRightRadius: 20,
                            paddingHorizontal: 20,
                            marginTop: 10,
                            textAlign: "center",
                            fontSize: 30,
                            fontWeight: "bold"

                        }}>
                        {fname}</Text>
                </View>

                <Icon
                    name="arrow-back-outline"
                    size={45}
                    style={{ color: "black", marginTop: -20, marginLeft: -15 }}
                    onPress={() => navigation.goBack()}
                />
            </View>
            <View style={{
                borderBottomLeftRadius: 20,
                borderBottomRightRadius: 20,
                paddingHorizontal: 20,
                marginBottom: 15,
                marginTop: 11,
                backgroundColor: "lightgrey",
                alignItems: "center"
            }}>
                <Icon
                    name="add-outline"
                    size={45}
                    style={{ color: "black" }}
                    onPress={() => navigation.goBack()}
                />
            </View>
            < View>
                <ScrollView showsVerticalScrollIndicator={false}>
                    {filePath ? (
                        <View
                            style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
                        >
                            <Image source={{ uri: filePath }} style={[styles.dummyImg]} />
                        </View>
                    ) : (
                        <TouchableOpacity
                            onPress={() => pickImage()}
                            style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
                        >
                            <Image source={images.photo} style={[styles.dummyImg]} />
                        </TouchableOpacity>
                    )}
                    <Modal isVisible={isModalVisible}>
                        <View style={[styles.modalView]}>
                            <View style={[styles.main]}>
                                <View style={{ marginVertical: 20 }}>
                                    <Text
                                        style={[
                                            text.themeDefault,
                                            text.text22,
                                            { textAlign: "center" },
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
                                        <Button title="نشر" onpress={submitRequest} />
                                    </View>
                                    <View style={{}}>
                                        <Button title="الغاء" onpress={toggleModal} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </View>


        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // marginTop: screenWidth.width10,
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
    datePicker: {
        position: 'absolute',
        bottom: 0, right: 0,
        marginRight: 40,
        marginBottom: 5,
    },
    InputStyle: {
        width: screenWidth.width25,
        padding: 5,
        borderWidth: 3,
        borderColor: "#BDBDBD",
        borderRadius: 20,
        paddingHorizontal: 10,

        textAlign: "right",
    },
    sheetText: {
        alignSelf: "center",
        marginVertical: 10,
    },
    timeFlex: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginHorizontal: 20
    }
});
