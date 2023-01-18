import { updateEmail } from "firebase/auth";
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { auth, db } from "../../config/firebase";

export default function Tourist_Account({ navigation }) {
  const [NameError, setNameError] = useState("");
  const [EmailError, setEmailError] = useState("");
  const [PhoneError, setPhoneError] = useState("");
  const [value, setValue] = React.useState({
    email: "",
    firstname: "",
    phone: "",
    //lastname: "",
    // password: "",
    //username: "",
    error: "",
  });

  function msg(error) {
    switch (error.code) {
      case "auth/invalid-email":
        error.code = "عنوان البريد الإلكتروني غير صحيح";
        break;

      case "auth/email-already-in-use":
        error.code = "البريد الإلكتروني قدم تم استخدامه من قبل";
        break;

      case "auth/weak-password":
        error.code = "الرقم السري ضعيف الرجاء ادخال رقم سري لايقل عن ١٠ حروف";
        break;

      default:
        return error.code;
    }
    return error.code;
  }

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
        //  setOldName(userdata.username);
      });
      //  setValue(Acc);
    } catch (error) {
      // console.log(infoList);
    }
  };
  let saveChanges = async () => {
    if (
      value.firstname === "" ||
      value.phone === "" ||
      value.email === "" ||
      checkFirstName(value.firstname) === false ||
      checkEmail(value.email) == false ||
      checkPhone(value.phone) == false
    ) {
      validatName();
      validatEmail();
      validatPhone();
    } else {
      try {
        await updateEmail(user, value.email)
          .then(async () => {
            // console.log("jhiugyfxdfgfhcgjkhljhiufydtrsxdjfkgli;", user.uid);

            await setDoc(doc(db, "users", user.uid), value);
            await setDoc(doc(db, "Tourist_users", user.uid), value);
            alert("Profile Updated Successfully");
            setEmailError("");
            //  if (oldEmail !== value.email) {
            // navigation.navigate("Local_Home"); ///////////////
            //  }
          })
          .catch((error) => {
            console.log(error.message);
            setEmailError(msg(error));
          });
      } catch (error) {
        console.log(error);
      }
    }
  };

  let checkFirstName = (value) => {
    var letters = /^[A-Za-z]+$/;
    if (value.match(letters)) {
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
  const validatName = () => {
    if (value.firstname === "") {
      setNameError("لا يمكن ترك الإسم فارغا");
    } else if (!checkFirstName(value.firstname)) {
      setNameError("يجب ان يتكون الإسم  من احرف انجليزيه");
    } else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("");
    }
  };

  const validatEmail = () => {
    setEmailError("");
    if (value.email === "") {
      setEmailError("لا يمكن ترك البريد الإلكتروني فارغا");
    } else if (!checkEmail(value.email)) {
      setEmailError("عنوان البريد الإلكتروني غير صحيح");
    }
  };

  const validatPhone = () => {
    if (checkPhone(value.phone)) {
      setPhoneError("");
    } else if (value.phone === "") {
      setPhoneError("لا يمكن ترك رقم الجوال فارغا");
    } else if (!checkPhone2(value.phone))
      setPhoneError("يجب ان يتكون الرقم السري من ٩ ارقام  ");
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
            معلوماتي{" "}
          </Text>
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
              <Text
                style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}
              >
                الإسم
              </Text>
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
                placeholder={value.firstname}
                placeholderTextColor="black"
                value={value.firstname}
                onChangeText={(text) => setValue({ ...value, firstname: text })}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.InputContainer}>
              <Text
                style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}
              >
                {"\n"}رقم الجوال
              </Text>
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
                placeholder={value.phone}
                value={value.phone}
                placeholderTextColor="black"
                onChangeText={(text) => setValue({ ...value, phone: text })}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.InputContainer}>
              <Text
                style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}
              >
                {"\n"}البريد الإلكتروني
              </Text>

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
                placeholder={value.email}
                value={value.email}
                placeholderTextColor="black"
                onChangeText={(text) => setValue({ ...value, email: text })}
                underlineColorAndroid="transparent"
              />
            </View>

            <View>
              <TouchableOpacity
                onPress={() => saveChanges()}
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
