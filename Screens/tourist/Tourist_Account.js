
import React, { useEffect, useState } from "react";
import {
    FlatList,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ImageBackground,

} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updateEmail,
} from "firebase/auth";
import {
    collection,
    doc,
    getFirestore,
    setDoc,
    addDoc,
    query,
    where,
    getDocs,
    updateDoc,
} from "firebase/firestore";
import { db } from "../../config/firebase";
import { images, screenWidth, REQUEST_TABLE, colors } from "../../config/Constant";
import Modal from "react-native-modal";
import Button from "../../component/button/Button";

export default function Tourist_Account({ navigation }) {

    const [isModalVisible, setModalVisible] = useState(false);
    const [isModalVisible2, setModalVisible2] = useState(false);

    const [NameError, setNameError] = useState("");
    const [EmailError, setEmailError] = useState("");
    const [PhoneError, setPhoneError] = useState("");
    const [value, setValue] = React.useState({
        email: "",
        firstname: "",
        phone: "",
        //lastname: "",
        // password: "",
        //username: "",
        error: "",

    });

    function msg(error) {
        switch (error.code) {
            case "auth/invalid-email":
                error.code = "عنوان البريد الإلكتروني غير صحيح";
                break;

            case "auth/email-already-in-use":
                error.code =
                    "البريد الإلكتروني قدم تم استخدامه من قبل";
                break;

            case "auth/weak-password":
                error.code = "الرقم السري ضعيف الرجاء ادخال رقم سري لايقل عن ١٠ حروف";
                break;

            default:
                return error.code;
        }
        return error.code;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    const toggleModal = () => {
        console.log(isModalVisible)
        setModalVisible(prev => !prev);
        console.log(isModalVisible, "22")
    };
    const toggleModalDelet = () => {
        console.log(isModalVisible2)
        setModalVisible2(prev => !prev);
        console.log(isModalVisible2, "22")
    };
    const deleteUserFunc = async () => {
        await deleteAccount();
    }

    async function deleteAccount() {
        const auth = getAuth();
        let user1 = auth.currentUser;
        user1.delete().then(() => console.log("acount deleteeee"))
            .catch(() => console.log("account delete error"))
        deleteDoc(doc(db, "Tourist_users", user.uid));
        //db.collection('users').doc(user1.uid).delete();
        console.log("acount deleteeee22222")
        navigation.navigate("Log_in2");
    }



    useEffect(() => {
        getData();
    }, []);
    const getData = async () => {
        try {
            const q = query(collection(db, "users"), where("uid", "==", user.uid));
            const querySnapshot = await getDocs(q);
            querySnapshot.forEach(async (doc) => {
                const Acc = doc.data();
                setValue(Acc);
                //  setOldName(userdata.username);

            });
            //  setValue(Acc);
        } catch (error) {
            // console.log(infoList);
        }
    };
    let saveChanges = async () => {
        if (
            value.firstname === "" ||
            value.phone === "" ||
            value.email === "" ||
            checkFirstName(value.firstname) === false ||
            checkEmail(value.email) == false ||
            checkPhone(value.phone) == false
        ) {
            validatName();
            validatEmail();
            validatPhone();


        } else {
            console.log(isModalVisible)
            setModalVisible(prev => !prev);
            console.log(isModalVisible, "22")

        }
    };
    let saveChanges2 = async () => {
        try {
            console.log(isModalVisible)
            setModalVisible(prev => !prev);
            console.log(isModalVisible, "22")

            await updateEmail(user, value.email)
                .then(async () => {
                    await setDoc(doc(db, "users", user.uid), value);
                    await setDoc(doc(db, "Tourist_users", user.uid), value);
                    setEmailError("");
                    alert("تم تحديث  البيانات بنجاح");
                    navigation.goBack()
                })
                .catch((error) => {
                    console.log(error.message);
                    setEmailError(msg(error));
                });
        } catch (error) {
            console.log(error);
        }
    }


    let checkFirstName = (value) => {
        var letters = /^[A-Za-z]+$/;
        if (value.match(letters) && value.length < 21 && value.length > 3) {
            return true;
        } else {
            return false;
        }
    };
    let checkEmail = (value) => {
        var letters = /^[A-Za-z0-9-_@.]+$/;
        if (value.match(letters) && value.includes('@') && value.includes('.')) {
            return true;
        } else {
            return false;
        }
    };
    let checkPhone = (value) => {
        var letters = /^[0-9]+$/;
        // console.log(value.length);
        if (value.match(letters) && value.length == 8) {
            return true;
        } else {
            return false;
        }
    };
    let checkPhone2 = (value) => {
        if (value.length == 8) {
            return true;
        } else {
            return false;
        }
    };
    const validatName = () => {
        if (value.firstname === "") {
            setNameError("لا يمكن ترك الإسم فارغا")
        }
        else if (!checkFirstName(value.firstname))
            setNameError("يُسمح باستخدام الحروف الهجائية الانجليزية فقط وان تتكون من 4-20 حرف");
        else if (checkFirstName(value.firstname) && value.firstname !== "") {
            setNameError("")
        }
    }

    const validatEmail = () => {
        setEmailError("");
        if (value.email === "") {
            setEmailError("لا يمكن ترك البريد الإلكتروني فارغا")
        }
        else if (!checkEmail(value.email)) {
            setEmailError("عنوان البريد الإلكتروني غير صحيح")
        }
    }

    const validatPhone = () => {
        if (checkPhone(value.phone)) { setPhoneError("") }

        else if (value.phone === "") {
            setPhoneError("لا يمكن ترك رقم الجوال فارغا")
        }
        else if (!checkPhone2(value.phone))
            setPhoneError("يجب ان يتكون الرقم الجوال من 8 ارقام  ")
    }
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
                    style={{ color: "white", marginTop: 30, marginLeft: -15 }}
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
                            marginLeft: 100,
                            marginTop: -40,
                            fontSize: 29,
                            color: "#FFF",
                            fontWeight: "bold",
                            alignSelf: "center",
                        }}
                    >
                        معلوماتي</Text>
                </View>
            </View>
            <ScrollView>
                <View
                    style={{
                        backgroundColor: "#FFF",
                        // height: "80%",
                        borderRadius: 50,
                        paddingHorizontal: 20,
                        marginBottom: 15,
                        paddingBottom: 10,
                        marginTop: 15,
                    }}
                >
                    <View style={{ marginTop: 40, marginLeft: -10 }}>
                        <View style={styles.InputContainer}>
                            <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                                الإسم
                            </Text>
                            <Text
                                style={{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12,
                                    textAlign: "right"
                                }}
                            >
                                {NameError}
                            </Text>
                            <TextInput
                                style={styles.body}

                                placeholder={value.firstname}
                                placeholderTextColor="black"
                                value={value.firstname}
                                onChangeText={(text) => setValue({ ...value, firstname: text })}
                                underlineColorAndroid="transparent"
                            />
                        </View>

                        <View style={styles.InputContainer}>
                            <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                                {"\n"}رقم الجوال
                            </Text>
                            <Text
                                style={{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12,
                                    textAlign: "right"
                                }}
                            >
                                {PhoneError}
                            </Text>
                            <TextInput
                                style={styles.body}

                                placeholder={value.phone}
                                value={value.phone}
                                placeholderTextColor="black"
                                onChangeText={(text) => setValue({ ...value, phone: text })}
                                underlineColorAndroid="transparent"
                            />
                        </View>


                        <View style={styles.InputContainer}>
                            <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                                {"\n"}البريد الإلكتروني
                            </Text>

                            <Text
                                style={{
                                    color: "red",
                                    marginLeft: 10,
                                    fontSize: 12,
                                    textAlign: "right"
                                }}
                            >
                                {EmailError}
                            </Text>
                            <TextInput
                                style={styles.body}
                                placeholder={value.email}
                                value={value.email}
                                placeholderTextColor="black"
                                onChangeText={(text) => setValue({ ...value, email: text })}
                                underlineColorAndroid="transparent"

                            />
                        </View>
                        <View>
                            <TouchableOpacity onPress={saveChanges}
                                style={{
                                    backgroundColor: colors.Blue,
                                    padding: 20,
                                    borderRadius: 10,
                                    marginBottom: 30,
                                    marginTop: 15,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700",
                                        fontSize: 18,
                                        color: "white",
                                    }}
                                >
                                    حفظ التغيرات
                                </Text>

                            </TouchableOpacity>

                        </View>
                        <View>
                            <TouchableOpacity onPress={toggleModalDelet}

                                style={{
                                    backgroundColor: colors.brown,
                                    padding: 20,
                                    borderRadius: 10,
                                    marginBottom: 30,
                                    marginTop: -15,
                                }}
                            >
                                <Text
                                    style={{
                                        textAlign: "center",
                                        fontWeight: "700",
                                        fontSize: 18,
                                        color: "white",
                                    }}
                                >
                                    حذف الحساب                </Text>
                            </TouchableOpacity>
                        </View>

                        <Modal isVisible={isModalVisible}>
                            <View style={[styles.modalView]}>
                                <View style={[styles.main]}>
                                    <View style={{ marginVertical: 20 }}>
                                        <Text
                                            style={{ textAlign: "center", }}
                                        >
                                            هل أنت متأكد من حفظ التغيرات؟
                                        </Text>

                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >
                                        <View style={{}}>
                                            <Button title="الغاء" onpress={toggleModal}
                                                style={{ backgroundColor: colors.lightBrown }} />

                                        </View>
                                        <View style={{}}>
                                            <Button title="حفظ" onpress={saveChanges2}
                                                style={{ backgroundColor: colors.Blue }} />
                                        </View>

                                    </View>
                                </View>
                            </View>
                        </Modal>
                        <Modal isVisible={isModalVisible2}>
                            <View style={[styles.modalView]}>
                                <View style={[styles.main]}>
                                    <View style={{ marginVertical: 20 }}>
                                        <Text
                                            style={{ textAlign: "center", }}
                                        >
                                            هل أنت متأكد من حذف الحساب؟
                                        </Text>

                                    </View>
                                    <View
                                        style={{
                                            flexDirection: "row",
                                            justifyContent: "space-between",
                                        }}
                                    >

                                        <View style={{}}>
                                            <Button title="الغاء" onpress={toggleModalDelet}
                                                style={{ backgroundColor: colors.lightBrown }} />

                                        </View>
                                        <View style={{}}>
                                            <Button title="حذف" onpress={() => deleteUserFunc()}
                                                style={{ backgroundColor: colors.brown }} />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </Modal>
                    </View>
                </View>
            </ScrollView>
        </ImageBackground>
    );
}
const styles = StyleSheet.create({
    title: {
        alignItems: "left",
        justifyContent: "left",
        fontWeight: "bold",
        fontSize: 35,
        marginTop: 20,
        paddingLeft: 10,
        marginBottom: 20,
    },
    body: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 10,
        marginVertical: 12,
        width: "95%",
        height: 42,
        alignSelf: "center",
        paddingLeft: 20,
        paddingRight: 20,
        borderColor: "#5398a0",
    },
    buttonCont: {
        width: 180,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#00a46c",
        marginTop: 20,
        paddingLeft: 10,
        alignSelf: "center",
    },
    savechanges: {
        fontSize: 18,
        fontWeight: "bold",
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10,
        marginRight: 18,
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