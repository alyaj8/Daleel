
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
  ImageBackground,

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
import { db } from "../../config/firebase";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";

export default function Local_Account({ navigation }) {

  const [NameError, setNameError] = useState("");
  const [LastNameError, setLastNameError] = useState("");

  const [UsernameError, setUsernameError] = useState("");
  const [EmailError, setEmailError] = useState("");

  const [PhoneError, setPhoneError] = useState("");
  const [MaroofError, setMaroofError] = useState("");


  const [value, setValue] = React.useState({
    firstname: "",
    lastname: "",

    username: "",
    email: "",

    phone: "",
    maroof: "",

    error: "",
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
  const user = auth.currentUser;
  console.log(user.uid);


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
        console.log(value.email);

      });
      //  setValue(Acc);
    } catch (error) {
      // console.log(infoList);
    }
  };

  const deleteUserFunc = async () => {
    await deleteAccount();
  }
  async function deleteAccount() {
    const auth = getAuth();
    const user = auth.currentUser;
    console.log(user.uid);
    db.collection('Admin_users').doc(user.uid).delete();
    db.collection('users').doc(user.uid).delete();

    user.delete().then(() => {
      console.log("2");
      // db.collection('users').doc(user.uid).delete()
      db.collection('Admin_users').doc(user.uid).delete()
      console.log("3")

    }).catch((error) => {
      console.log(error, "error")
    })
  }

  let saveChanges = async () => {
    if (
      value.firstname === "" ||
      value.lastname === "" ||

      value.email === "" ||
      value.phone === "" ||
      value.username === "" ||
      value.maroof === "" ||
      checkFirstName(value.firstname) === false ||
      checkFirstName(value.lastname) === false ||
      checkEmail(value.email) === false ||
      checkMaroof(value.maroof) === false ||
      checkPhone(value.phone) == false
    ) {
      validatName();
      validatEmail();
      validatPhone();
      validatLastName();
      validatMaroof();
      validatUsername();

    } else {
      try {
        await updateEmail(user, value.email)
          .then(async () => {
            console.log("jhiugyfxdfgfhcgjkhljhiufydtrsxdjfkgli;", user.uid)

            await setDoc(doc(db, "users", user.uid), value);
            await setDoc(doc(db, "Admin_users", user.uid), value);
            alert("Profile Updated 111Successfully");
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
  let checkMaroof = (value) => {
    var letters = /^[0-9]+$/;
    if (value.match(letters)) {
      if (value.length == 5 || value.length == 5) {
        return true;
      }
      else {
        return false;
      }
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
    const q = query(
      collection(db, "Admin_users"),
      where("username", "==", value.username)
    );
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      console.log(snapshot.empty, "true2 check uniq")
      setUsernameError("")
      s
      return true;
    }
    setUsernameError("اسم المستخدم قدم تم استخدامه من قبل")
    return false;
  };

  const validatName = () => {
    if (value.firstname === "") {
      setNameError("لا يمكن ترك الإسم الأول فارغا")
    }
    else if (!checkFirstName(value.firstname)) { setNameError("يجب ان يتكون الإسم الأول من احرف انجليزيه") }
    else if (checkFirstName(value.firstname) && value.firstname !== "") {
      setNameError("")
    }
  }
  const validatLastName = () => {
    if (value.lastname === "") {
      setLastNameError("لا يمكن ترك الإسم الأخير فارغا")
    }
    else if (!checkFirstName(value.lastname)) { setLastNameError("يجب ان يتكون الإسم الأخير من احرف انجليزيه") }
    else if (checkFirstName(value.lastname) && value.lastname !== "") {
      setLastNameError("")
    }
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
      setPhoneError("يجب ان يتكون الرقم الجوال من ٩ ارقام  ")
  }

  const validatMaroof = () => {
    if (checkMaroof(value.maroof)) { setMaroofError("") }

    else if (value.maroof === "") {
      setMaroofError("لا يمكن ترك رقم معروف فارغا")
    }
    else if (!checkMaroof(value.maroof))
      setMaroofError("يجب ان يتكون رقم معروف من ٥ او ٦ ارقام  ")
  }



  const validatUsername = () => {

    if (value.username === "") {
      setUsernameError("لا يمكن ترك اسم المستخدم فارغا")
    }
    else { CheckUnique(value.username) }

  }


  return (

    <ImageBackground
      style={{ flex: 1 }}
      source={images.backgroundImg}
      resizeMode="cover"
    >
      <View
        style={{
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
            marginLeft: 11
          }}
        >
          <Text
            style={{
              marginLeft: 100,
              marginTop: -40,
              fontSize: 29,
              color: "#FFF",
              fontWeight: "bold",
              alignSelf: "center",
            }}
          >
            معلوماتي</Text>
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
                الاسم الأول              </Text>
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
              <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                الاسم الأخير
              </Text>
              <Text
                style={{
                  color: "red",
                  marginLeft: 10,
                }}
              >
                {LastNameError}
              </Text>
              <TextInput
                style={styles.body}

                placeholder={value.lastname}
                placeholderTextColor="black"
                value={value.lastname}
                onChangeText={(text) => setValue({ ...value, lastname: text })}
                underlineColorAndroid="transparent"
              />
            </View>

            <View style={styles.InputContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
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

            <View style={styles.InputContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                {"\n"}اسم المستخدم
              </Text>

              <Text
                style={{
                  color: "red",
                  marginLeft: 10,
                }}
              >
                {UsernameError}
              </Text>
              <TextInput
                style={styles.body}
                placeholder={value.username}
                value={value.username}
                placeholderTextColor="black"
                onChangeText={(text) => setValue({ ...value, username: text })}
                underlineColorAndroid="transparent"

              />
            </View>
            <View style={styles.InputContainer}>
              <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
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
              <Text style={{ fontWeight: "bold", fontSize: 17, textAlign: "right" }}>
                {"\n"}رقم معروف

              </Text>

              <Text
                style={{
                  color: "red",
                  marginLeft: 10,
                }}
              >
                {MaroofError}
              </Text>
              <TextInput
                style={styles.body}
                placeholder={value.maroof}
                value={value.maroof}
                placeholderTextColor="black"
                onChangeText={(text) => setValue({ ...value, maroof: text })}
                underlineColorAndroid="transparent"

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
            <View>
              <TouchableOpacity onPress={() => deleteUserFunc()}

                style={{
                  backgroundColor: "red",
                  padding: 20,
                  borderRadius: 10,
                  marginBottom: 30,
                  marginTop: -15,
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
                  حذف الحساب                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
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