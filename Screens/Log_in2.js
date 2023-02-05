import { signInWithEmailAndPassword } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AppButton from "../component/AppButton";
import Loading from "../component/Loading";
import { colors } from "../config/Constant";
import { auth, db } from "../config/firebase";
import { registerForPushNotificationsAsync } from "../util/Notifcations";
import { getDataFromStorage } from "../util/Storage";
import { storeDataToStorage } from "./../util/Storage";

function errorMsg(error) {
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
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = React.useState({
    email: "aloj@hotmail.com",
    password: "12345678",
    error: "",
  });

  // Check if user is already logged in
  const verifySession = async () => {
    setIsLoading(true);
    const token = await registerForPushNotificationsAsync();
    const loggedInUser = await getDataFromStorage("loggedInUser");

    const user = auth.currentUser;

    if (loggedInUser !== null) {
      if (loggedInUser.isTourist) {
        await updateDoc(doc(db, "users", loggedInUser.uid), {
          push_token: token,
        });
        await updateDoc(doc(db, "Tourist_users", loggedInUser.uid), {
          push_token: token,
        });
      } else {
        await updateDoc(doc(db, "users", loggedInUser.uid), {
          push_token: token,
        });
        await updateDoc(doc(db, "Admin_users", loggedInUser.uid), {
          push_token: token,
        });
      }
      navigateToDashboard(loggedInUser);
      return;
    }

    if (user !== null) {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.data().push_token === push_token)
        navigateToDashboard(docSnap.data());
    }
  };

  // Navigate to home page
  const navigateToDashboard = (user) => {
    try {
      if (user.isTourist) {
        navigation.navigate("TouristBottomTabs");
      } else if (!user.isTourist) {
        navigation.navigate("bottomTabs");
      }
      setIsLoading(false);
    } catch (error) {
      console.log("🚀 ToDashboard ~ error", error);
      setIsLoading(false);
    }
  };

  // Sign in user with email and password
  const signInUser = async (email, password) => {
    setIsLoading(true);
    try {
      const { user } = await signInWithEmailAndPassword(auth, email, password);

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);
      const token = await registerForPushNotificationsAsync();

      if (docSnap.data().isTourist) {
        await updateDoc(doc(db, "users", user.uid), { push_token: token });
        await updateDoc(doc(db, "Tourist_users", user.uid), {
          push_token: token,
        });
      } else {
        await updateDoc(doc(db, "users", user.uid), { push_token: token });
        await updateDoc(doc(db, "Admin_users", user.uid), {
          push_token: token,
        });
      }

      // Save user data in local storage
      await storeDataToStorage("loggedInUser", docSnap.data());

      console.log("🚀 ~ docSnap.data()", docSnap.data());

      navigateToDashboard(docSnap.data());

      setIsLoading(false);
      return docSnap.data();
    } catch (er) {
      console.log("error in login user", er);
      let error = errorMsg(er);
      setValue({
        ...value,
        error,
      });

      setIsLoading(false);
    }
  };

  // Sign in user with email and password
  const signIn = async () => {
    try {
      if (value.email === "" || value.password === "") {
        setValue({
          ...value,
          error: "البريد الإلكتروني والرقم السري مطلوبين",
        });
        return;
      }

      await signInUser(value.email, value.password);

      setValue({
        email: "",
        password: "",
        error: "",
      });
    } catch (er) {
      console.log("🚀 ~ file: Log_in2.js ~ line 111 ~ signIn ~ er", er);
      er = errorMsg(er);
      setValue({
        ...value,
        error: er,
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    // Get push token
    registerForPushNotificationsAsync().then((token) => {
      //  setPushToken(token === undefined ? "" : token);
      setPushToken(token);
      // console.log("token", token);
    });
    verifySession();

    setIsLoading(false);
  }, []);

  // If new user
  const navSignUP = (val) => {
    setValue({
      email: "",
      password: "",
      error: "",
    });
    navigation.navigate("Sign_up");
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffff" }}
    >
      <Loading visible={isLoading} text={"جاري تسجيل الدخول..."} />

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
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-around",
          }}
        >
          <AppButton
            title="سائح"
            onPress={async () => {
              setValue({
                email: "tourist@gmail.com",
                password: "tourist@gmail.com",
                error: "",
              });
              await signInUser("tourist@gmail.com", "tourist@gmail.com");
            }}
            style={{
              backgroundColor: "#4F6367",
              width: 100,
              height: 60,
              borderRadius: 10,
            }}
          />
          <AppButton
            title="مٌرشد"
            onPress={async () => {
              setValue({
                email: "tour@gmail.com",
                password: "tour@gmail.com",
                error: "",
              });
              await signInUser("tour@gmail.com", "tour@gmail.com");
            }}
            style={{
              backgroundColor: "#4F6367",
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
              backgroundColor: colors.brown,
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
