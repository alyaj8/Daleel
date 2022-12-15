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
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
//import { registerForPushNotificationsAsync } from "../../util/Notifcations";

import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { AntDesign } from "@expo/vector-icons";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";

function msg(error) {
    switch (error.code) {
        case "auth/invalid-email":
            error.code = "Wrong email address";
            break;

        case "auth/email-already-in-use":
            error.code =
                "The email is already registered try to login or use forgot password";
            break;

        case "auth/weak-password":
            error.code = "week password";
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


        error: "",
    });
    const auth = getAuth();
    const db = getFirestore();

    async function signUp() {
        if (
            value.firstname === "" ||
            value.lastname === "" ||

            value.email === "" ||
            value.phone === "" ||
            value.username === "" ||
            value.password === "" ||

            value.maroof === ""
            //  value.city === ""
            //   value.poster === ""

        ) {
            setValue({
                ...value,
                error: " الإسم والبريد الإلكتروني ورقم الجوال ورقم السري مطلوبين ",
            });
            return;
        }
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
                <View style={{ paddingHorizontal: 25, marginTop: 10}}>

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
                        <Text style={{ alignContent: "center",fontSize: 16,
                                                       fontWeight: "700",color:"#4F6367"}}>
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
                    <TextInput
                        style={styles.body}
                        placeholder="*الإسم الأول"
                        onChangeText={(text) => setValue({ ...value, firstname: text })}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.lable}>  الاسم الأخير</Text>
                <View style={{ alignContent: "center", alignItems: "center" }}>
                    <TextInput
                        style={styles.body}
                        placeholder=" *الإسم الأخير"
                        onChangeText={(text) => setValue({ ...value, lastname: text })}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.lable}>  اسم الحساب</Text>

                <View style={{ alignContent: "center", alignItems: "center" }}>
                    <TextInput
                        style={styles.body}
                        placeholder="*اسم الحساب"
                        onChangeText={(text) => setValue({ ...value, username: text })}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.lable}> البريد الإلكتروني</Text>
                <View style={{ alignContent: "center", alignItems: "center" }}>
                    <TextInput
                        style={styles.body}
                        placeholder="*البريد الإلكتروني"
                        onChangeText={(text) => setValue({ ...value, email: text })}
                        underlineColorAndroid="transparent"
                    />
                </View>
                <Text style={styles.lable}> رقم الجوال</Text>
                <View style={{ alignContent: "center", alignItems: "center" }}>
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
                    <TextInput
                        style={styles.body}
                        secureTextEntry={true}
                        placeholder="*الرقم السري"
                        onChangeText={(text) => setValue({ ...value, password: text })}
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
        color:"#4F6367",
    },
    body: {
        borderWidth: 3,
        borderColor:"#BDBDBD",
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
    lable:{
        fontSize: 16,
        fontWeight: "700",
        marginTop:10,
        marginBottom: 5,
        alignSelf: "flex-end",
        color:"#4F6367",
      },
});
