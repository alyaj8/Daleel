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
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
//import { registerForPushNotificationsAsync } from "../../util/Notifcations";

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
  const [push_token, setPushToken] = useState("");
  /* useEffect(() => {
     registerForPushNotificationsAsync().then((token) => {
       setPushToken(token === undefined ? "" : token);
     });
   }, []);*/
  const [value, setValue] = React.useState({
    email: "",
    password: "",
    //username: "",
    phone: "",
    firstname: "",
    // lastname: "",

    error: "",
  });
  const auth = getAuth();
  const db = getFirestore();

  async function signUp() {
    if (
      value.firstname === "" ||
      value.email === "" ||
      value.phone === "" ||
      value.password === ""
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
        email: value.email,
        phone: value.phone,
        firstname: value.firstname,
        // lastname: value.lastname,
        password: value.password,
        uid: user.uid,
        isTourist: true,
        push_token: push_token || "",
      };

      setDoc(doc(db, "users", user.uid), data).then(() => {
        alert("User Created please Login");
        console.log("here2", user.uid);
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
            height: 40,
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
          
        <Text style={[styles.title]}> إنشاء حساب جديد </Text>
       
        <Text style={{ color: "red" }}>{value?.error}</Text>

        <Text style={styles.lable}> الاسم</Text>

        <View style={{ alignContent: "center", alignItems: "center" }}>
          <TextInput
            style={styles.body}
            placeholder="*الإسم"
            onChangeText={(text) => setValue({ ...value, firstname: text })}
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
        <Text style={styles.lable}>رقم الجوال</Text>

        <View style={{ alignContent: "center", alignItems: "center" }}>
          <TextInput
            style={styles.body}
            placeholder="*رقم الجوال"

            onChangeText={(text) => setValue({ ...value, phone: text })}
            underlineColorAndroid="transparent"
            keyboardType="numeric"

          />
        </View>

        <Text style={styles.lable}> كلمة المرور</Text>
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
    backgroundColor: "#5398a0",
    padding: 20,
   borderRadius: 10,
   marginBottom: 30,
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
