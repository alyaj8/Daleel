import { getAuth, signOut } from "firebase/auth";
import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { Alert, Image, Text, TouchableOpacity, View, StyleSheet, } from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { db } from "../../config/firebase";
import { removeDataFromStorage } from "./../../util/Storage";
import Modal from "react-native-modal";
import { images, screenWidth, REQUEST_TABLE, colors } from "../../config/Constant";
import Button from "../../component/button/Button";

export default function Tourist_Manage_Account({ navigation }) {
  const [infoList, setinfoList] = useState([]);
  const [fname, setFname] = useState("");
  const [lastname, setLname] = useState("");
  const [isModalVisible, setModalVisible] = useState(false);

  const auth = getAuth();
  const user = auth.currentUser;

  let logout = () => {
    console.log("hello")
    try {
      removeDataFromStorage("loggedInUser");
      signOut(auth);
      navigation.navigate("Log_in2");
    } catch (error) {
      console.log(
        "🚀 ~ file: Tourist_Manage_Account.js ~ line 48 ~ showAlert ~ error",
        error
      );
    }
  }





  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const colRef = query(
        collection(db, "users"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(colRef);
      var myData = [];
      //store the data in an array myData
      snapshot.forEach((doc) => {
        let userinfo2 = doc.data();
        // console.log("🚀 ~ userinfo2", userinfo2);

        setFname(userinfo2.firstname);
        setLname(userinfo2.lastname);

        userinfo2.id = doc.id;

        myData.push(userinfo2);
      });
      setinfoList(myData);
    } catch (error) {
      console.log(error);
    }
  };
  const toggleModal = () => {
    console.log(isModalVisible)
    setModalVisible(prev => !prev);
    console.log(isModalVisible, "22")
  };
  return (
    <View>
      <View style={{ padding: 10, width: "100%", height: 150 }}>
        <View
          style={{
            shadowColor: "black",
            shadowOffset: { height: 5, width: 0 },
            shadowOpacity: 0.5,
            shadowRadius: 0.5,
          }}
        >
          <Image
            source={require("../../assets/a1.jpg")}
            style={{
              resizeMode: "cover",
              opacity: 0.7,
              width: 420,
              height: 260,
              marginTop: -13,
              marginLeft: -10,
            }}
          ></Image>
        </View>
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("../../assets/tabIcons/account.png")}
            style={{
              width: 140,
              height: 140,
              borderRadius: 90,
              marginTop: -200,
            }}
          ></Image>

          <Text
            style={{
              fontSize: 35,
              fontWeight: "bold",
              padding: 35,
              marginTop: -30,
            }}
          >
            {fname}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 120 }}>
        <TouchableOpacity
          onPress={() => navigation.navigate("Tourist_Account")}
        >
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#fff",
              width: "90%",
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 0.3,
              elevation: 15,
              marginTop: 1,
            }}
          >
            <Text
              style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}
            >
              المعلومات الشخصية{" "}
            </Text>
            <Icon name="person-outline" size={33} style={{ marginRight: 10 }} />
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("Tourist_ChangePass")}
        >
          <View
            style={{
              alignSelf: "center",
              flexDirection: "row",
              justifyContent: "flex-end",
              backgroundColor: "#fff",
              width: "90%",
              padding: 20,
              paddingBottom: 22,
              borderRadius: 10,
              shadowOpacity: 0.3,
              elevation: 15,
              marginTop: 17,
            }}
          >
            <Text
              style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}
            >
              تغيير الرقم السري
            </Text>
            <Icon
              name="lock-closed-outline"
              size={33}
              style={{ marginRight: 10 }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleModal}
          style={{
            alignSelf: "center",
            flexDirection: "row",
            justifyContent: "flex-end",
            backgroundColor: "#fff",
            width: "90%",
            padding: 20,
            paddingBottom: 22,
            borderRadius: 10,
            shadowOpacity: 0.3,
            elevation: 15,
            marginTop: 20,
            marginBottom: 19,
          }}
        >
          <Text style={{ fontSize: 18, marginTop: 7, marginRight: 8, flex: 1, textAlign: "right" }}>
            تسجيل الخروج
          </Text>

          <Icon name="log-out-outline" size={33} style={{ marginRight: 5 }} />
        </TouchableOpacity>
        <Modal isVisible={isModalVisible}>
          <View style={[styles.modalView]}>
            <View style={[styles.main]}>
              <View style={{ marginVertical: 20 }}>
                <Text
                  style={{ textAlign: "center", fontSize: 18 }}
                >
                  هل أنت متأكد من تسجيل الخروج
                </Text>

              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <View style={{}}>
                  <Button title="الغاء" onpress={toggleModal}
                    style={{ backgroundColor: colors.lightBrown }} />

                </View>
                <View style={{}}>
                  <Button title="نعم" onpress={() => logout()}

                    style={{ backgroundColor: colors.redTheme }} />
                </View>

              </View>
            </View>
          </View>
        </Modal>
      </View>
    </View>
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
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  main: {
    backgroundColor: "#fff",
    width: screenWidth.width80,
    padding: 20,
    borderRadius: 20,
  },
});