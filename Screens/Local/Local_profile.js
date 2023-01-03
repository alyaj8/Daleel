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





    return (
        <SafeAreaView
            style={{
                flex: 1,
            }}
        >


            <View
                style={{
                    backgroundColor: "#5398a0",
                    height: "13%",
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                    paddingHorizontal: 20,
                    marginBottom: 15,
                }}
            >
                <Icon
                    name="arrow-back-outline"
                    size={45}
                    style={{ color: "black", marginTop: 35, marginLeft: -15 }}
                    onPress={() => navigation.goBack()}
                />
                <View
                    style={{
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: -10,
                        width: "100%",
                    }}
                >
                    <Text
                        style={{
                            marginLeft: 60,
                            marginTop: -35,
                            fontSize: 29,
                            color: "#FFF",
                            fontWeight: "bold",
                            alignSelf: "center",
                        }}
                    >
                        تغيير الرقم السري                    </Text>
                </View>
            </View>
            <TouchableOpacity style={{ backgroundColor: "lightgrey" }}>
                <Text>Add photo</Text>
            </TouchableOpacity>

            <View style={{ backgroundColor: "lightgrey", borderRadius: 15, marginHorizontal: 5 }}>
                <ScrollView>
                    <Text>jhugyf</Text>
                    <Text>jhugyf</Text>
                    <Text>jhugyf</Text>
                    <Text>jhugyf</Text>
                </ScrollView>
            </View>
        </SafeAreaView>
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
    buttonCont: {
        width: 180,
        height: 50,
        borderRadius: 50,
        backgroundColor: "#5398a0",
        marginTop: 30,
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
});
