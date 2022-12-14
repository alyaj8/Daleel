import React, { Component, useState } from "react";
import {
    Button,
    StyleSheet,
    View,
    Image,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
} from "react-native";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import AsyncStorage from '@react-native-async-storage/async-storage';
function msg(error) {
    switch (error.code) {
        case "auth/invalid-email":
            error.code = "Wrong email address";
            break;

        case "auth/user-not-found":
            error.code =
                "There is no account for this email,you have to register first";
            break;

        case "auth/wrong-password":
            error.code = "Password is not correct";
            break;
        case "auth/too-many-requests":
            error.code = "You have exceeded the attempts limit, try again later";
            break;

        default:
            return error.code;
    }
    return error.code;
}
export default function Log_in2({ navigation }) {
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
                navigation.navigate("Local_Home");
            } else {
                navigation.navigate("Tourist_Home");
            }
        } catch (er) {
            er = msg(er);
            setValue({
                ...value,
                error: er,
            });
        }
    }

    return (
        <SafeAreaView
            style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffff" }}
        >
            <View style={{ alignItems: "center", marginTop: -40 }}>
                <Image
                    style={{ height: 265, width: 265 }}
                    source={require("../assets/Daleel_Logo.jpg")}
                />
            </View>

            <View style={{ paddingHorizontal: 25, marginTop: 10 }}>


                <Text
                    style={{
                        fontSize: 28,
                        fontWeight: "600",
                        marginBottom: 40,
                        alignSelf: "flex-end",
                        marginTop: 20,
                        color:"#4F6367",
                    }}
                >
                    تسجيل الدخول
                </Text>
                <Text style={{ color: "red" }}>{value?.error}</Text>
                <View>
                <Text
                    style={{
                        fontSize: 16,
                        fontWeight: "700",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                        color:"#4F6367",
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
                        fontWeight: "700",
                        marginBottom: 10,
                        alignSelf: "flex-end",
                        color:"#4F6367",
                    }}
                >
                    كلمة المرور
                </Text>
                    <TextInput
                        style={styles.body}
                        secureTextEntry={true}
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
                            backgroundColor: "#5398a0",
                            padding: 20,
                            borderRadius: 10,
                            marginBottom: 30,
                        }}
                    >
                        <Text
                            style={{
                                textAlign: "center",
                                fontWeight: "700",
                                fontSize: 18,
                                color:"white",
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
                                color: "#7A9E9F",
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
                        color:"#4F6367",
                    }}>ليس لديك حساب؟</Text>

                </View>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
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
 
});