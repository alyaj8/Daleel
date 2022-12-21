import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
    Alert,
    Image,
    ScrollView,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../../config/firebase";

export default function Local_Manage_Account({ navigation }) {

    const [infoList, setinfoList] = useState([]);
    const [fname, setFname] = useState("");
    const [lastname, setLname] = useState("");

    const auth = getAuth();
    const user = auth.currentUser;

    const showAlert = () =>
        Alert.alert(
            "Loging out ",
            "Are sure you want to log out?",
            [
                {
                    text: "Cancel",
                    //  onPress: () => Alert.alert("Cancel Pressed"),
                    style: "cancel",
                },
                {
                    text: "Yes",
                    style: "cancel",
                    onPress: async () => {
                        const auth = getAuth();
                        await signOut(auth);
                        navigation.navigate("Log_in2");
                    },
                },
            ],
            {
                cancelable: true,
                onDismiss: () =>
                    Alert.alert(
                        "This alert was dismissed by tapping outside of the alert dialog."
                    ),
            }
        );

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
                console.log("🚀 ~ userinfo2", userinfo2);

                setFname(userinfo2.firstname);
                setLname(userinfo2.lastname);

                userinfo2.id = doc.id;

                myData.push(userinfo2);
            });
            setinfoList(myData);
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <View style={{ backgroundColor: "#EDF5F0" }}>
            <ScrollView>
                <View style={{ padding: 10, width: "100%", height: 150 }}>
                    <TouchableOpacity>

                    </TouchableOpacity>
                </View>

                <View style={{ alignItems: "center" }}>

                    <Text style={{ fontSize: 23, fontWeight: "bold", padding: 10 }}>
                        HELLO WELCOME,
                    </Text>
                    <Text style={{ fontSize: 29, fontWeight: "bold" }}>{fname}</Text>
                    <Text
                        style={{ fontSize: 15, fontWeight: "bold", color: "grey" }}
                    ></Text>
                </View>

                <TouchableOpacity onPress={() => navigation.navigate("Local_Account")}>
                    <View
                        style={{
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            backgroundColor: "#fff",
                            width: "90%",
                            padding: 20,
                            paddingBottom: 22,
                            borderRadius: 10,
                            shadowOpacity: 0.3,
                            elevation: 15,
                            marginTop: 1,
                        }}
                    >
                        <Icon name="person-outline" size={30} style={{ marginRight: 10 }} />
                        <Text style={{ fontSize: 16, marginTop: 7 }}>Edit my details</Text>
                    </View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => navigation.navigate("Local_ChangePass")}>
                    <View
                        style={{
                            alignSelf: "center",
                            flexDirection: "row",
                            justifyContent: "flex-start",
                            backgroundColor: "#fff",
                            width: "90%",
                            padding: 20,
                            paddingBottom: 22,
                            borderRadius: 10,
                            shadowOpacity: 0.3,
                            elevation: 15,
                            marginTop: 17,
                        }}
                    >
                        <Icon
                            name="lock-closed-outline"
                            size={30}
                            style={{ marginRight: 10 }}
                        />
                        <Text style={{ fontSize: 16, marginTop: 7 }}>Change password</Text>
                    </View>
                </TouchableOpacity>

                <TouchableOpacity
                    onPress={showAlert}
                    style={{
                        alignSelf: "center",
                        flexDirection: "row",
                        justifyContent: "flex-start",
                        backgroundColor: "#fff",
                        width: "90%",
                        padding: 20,
                        paddingBottom: 22,
                        borderRadius: 10,
                        shadowOpacity: 0.3,
                        elevation: 15,
                        marginTop: 20,
                        marginBottom: 19,
                    }}
                >
                    <Icon name="log-out-outline" size={30} style={{ marginRight: 10 }} />
                    <Text style={{ fontSize: 16, marginTop: 7 }}>Log-out</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
}