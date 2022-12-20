import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    Text,
    TextInput,
    Button,
    View,
    Alert,
    Image,
    ScrollView,
    ActivityIndicator,
    date,
    TouchableHighlight,
    TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import {
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    setDoc,
    where,
    getFirestore,
} from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
//import { registerForPushNotificationsAsync } from "../../util/Notifcations";

import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";


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


export default function UserSignUp({ navigation }) {
    const [image, setImage] = useState(null);
    const [update, setupdate] = useState(true);
    const [push_token, setPushToken] = useState("");

    const [NameError, setNameError] = useState("");
    const [PassError, setPassError] = useState("");
    const [EmailError, setEmailError] = useState("");
    const [PhoneError, setPhoneError] = useState("");

    const [LastNameError, setLastNameError] = useState("");
    const [MaroofError, setMaroofError] = useState("");
    const [UsernameError, setUsernameError] = useState("");
    const [Pass2Error, setPass2Error] = useState("");
    const [a1, seta1] = useState(false);


    /* useEffect(() => {
       registerForPushNotificationsAsync().then((token) => {
         setPushToken(token === undefined ? "" : token);
       });
     }, []);*/

    ///////////////////////////////image
    const options = {
        title: "select image",
        type: "library",
        options: {
            maxHeight: 200,
            maxWidth: 200,
            selectionLimit: 1,
            mediaType: "photo",
            includeBase64: false,
        },
    };
    /* const pickImage = async () => {
         let result = await ImagePicker.launchImageLibraryAsync(options);
 
         if (!result.canceled) {
             // firebase;
             var name = Math.random();
             const storage = getStorage();
             const storageRef = ref(storage, `posters${name}`);
             const response = await fetch(result.assets);
             const file = await response.blob();
             uploadBytes(storageRef, file).then((snapshot) => {
                 console.log(snapshot);
                 getDownloadURL(snapshot.ref).then((url) => {
                     setImage(url);
                 });
                 console.log("Uploaded a blob or file!");
             });
         }
     };*/

    const pickImage = async () => {
        // No permissions request is necessary for launching the image library
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        console.log("herettt", result);

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };
    //remove image
    const removeImage = () => setImage(null);

    const [value, setValue] = React.useState({
        email: "",
        password: "",
        username: "",
        phone: "",
        firstname: "",
        lastname: "",

        maroof: "",
        city: "",
        poster: "",

        password2: "",
        error: "",
    });
    const auth = getAuth();
    const db = getFirestore();

    const validatName = () => {
        if (value.firstname === "") {
            setNameError("لا يمكن ترك الإسم فارغا")
        }
        else if (!checkFirstName(value.firstname)) { setNameError("يجب ان يتكون الإسم الأخير من احرف انجليزيه") }
        else if (checkFirstName(value.firstname) && value.firstname !== "") {
            setNameError("")
        }
    }
    const validatLastName = () => {
        if (value.lastname === "") {
            setLastNameError("لا يمكن ترك الإسم الأخير فارغا")
        }
        else if (!checkFirstName(value.lastname)) { setLastNameError("يجب ان يتكون الإسم الأخير من احرف انجليزيه") }
        else if (checkFirstName(value.lastname) && value.lastname !== "") {
            setLastNameError("")
        }
    }

    const validatPass = () => {
        if (checkPass(value.password)) { setPassError("") }
        else if (value.password === "") {
            setPassError("لا يمكن ترك الرقم السري فارغا")
        }
        else if (!checkPass(value.password))
            setPassError("يجب ان يتكون الرقم السري من ٨ احرف على الأقل")
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
            setPhoneError("يجب ان يتكون الرقم الجوال من ٩ ارقام  ")
    }

    const validatMaroof = () => {
        if (checkMaroof(value.maroof)) { setMaroofError("") }

        else if (value.maroof === "") {
            setMaroofError("لا يمكن ترك رقم معروف فارغا")
        }
        else if (!checkMaroof(value.maroof))
            setMaroofError("يجب ان يتكون رقم معروف من ٥ او ٦ ارقام  ")
    }



    const validatUsername = () => {

        if (value.username === "") {
            setUsernameError("لا يمكن ترك اسم المستخدم فارغا")
        }
        else { CheckUnique(value.username) }

    }

    const validatPass2 = () => {

        if (value.password === value.password2) {
            setPass2Error("");
        }
        else if (value.password2 === "") {
            setPass2Error("لا يمكن ترك الرقم السري فارغا")
        }
        else if (value.password != value.password2) {
            setPass2Error("sorry no match")
            console.log("pass false")
        }
    }
    async function signUp() {
        if (
            value.firstname === "" ||
            value.lastname === "" ||

            value.email === "" ||
            value.phone === "" ||
            value.username === "" ||
            value.password === "" ||
            value.password2 === "" ||

            value.maroof === "" ||
            checkFirstName(value.firstname) === false ||
            checkFirstName(value.lastname) === false ||
            checkPass(value.password) === false ||
            checkEmail(value.email) === false ||
            checkMaroof(value.maroof) === false
            //  value.city === ""
            //   value.poster === ""

        ) {
            validatName();
            validatPass();
            validatEmail();
            validatPhone();
            validatLastName();
            validatMaroof();
            validatUsername();
            validatPass2();



        }
        else {
            try {
                const { user } = await createUserWithEmailAndPassword(
                    auth,
                    value.email,
                    value.password
                );
                console.log("user", user.uid);

                const data = {
                    firstname: value.firstname,
                    lastname: value.lastname,

                    email: value.email,
                    phone: value.phone,
                    password: value.password,
                    username: value.username,

                    maroof: value.maroof,
                    city: value.city,
                    poster: image,

                    uid: user.uid,
                    isTourist: false,
                    push_token: push_token || "",
                };
                setDoc(doc(db, "users", user.uid), data)
                setDoc(doc(db, "Admin_users", user.uid), data).then(() => {
                    alert("User Created please Login");
                    navigation.navigate("Log_in2");

                })
            } catch (er) {
                console.log('====================================');
                console.log("er", er);
                console.log('====================================');
                er = msg(er);
                setValue({
                    ...value,
                    error: er,
                });
                console.log(er);
            }
        }
    };
    let checkFirstName = (value) => {
        var letters = /^[A-Za-z]+$/;
        if (value.match(letters) && value.length < 15) {
            return true;
        } else {
            return false;
        }
    };

    let checkPass = (value) => {
        //  var letters = /^[A-Za-z]+$/;
        console.log(value.length);
        if (value.length > 7) {
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
        if (value.match(letters) && value.length == 9) {
            return true;
        } else {
            return false;
        }
    };
    let checkPhone2 = (value) => {
        if (value.length == 9) {
            return true;
        } else {
            return false;
        }
    };
    let checkMaroof = (value) => {
        var letters = /^[0-9]+$/;
        if (value.match(letters)) {
            if (value.length == 5 || value.length == 5) {
                return true;
            }
            else {
                return false;
            }
        } else {
            return false;
        }
    };
    let checkUserName = (value) => {
        var letters = /^[0-9a-zA-Z-_]+$/;
        if (value.match(letters) && value.length < 26) {
            return true;
        } else {
            return false;
        }
    };

    let CheckUnique = async () => {
        const q = query(
            collection(db, "Admin_users"),
            where("username", "==", value.username)
        );
        const snapshot = await getDocs(q);

        if (snapshot.empty) {
            console.log(snapshot.empty, "true2 check uniq")
            setUsernameError("")
            return true;
        }
        setUsernameError("اسم المستخدم قدم تم استخدامه من قبل")
        return false;
    };

    return (
        <SafeAreaView
            style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffff" }}
        >
            <ScrollView>
                <View
                    style={{
                        width: "100%",
                        height: 45,
                        paddingHorizontal: 5,
                        marginTop: 30,

                    }}
                >
                    <Icon
                        name="arrow-back-outline"
                        size={50}
                        style={{ color: "black" }}
                        onPress={() => navigation.goBack()}
                    />
                </View>

                <View style={{ alignItems: "center", marginTop: 0 }}>
                    <Image
                        style={{ height: 200, width: 200 }}
                        source={require("../assets/Daleel_Logo.jpg")}
                    />
                </View>
                <View style={{ paddingHorizontal: 25, marginTop: 10 }}>

                    <Text style={[styles.title]}> إنشاء حساب جديد</Text>


                    <Text style={{ color: "red" }}>{value?.error}</Text>

                    <TouchableHighlight onPress={() => pickImage()}>
                        <View
                            style={{ alignItems: "center", marginTop: 15 }}
                            onChangeText={(text) => setValue({ ...value, poster: URL })}
                        >
                            <Icon
                                name="image-outline"
                                size={55}

                            />
                            <Text style={{
                                alignContent: "center", fontSize: 16,
                                fontWeight: "700", color: "#4F6367"
                            }}>
                                اختر الصورة الشخصية
                            </Text>
                        </View>
                    </TouchableHighlight>
                    {image && (
                        <View
                            style={{
                                display: "flex",
                                flexDirection: "row",
                                marginRight: 5,
                                alignContent: "center",
                            }}
                        >
                            <Image
                                source={{ uri: image }}
                                style={{ width: 250, height: 200, marginTop: 12 }}
                            />
                            <AntDesign
                                onPress={() => removeImage()}
                                name="close"
                                size={24}
                                color="black"
                            />
                        </View>
                    )}

                    <Text style={styles.lable}>  الاسم الأول</Text>

                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {NameError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder="*الإسم الأول"
                            onChangeText={(text) => setValue({ ...value, firstname: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={styles.lable}>  الاسم الأخير</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {LastNameError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder=" *الإسم الأخير"
                            onChangeText={(text) => setValue({ ...value, lastname: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={styles.lable}>  اسم المستخدم</Text>

                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {UsernameError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder="*اسم المستخدم"
                            onChangeText={(text) => setValue({ ...value, username: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={styles.lable}> البريد الإلكتروني</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {EmailError}
                        </Text>
                        <Text style={{ color: "red" }}>{value?.error}</Text>

                        <TextInput
                            style={styles.body}
                            placeholder="*البريد الإلكتروني"
                            onChangeText={(text) => setValue({ ...value, email: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={styles.lable}> رقم الجوال</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {PhoneError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder="*رقم الجوال"
                            onChangeText={(text) => setValue({ ...value, phone: text })}
                            underlineColorAndroid="transparent"
                            keyboardType="numeric"

                        />
                    </View>
                    <Text style={styles.lable}> معروف</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {MaroofError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder="*معروف "
                            onChangeText={(text) => setValue({ ...value, maroof: text })}
                            underlineColorAndroid="transparent"
                            keyboardType="numeric"

                        />
                    </View>
                    <Text style={styles.lable}>  كلمة المرور</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {PassError}
                        </Text>
                        <TextInput
                            style={styles.body}
                            secureTextEntry={true}
                            placeholder="*الرقم السري"
                            onChangeText={(text) => setValue({ ...value, password: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <Text style={styles.lable}>  تأكيد كلمة المرور</Text>
                    <View style={{ alignContent: "center", alignItems: "center" }}>
                        <Text
                            style={{
                                color: "red",
                                marginLeft: 10,
                            }}
                        >
                            {Pass2Error}
                        </Text>
                        <TextInput
                            style={styles.body}
                            secureTextEntry={true}
                            placeholder="*تأكيد الرقم السري"
                            onChangeText={(text) => setValue({ ...value, password2: text })}
                            underlineColorAndroid="transparent"
                        />
                    </View>
                    <View style={styles.buttonCont}>
                        <Button
                            title="إنشاء حساب"
                            color="black"
                            onPress={() => signUp()} //
                        ></Button>
                    </View>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    title: {
        fontSize: 28,
        fontWeight: "600",
        marginBottom: 25,
        alignSelf: "flex-end",
        marginTop: 20,
        color: "#4F6367",
    },
    body: {
        borderWidth: 3,
        borderColor: "#BDBDBD",
        width: "100%",
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#ffff",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: "right"
    },
    buttonCont: {
        marginTop: 20,
        alignSelf: "center",
        padding: 5,
        width: 250,
        borderRadius: 10,
        backgroundColor: "#5398a0",
    },
    lable: {
        fontSize: 16,
        fontWeight: "700",
        marginTop: 10,
        marginBottom: 5,
        alignSelf: "flex-end",
        color: "#4F6367",
    },
});
