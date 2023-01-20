import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  LogBox,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import NewAppButton from "./../component/AppButton";
import { images, screenWidth,colors } from "../config/Constant";
function msg(error) {
  switch (error.code) {
    case "auth/invalid-email":
      error.code = "عنوان البريد الإلكتروني غير صحيح";
      break;

    case "auth/user-not-found":
      error.code = "لا يوجد حساب بهذا الإيميل";
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
    email: "aloj@hotmail.com",
    password: "12345678",
    error: "",
  });

  const navSignUP = (val) => {
    setValue({
      email: "",
      password: "",
      error: "",
    });
    navigation.navigate("Sign_up");
  };
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
            color: "#4F6367",
          }}
        >
          تسجيل الدخول
        </Text>
        <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
          <NewAppButton
            title="سائح"
            onPress={() => {
              setValue({
                email: "tourist@gmail.com",
                password: "tourist@gmail.com",
                error: "",
              });
            }}
            style={{
              backgroundColor: "#4F6367",
              width: 100,
              height: 60,
              borderRadius: 10,
            }}
          />
          <NewAppButton
            title="مٌرشد"
            onPress={() => {
              setValue({
                email: "Tour@gmail.com",
                password: "Tour@gmail.com",
                error: "",
              });
            }}
            style={{
              width: 100,
              height: 60,
              borderRadius: 10,
            }}
          />
        </View>
        <Text style={{ color: "red" }}>{value?.error}</Text>
        <View>
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 10,
              alignSelf: "flex-end",
              color: "#4F6367",
            }}
          >
            البريد الإلكتروني
          </Text>
          <TextInput
            style={styles.body}
            placeholder="*البريد الإلكتروني"
            onChangeText={(text) =>
              setValue({ ...value, email: text, error: "" })
            }
            underlineColorAndroid="transparent"
            value={value.email}
          />
          <Text
            style={{
              fontSize: 16,
              fontWeight: "700",
              marginBottom: 10,
              alignSelf: "flex-end",
              color: "#4F6367",
            }}
          >
            كلمة المرور
          </Text>
          <TextInput
            style={styles.body}
            //  secureTextEntry={true}
            placeholder="*الرقم السري"
            onChangeText={(text) =>
              setValue({ ...value, password: text, error: "" })
            }
            underlineColorAndroid="transparent"
            value={value.password}
          />
        </View>

        <View>
          <TouchableOpacity
            onPress={signIn}
            style={{
              backgroundColor:colors.brown,
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
                color:colors.lightBrown,
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
              color: "#4F6367",
            }}
          >
            ليس لديك حساب؟
          </Text>
        </View>
      </View>
    </SafeAreaView>
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
    backgroundColor: "#ffff",
    padding: 10,
    borderRadius: 10,
    marginBottom: 20,
    textAlign: "right",
  },
});
