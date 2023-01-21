import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Icon from "react-native-vector-icons/Ionicons";
import { registerForPushNotificationsAsync } from "../util/Notifcations";
import Loading from "./../component/Loading";

export default function Tourist_Sign_up({ navigation }) {
  const [push_token, setPushToken] = useState("");

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      //  setPushToken(token === undefined ? "" : token);
      setPushToken(token);
    });
  }, []);

  const [pass, setpass] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [value, setValue] = React.useState({
    email: "",
    password: "",
    //username: "",
    phone: "",
    firstname: "",
    // lastname: "",
    password2: "",
    error: "",
  });
  const [NameError, setNameError] = useState("");
  const [PassError, setPassError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState("");
  const [Pass2Error, setPass2Error] = useState("");

  const [Error, setError] = useState({
    firstname: "",
    firstname2: "", //////////////////////////////////////1,//////////////////////////////////////

    /* usernametype: true,
     usernameunique: true,
     usernametype2: true,*/

    password: true,
    password2: true,

    phone: true,
    phone2: true,

    email: true,
    email2: true,
  });
  function msg(error) {
    switch (error.code) {
      case "auth/invalid-email":
        error.code = "عنوان البريد الإلكتروني غير صحيح";
        break;

      case "auth/email-already-in-use":
        error.code = "هذا البريد الإلكتروني قدم تم استخدامه من قبل";
        break;

      case "auth/weak-password":
        error.code = "الرقم السري ضعيف الرجاء ادخال رقم سري لايقل عن ١٠ حروف";
        break;

      default:
        return error.code;
    }
    return error.code;
  }

  const auth = getAuth();
  const db = getFirestore();

  const validatName = () => {
    if (value.firstname === "") {
      setNameError("الرجاء إدخال اسمك الأول");
    } else if (!checkFirstName(value.firstname)) {
      setNameError(
        "يُسمح باستخدام الحروف الهجائية الانجليزية فقط وان لاتتعدى 20 حرف"
      );
    } else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("");
    }
  };

  const validatPass = () => {
    if (checkPass(value.password)) {
      setPassError("");
    } else if (value.password === "") {
      setPassError("الرجاء إدخال الرقم السري");
    } else if (!checkPass(value.password))
      setPassError("الرقم السري ضعيف الرجاء ادخال رقم سري لايقل عن 8 حروف");
  };

  const validatEmail = () => {
    setEmailError("");
    if (value.email === "") {
      setEmailError(" الرجاء إدخال البريد الإلكتروني");
    } else if (!checkEmail(value.email)) {
      setEmailError("عنوان البريد الإلكتروني غير صحيح");
    }
  };

  const validatPhone = () => {
    if (checkPhone(value.phone)) {
      setPhoneError("");
    } else if (value.phone === "") {
      setPhoneError("الرجاء إدخال رقم الجوال");
    } else if (!checkPhone2(value.phone))
      setPhoneError("يجب ان يتكون الرقم الجوال من 8 ارقام  ");
  };

  const validatPass2 = () => {
    if (value.password === value.password2) {
      setPass2Error("");
    } else if (value.password2 === "") {
      setPass2Error(" الرجاء إدخال الرقم السري مرةاخرى للتأكيد");
    } else if (value.password != value.password2) {
      setPass2Error("هذا الرقم السري لايتوافق مع الرقم السري المُدخل سابقاً");
      console.log("pass false");
    }
  };
  async function signUp() {
    if (
      value.firstname === "" ||
      value.email === "" ||
      value.phone === "" ||
      value.password === "" ||
      value.password2 === "" ||
      pass === false ||
      checkFirstName(value.firstname) === false ||
      checkPass(value.password) == false ||
      checkEmail(value.email) == false ||
      checkPhone(value.phone) == false
      //value.error===""
      // checklastName(value.lastname) === false ||
      //     checkUserName(value.username) === false ||
      //  (await CheckUnique(value.username)) === false
    ) {
      validatName();
      validatPass();
      validatEmail();
      validatPhone();
      validatPass2();
    } else {
      try {
        setIsLoading(true);
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
          password: value.password,
          uid: user.uid,
          isTourist: true,
          push_token: push_token || "",
        };
        setDoc(doc(db, "Tourist_users", user.uid), data);
        setDoc(doc(db, "users", user.uid), data).then(() => {
          alert("تم إنشاء الحساب بنجاح الرجاء تسجيل الدخول");
          navigation.navigate("Log_in2");
        });

        setIsLoading(false);
      } catch (er) {
        console.log("er", er);
        console.log("====================================");
        er = msg(er);
        setValue({
          ...value,
          error: er,
        });
        console.log(er);
        setIsLoading(false);
      }
    }
  }

  let checkFirstName = (value) => {
    var letters = /^[A-Za-z]+$/;
    if (value.match(letters) && value.length < 21) {
      return true;
    } else {
      return false;
    }
  };

  let checkPass = (value) => {
    //  var letters = /^[A-Za-z]+$/;
    console.log(value.length);
    if (value.length > 7) {
      return true;
    } else {
      return false;
    }
  };
  let checkEmail = (value) => {
    var letters = /^[A-Za-z0-9-_@.]+$/;
    if (value.match(letters) && value.includes("@") && value.includes(".")) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone = (value) => {
    var letters = /^[0-9]+$/;
    // console.log(value.length);
    if (value.match(letters) && value.length == 8) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone2 = (value) => {
    if (value.length == 8) {
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

  let CheckUnique2 = async () => {
    const q = query(
      collection(db, "Tourist_users"),
      where("email", "==", value.email)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(snapshot.empty, "true2 check email");
      setEmailError("");
      return true;
    }
    setEmailError("هذا البريد الالكتروني قدم تم استخدامه من قبل");
    console.log("not check email");
    return false;
  };
  let CheckUnique = async () => {
    const q = query(collection(db, "users"), where("email", "==", value.email));
    const snapshot = await getDocs(q);
    return snapshot.empty;
  };

  return (
    <SafeAreaView
      style={{ flex: 1, justifyContent: "center", backgroundColor: "#ffff" }}
    >
      <Loading visible={isLoading} textContent={"جاري إنشاء الحساب..."} />

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

        <View style={{ paddingHorizontal: 25, marginTop: 10 }}>
          <Text style={[styles.title]}> إنشاء حساب جديد </Text>

          <Text style={styles.lable}> الاسم</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                textAlign: "right",
              }}
            >
              {NameError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="*الإسم"
              onChangeText={(text) => setValue({ ...value, firstname: text })}
              underlineColorAndroid="transparent"
            />
          </View>

          <Text style={styles.lable}> البريد الإلكتروني</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
              }}
            >
              {EmailError}
              <Text style={{ color: "red" }}>{value?.error}</Text>
            </Text>
            <TextInput
              style={styles.body}
              placeholder="*البريد الإلكتروني"
              onChangeText={(text) => setValue({ ...value, email: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}>رقم الجوال</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
              }}
            >
              {PhoneError}
            </Text>
            <TextInput
              style={styles.body}
              placeholder="966-05XXXXXXXXX "
              onChangeText={(text) => setValue({ ...value, phone: text })}
              underlineColorAndroid="transparent"
              keyboardType="numeric"
            />
          </View>

          <Text style={styles.lable}> كلمة المرور</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
              }}
            >
              {PassError}
            </Text>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="*الرقم السري"
              onChangeText={(text) => setValue({ ...value, password: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <Text style={styles.lable}> تأكيد كلمة المرور</Text>
          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
              }}
            >
              {Pass2Error}
            </Text>
            <TextInput
              style={styles.body}
              secureTextEntry={true}
              placeholder="*تأكيد الرقم السري"
              onChangeText={(text) => setValue({ ...value, password2: text })}
              underlineColorAndroid="transparent"
            />
          </View>
          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#5398a0",
                padding: 20,
                borderRadius: 10,
                marginBottom: 30,
              }}
              onPress={() => signUp()} //
            >
              <Text
                style={{
                  textAlign: "center",
                  fontWeight: "700",
                  fontSize: 18,
                  color: "white",
                }}
              >
                إنشاء حساب
              </Text>
            </TouchableOpacity>
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
    color: "#4F6367",
  },
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
  buttonCont: {
    backgroundColor: "#5398a0",
    padding: 20,
    borderRadius: 10,
    marginBottom: 30,
  },
  lable: {
    fontSize: 16,
    fontWeight: "700",
    marginTop: 10,
    marginBottom: 5,
    alignSelf: "flex-end",
    color: "#4F6367",
  },
});
