import React, { Component, useState, useEffect } from "react";
import {
    Button,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    ScrollView,
    LogBox,

} from "react-native";
import { colors } from "../config/Constant";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerForPushNotificationsAsync } from "../util/Notifcations";

function msg(error) {
    switch (error.code) {
        case "auth/invalid-email":
            error.code = "عنوان البريد الإلكتروني غير صحيح";
            break;

        case "auth/user-not-found":
            error.code =
                "لا يوجد حساب بهذا الإيميل";
            break;

        case "auth/wrong-password":
            error.code = "الرقم السري المستعمل غير صحيح";
            break;
        case "auth/too-many-requests":
            error.code = "لقد تعديت المحاولات المتاحه، حاول في وقت لاحق";
            break;

        default:
            return error.code;
    }
    return error.code;
}
export default function Log_in2({ navigation }) {
    const [push_token, setPushToken] = useState("");
    /* useEffect(() => {
         registerForPushNotificationsAsync().then((token) => {
             setPushToken(token === undefined ? "" : token);
         });
     }, []);*/

    const [value, setValue] = React.useState({
        email: "",
        password: "",
        error: "",
    });

    const navSignUP = (val) => {
        setValue({
            email: "",
            password: "",
            error: "",
        });
        navigation.navigate("Sign_up")
    }
    // const UserSignUp = "UserSignUp";
    const auth = getAuth();

    async function signIn() {
        if (value.email === "" || value.password === "") {
            setValue({
                ...value,
                error: "البريد الإلكتروني والرقم السري مطلوبين",
            });
            return;
        }

        try {
            const { user } = await signInWithEmailAndPassword(
                auth,
                value.email,
                value.password
            );
            const db = getFirestore();
            const docRef = doc(db, "users", user.uid);
            const docSnap = await getDoc(docRef);
            console.log("uid", user.uid);
            console.log("user", docSnap.data());
            setValue({
                email: "",
                password: "",
                error: "",
            });
            if (docSnap.data().isTourist) {
                if (push_token) {
                    await updateDoc(doc(db, "users", user.uid), { push_token });
                    await updateDoc(doc(db, "Admin_users", user.uid), { push_token });
                }
                navigation.navigate("TouristBottomTabs");
            } else {
                if (push_token) {
                    await updateDoc(doc(db, "users", user.uid), { push_token });
                    await updateDoc(doc(db, "Tourist_users", user.uid), { push_token });
                }
                navigation.navigate("bottomTabs");
            }
        } catch (er) {
            er = msg(er);
            setValue({
                ...value,
                error: er,
            });
        }
    }
    useEffect(() => {
        LogBox.ignoreLogs([
            "Warning: Async Storage has been extracted from react-native core",
        ]);
    }, []);
    return (
        <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: "#f8f5f2", height: "100%", }}>
            <SafeAreaView
                style={{ flex: 1, backgroundColor: "#f8f5f2", }}
            >
                <View style={{ alignItems: "center", marginTop: 20 }}>
                    <Image
                        style={{ height: 265, width: 265 }}
                        source={require("../assets/Daleel_Logo.png")}
                    />
                </View>

                <View style={{ paddingHorizontal: 25, marginTop: 10, height: "100%", backgroundColor: "#f8f5f2" }}>


                    <Text
                        style={{
                            fontSize: 28,
                            fontWeight: "600",
                            marginBottom: 40,
                            alignSelf: "flex-end",
                            marginTop: 20,
                            color: "#0a243d",
                        }}
                    >
                        تسجيل الدخول
                    </Text>
                    <Text style={{ color: "red", textAlign: "center" }}>{value?.error}</Text>
                    <View>
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                marginBottom: 10,
                                alignSelf: "flex-end",
                                color: "#0a243d",
                            }}
                        >
                            البريد الإلكتروني
                        </Text>
                        <TextInput
                            style={styles.body}
                            placeholder="*البريد الإلكتروني"
                            onChangeText={(text) => setValue({ ...value, email: text, error: "" })}
                            underlineColorAndroid="transparent"
                            value={value.email}
                        />
                        <Text
                            style={{
                                fontSize: 16,
                                fontWeight: "500",
                                marginBottom: 10,
                                alignSelf: "flex-end",
                                color: "#0a243d",
                            }}
                        >
                            كلمة المرور
                        </Text>
                        <TextInput
                            style={styles.body}
                            //  secureTextEntry={true}
                            placeholder="*الرقم السري"
                            onChangeText={(text) => setValue({ ...value, password: text, error: "" })}
                            underlineColorAndroid="transparent"
                            value={value.password}
                        />
                    </View>


                    <View>
                        <TouchableOpacity
                            onPress={signIn}
                            style={{
                                backgroundColor: colors.brown,
                                padding: 20,
                                borderRadius: 10,
                                marginBottom: 30,
                            }}
                        >
                            <Text
                                style={{
                                    textAlign: "center",
                                    fontWeight: "500",
                                    fontSize: 18,
                                    color: "white",
                                }}
                            >
                                تسجيل الدخول
                            </Text>
                        </TouchableOpacity>
                    </View>

                    <View
                        style={{
                            flexDirection: "row",
                            justifyContent: "center",
                            marginBottom: 30,
                        }}
                    >
                        <TouchableOpacity onPress={() => navSignUP(value)}>
                            <Text
                                style={{
                                    color: colors.lightBrown,
                                    fontWeight: "800",
                                    textDecorationLine: "underline",
                                }}
                            >
                                {" "}
                                إنشاء حساب
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={{
                                textAlign: "center",
                                fontSize: 16,
                                color: "#0a243d",
                            }}>ليس لديك حساب؟</Text>

                    </View>
                </View>
            </SafeAreaView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    body: {
        borderWidth: 3,
        borderColor: "#BDBDBD",
        width: "100%",
        height: 50,
        paddingLeft: 20,
        paddingRight: 20,
        backgroundColor: "#f8f5f2",
        padding: 10,
        borderRadius: 10,
        marginBottom: 20,
        textAlign: "right"
    },

});
