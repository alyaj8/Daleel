import React, { useEffect, useState } from "react";
import {
    StyleSheet,
    View,
    Text,
    Image,
    TextInput,
    ScrollView,
    TouchableOpacity,
    SafeAreaView,
    Button,
    FlatList,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import {
    getAuth,
    createUserWithEmailAndPassword,
    updatePassword,
} from "firebase/auth";
import {
    collection,
    getDoc,
    getDocs,
    query,
    updateDoc,
    where,
} from "firebase/firestore";
import { doc, getFirestore, setDoc } from "firebase/firestore";
import { db } from "../../config/firebase";
import { withUser } from "../../config/UserContext";

export default function Local_profile({ navigation }) {

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const colRef = doc(db, "users", user.uid);
        const snapshot = await getDoc(colRef);
        let userdata = snapshot.data();
    };



    return (
        <View><Text>profile</Text></View>

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
        margin: 12,
        width: 350,
        height: 42,
        paddingLeft: 20,
        paddingRight: 20,
        borderColor: "#5398a0",
    },

});
