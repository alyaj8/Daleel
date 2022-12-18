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
  TouchableOpacity,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
import { SafeAreaView } from "react-native-safe-area-context";
//import { registerForPushNotificationsAsync } from "../../util/Notifcations";


export default function UserSignUp({ navigation }) {
  const [push_token, setPushToken] = useState("");
  const [pass, setpass] = useState(true);

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
  const [NameError, setNameError] = useState("");
  const [PassError, setPassError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState("");

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
        error.code =
          "البريد الإلكتروني قدم تم استخدامه من قبل";
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
      setNameError("لا يمكن ترك الإسم فارغا")
    }
    else if (!checkFirstName(value.firstname)) { setNameError("يجب ان يتكون الرقم السري من احرف انجليزيه") }
    else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("")
    }
  }


  const validatPass = () => {
    if (checkPass(value.password)) { setPassError("") }
    else if (value.password === "") {
      setPassError("لا يمكن ترك الرقم السري فارغا")
    }
    else if (!checkPass(value.password))
      setPassError("يجب ان يتكون الرقم السري من ٨ احرف على الأقل")
  }

  const validatEmail = () => {
    setEmailError("");
    if (value.email === "") {
      setEmailError("لا يمكن ترك البريد الإلكتروني فارغا")
    }
    else if (!checkEmail(value.email)) {
      setEmailError("عنوان البريد الإلكتروني غير صحيح")
    }
  }

  const validatPhone = () => {
    if (checkPhone(value.phone)) { setPhoneError("") }

    else if (value.phone === "") {
      setPhoneError("لا يمكن ترك رقم الجوال فارغا")
    }
    else if (!checkPhone2(value.phone))
      setPhoneError("يجب ان يتكون الرقم السري من ٩ ارقام  ")
  }
  async function signUp() {
    if (
      value.firstname === "" ||
      value.email === "" ||
      value.phone === "" ||
      value.password === "" ||
      pass === false ||
      checkFirstName(value.firstname) === false ||
      checkPass(value.password) == false ||
      checkEmail(value.email) == false
      //value.error===""
      // checklastName(value.lastname) === false ||
      //     checkUserName(value.username) === false ||
      //  (await CheckUnique(value.username)) === false
    ) {
      validatName();
      validatPass();
      validatEmail();
      validatPhone();



    }
    else {
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
          password: value.password,
          uid: user.uid,
          isTourist: true,
          push_token: push_token || "",
        };
        setDoc(doc(db, "Tourist_users", user.uid), data)
        setDoc(doc(db, "users", user.uid), data).then(() => {
          alert("User Created please Login");
          navigation.navigate("Log_in2");

        })
      } catch (er) {
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
  };

  let checkFirstName = (value) => {
    var letters = /^[A-Za-z]+$/;
    if (value.match(letters) && value.length < 15) {
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
    if (value.match(letters) && value.includes('@') && value.includes('.')) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone = (value) => {
    var letters = /^[0-9]+$/;
    // console.log(value.length);
    if (value.match(letters) && value.length == 9) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone2 = (value) => {
    if (value.length == 9) {
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



  /*let CheckUnique = async () => {
    if (oldName === value.username) {
      return true;
    } else {
      const q = query(
        collection(db, "users"),
        where("email", "==", value.email)
      );
      const snapshot = await getDocs(q);
      return snapshot.empty;
    }
  };*/
  let CheckUnique = async () => {
    const q = query(
      collection(db, "users"),
      where("email", "==", value.email)
    );
    const snapshot = await getDocs(q);
    return snapshot.empty;

  };

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

        <View style={{ paddingHorizontal: 25, marginTop: 10 }}>

          <Text style={[styles.title]}> إنشاء حساب جديد </Text>


          <Text style={styles.lable}> الاسم</Text>

          <View style={{ alignContent: "center", alignItems: "center" }}>
            <Text
              style={{
                color: "red",
                marginLeft: 10,
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
              placeholder="*رقم الجوال"

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

          <View>
            <TouchableOpacity
              style={{
                backgroundColor: "#5398a0",
                padding: 20,
                borderRadius: 10,
                marginBottom: 30,
              }} onPress={() => signUp()} //
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
              </Text></TouchableOpacity>
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
    textAlign: "right"
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
