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

  const auth = getAuth();
  const db = getFirestore();

  const validatName = () => {
    if (value.firstname === "") {
      setNameError("empty")
    }
    else if (!checkFirstName(value.firstname)) { setNameError("wrong") }
    else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("")
    }

    else if (!checkFirstName(value.firstname)) { setNameError("wrong") }
    else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("")
    }
  }


  const validatPass = () => {
    if (checkPass(value.password)) { setPassError("") }
    else if (value.password === "") {
      setPassError("empty")
    }
    else if (!checkPass(value.password))
      setPassError("must be larger than 8")
  }

  const validatEmail = () => {
    setEmailError("");
    if (value.email === "") {
      setEmailError("empty")
    }
    else if (!checkEmail(value.email)) {
      setEmailError("wrong address")
    }
  }

  const validatPhone = () => {
    if (checkPhone(value.phone)) { setPhoneError("") }

    else if (value.phone === "") {
      setPhoneError("empty")
    }
    else if (!checkPhone2(value.phone))
      setPhoneError("must == 10")
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
    if (value.match(letters) && value.length == 10) {
      return true;
    } else {
      return false;
    }
  };
  let checkPhone2 = (value) => {
    if (value.length == 10) {
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
            height: 45,
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

        <Text style={[styles.title]}> تسجيل حساب جديد     </Text>
        <Text style={{ color: "grey", alignSelf: "center", fontSize: 17 }}> معلومات السائح:</Text>


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



        <View style={{ alignContent: "center", alignItems: "center" }}>
          <Text
            style={{
              color: "red",
              marginLeft: 10,
            }}
          >
            {EmailError}
          </Text>
          <TextInput
            style={styles.body}
            placeholder="*البريد الإلكتروني"
            onChangeText={(text) => setValue({ ...value, email: text })}
            underlineColorAndroid="transparent"
          />
        </View>
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

        <View style={styles.buttonCont}>
          <Button
            title="إنشاء حساب"
            color="black"
            onPress={() => signUp()} //
          ></Button>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  title: {
    alignSelf: "center",
    fontWeight: "bold",
    fontSize: 22,
    marginTop: 20,
    paddingLeft: 10,
    marginBottom: 5,

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
    textAlign: "right"

  },
  buttonCont: {
    marginTop: 20,
    alignSelf: "center",
    padding: 5,
    width: 250,
    borderRadius: 10,
    backgroundColor: "#5398a0",
  },
});
