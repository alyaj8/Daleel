
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
    Button,
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
import { db } from "../config/firebase";

export default function Tourist_Home({ navigation }) {

    const [infoList, setinfoList] = useState([]);
    const [update, setupdate] = useState(true);
    const [oldName, setOldName] = useState("");
    const [oldEmail, setOldEmail] = useState("");
    const [emailError, setEmailError] = useState("");
    const [uid, setUid] = useState("");

    const [value, setValue] = React.useState({
        email: "",
        firstname: "",
        phone: "",
        //lastname: "",
        // password: "",
        //username: "",
    });

    function msg(error) {
        switch (error.code) {
            case "auth/invalid-email":
                error.code = "Wrong email format";
                break;

            case "auth/email-already-in-use":
                error.code = "This email is already used";
                break;

            case "auth/requires-recent-login":
                error.code = "this email is already used ";
                break;

            default:
                return error.code;
        }
        return error.code;
    }
    const auth = getAuth();
    const user = auth.currentUser;

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

            });
            //  setValue(Acc);
        } catch (error) {
            // console.log(infoList);
        }
    };
    /*  const db = getFirestore();
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach(async (doc) => {
        const Acc = doc.data();
    
    });*/
    /*let saveChanges = async () => {
        if (
            value.firstname === "" ||
            // value.lastname === "" ||
            //value.username === "" ||
            value.email === "" ||
            // checkFirstName2(value.firstname) === false ||
            checkFirstName(value.firstname) === false ||
            checklastName(value.lastname) === false ||
            checkUserName(value.username) === false ||
            (await CheckUnique(value.username)) === false
        ) {
            if (checkFirstName(value.firstname) && value.firstname !== "") {
                Error.firstname = true;
                setError(Error);
                setupdate(!update);
            }
            if (value.firstname === "") {
                Error.firstname2 = false;
                setError(Error);
                setupdate(!update);
            } else {
                if (!checkFirstName(value.firstname) || value.firstname === "") {
                    Error.firstname = false;
                    setError(Error);
                    setupdate(!update);
                }
            }

            if (checklastName(value.lastname) && value.lastname !== "") {
                Error.lastname = true;
                setError(Error);
                setupdate(!update);
            }
            if (value.lastname === "") {
                Error.lastname2 = false;
                setError(Error);
                setupdate(!update);
            } else {
                if (!checklastName(value.lastname) || value.lastname === "") {
                    Error.lastname = false;
                    setError(Error);
                    setupdate(!update);
                }
            }

            if (checkUserName(value.username) && value.username !== "") {
                Error.usernametype = true;
                setError(Error);
                setupdate(!update);
            }
            if (value.username === "") {
                Error.usernametype2 = false;
                setError(Error);
                setupdate(!update);
            } else {
                if (!checkUserName(value.username) || value.username === "") {
                    Error.usernametype = false;
                    setError(Error);
                    setupdate(!update);
                }
            }
            if (value.email == "") {
                Error.email2 = false;
                setError(Error);
                setupdate(!update);
            }
            if (await CheckUnique()) {
                Error.usernameunique = true;
                setError(Error);
                setupdate(!update);
            }
            if (!(await CheckUnique())) {
                Error.usernameunique = false;
                setError(Error);
                setupdate(!update);
            }
        } else {
            if (oldEmail === value.email) {
                setEmailError("");
                await setDoc(doc(db, "users", uid), value);
                alert("Profile Updated Successfully");
                setError({
                    firstname: true,
                    lastname: true,
                    usernametype: true,
                    usernameunique: true,
                });
                setOldName(value.username);
                navigation.navigate("Account"); ///////////////
            } else {
                try {
                    await updateEmail(user, value.email)
                        .then(async () => {
                            await setDoc(doc(db, "users", uid), value);
                            //  navigation.navigate("Account"); ///////////////
                            alert("Profile Updated Successfully");
                            setEmailError("");
                            setError({
                                firstname: true,
                                lastname: true,
                                usernametype: true,
                                usernameunique: true,
                            });
                            setOldName(value.username);
                            if (oldEmail !== value.email) {
                                navigation.navigate("Account"); ///////////////
                            }
                        })
                        .catch((error) => {
                            console.log(error.message);
                            setEmailError(msg(error));
                        });
                } catch (error) {
                    console.log(error);
                }
            }
        }
    };*/
    /*let checkFirstName2 = (value) => {
      // var letters = /^[A-Za-z]+$/;
      if (value.length == 0) {
        return true;
      } else {
        return false;
      }
    };*/

    let checkFirstName = (value) => {
        var letters = /^[A-Za-z]+$/;
        if (value.match(letters) && value.length < 15) {
            return true;
        } else {
            return false;
        }
    };

    let checklastName = (value) => {
        var letters = /^[A-Za-z]+$/;
        if (value.match(letters) && value.length < 26) {
            return true;
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
        if (oldName === value.username) {
            return true;
        } else {
            const q = query(
                collection(db, "users"),
                where("username", "==", value.username)
            );
            const snapshot = await getDocs(q);
            return snapshot.empty;
        }
    };

    return (
        <SafeAreaView
            style={{
                backgroundColor: "",
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
                    marginTop: 9,
                }}
            >
                <Icon
                    name="arrow-back-outline"
                    size={45}
                    style={{ color: "black", marginTop: 30, marginLeft: -15 }}
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
                            marginLeft: 100,
                            marginTop: -35,
                            fontSize: 29,
                            color: "#FFF",
                            fontWeight: "bold",
                            alignSelf: "center",
                        }}
                    >
                        معلوماتي                    </Text>
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
                            <TextInput
                                style={[
                                    styles.body,
                                    { borderColor: Error.firstname ? "red" : "#5398a0" },
                                ]}
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

                            <TextInput
                                style={[
                                    styles.body,
                                    { borderColor: Error.phone ? "red" : "#5398a0" },
                                ]}
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


                            <TextInput
                                style={styles.body}
                                placeholder={value.email}
                                value={value.email}
                                placeholderTextColor="black"
                                onChangeText={(text) => setValue({ ...value, email: text })}
                                underlineColorAndroid="transparent"
                            //  titl
                            // value={user.email}
                            />
                        </View>




                        <View>
                            <TouchableOpacity onPress={() => saveChanges()}

                                style={{
                                    backgroundColor: "#5398a0",
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
                    </View>
                </View>
            </ScrollView>
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
});