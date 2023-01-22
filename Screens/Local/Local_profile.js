import * as ImagePicker from "expo-image-picker";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Modal from "react-native-modal";
import Icon from "react-native-vector-icons/Ionicons";
import AppImage from "../../component/AppImage";
import Button from "../../component/button/Button";
import { imagePickerConfig, images, screenWidth } from "../../config/Constant";
import { auth, db } from "../../config/firebase";

export default function Local_profile({ navigation }) {
  const [isModalVisible, setModalVisible] = useState(false);

  const [fname, setFname] = useState("");
  const [filePath, setFilePath] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [aa, setaa] = useState([]);
  const [pic, setpic] = useState("");
  const [pic_array, setpic_array] = useState([]);
  const [value, setValue] = React.useState({
    username: "",
  });

  const user = auth.currentUser;

  /*const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      
      ...imagePickerConfig
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
      const data = {
        poster: result.assets[0].uri,
      };
      const xx = result.assets[0].uri;

      await addDoc(collection(db, "test"), data);
    }
  };*/
  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      ...imagePickerConfig,
    });
    if (!result.canceled) {
      setFilePath(result.assets[0].uri);
    }
  };
  const uploadImage = async (path) => {
    try {
      const uri = Platform.OS === "ios" ? path.replace("file://", "") : path;
      const response = await fetch(uri);
      const storage = getStorage();

      const fileName = uri.substring(uri.lastIndexOf("/") + 1);
      const blobFile = await response.blob();

      const reference = ref(storage, `media/${Date.now()}-${fileName}`);

      const result = await uploadBytesResumable(reference, blobFile);
      const url = await getDownloadURL(result.ref);
      // console.log("🚀 ~ url", url);

      return url;
    } catch (err) {
      return Promise.reject(err);
    }
  };
  const toggleModal = () => {
    setModalVisible((prev) => !prev);
    // console.log("11");
  };

  const submitRequest = async () => {
    try {
      setModalVisible(!isModalVisible);

      const isTourHasImage = filePath ? true : false;
      let imageUrl = null;
      if (isTourHasImage) {
        imageUrl = await uploadImage(filePath);
      }
      // console.log("11777777", imageUrl);
      const colRef = query(
        collection(db, "Admin_users"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(colRef);
      var myData = [];
      //store the data in an array myData
      let userinfo2;
      snapshot.forEach((doc) => {
        userinfo2 = doc.data();
        userinfo2.id = doc.id;
        myData.push(userinfo2.pictures);
        // console.log("check", userinfo2.pictures);
        setaa(userinfo2.pictures);
        // console.log("check2", aa);
      });
      let PArray = userinfo2.pictures ? userinfo2.pictures : [];
      // console.log("jjjhh1", myData);
      // console.log("check3", userinfo2.pictures);

      PArray.push(imageUrl);
      // console.log("parray", PArray);

      //myData.pictures = PArray;

      await updateDoc(doc(db, "Admin_users", user.uid), { pictures: PArray });
      navigation.goBack();

      // setLoading(false);
      // navigation.navigate("Home");
    } catch (error) {
      setIsLoading(false);
      alert("حدث خطأ ما، الرجاء المحاولة مرة أخرى");
      console.log("error submitRequest", error);
    }
  };

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    try {
      const colRef = query(
        collection(db, "Admin_users"),
        where("uid", "==", user.uid)
      );
      const snapshot = await getDocs(colRef);
      var myData = [];
      //store the data in an array myData
      snapshot.forEach((doc) => {
        let userinfo2 = doc.data();

        setFname(userinfo2.firstname);
        setpic(userinfo2.poster);
        setpic_array(userinfo2.pictures);
        userinfo2.id = doc.id;
        myData.push(userinfo2);
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ImageBackground
      style={{ flex: 1 }}
      source={images.backgroundImg}
      resizeMode="cover"
    >
      <View
        style={{
          height: "10%",
          borderBottomLeftRadius: 20,
          borderBottomRightRadius: 20,
          paddingHorizontal: 20,
          marginTop: 11,
        }}
      >
        <View
          style={{
            borderBottomLeftRadius: 20,
            borderBottomRightRadius: 20,
            paddingHorizontal: 20,
            marginTop: 30,
          }}
        >
          <Text
            style={{
              borderBottomLeftRadius: 20,
              borderBottomRightRadius: 20,
              paddingHorizontal: 20,
              marginTop: 7,
              textAlign: "center",
              fontSize: 37,
              fontWeight: "bold",
            }}
          >
            {fname}
          </Text>
        </View>

        <Icon
          name="arrow-back-outline"
          size={45}
          style={{ color: "black", marginTop: -29, marginLeft: -15 }}
          onPress={() => navigation.goBack()}
        />
      </View>
      <View>
        {pic ? (
          <AppImage
            sourceURI={pic}
            style={{
              alignSelf: "center",
              width: 170,
              height: 180,
              borderRadius: 150,
              resizeMode: "center",
              borderWidth: 3,
              borderColor: "grey",
            }}
          />
        ) : (
          <Image
            source={images.photo}
            style={{
              alignSelf: "center",
              width: 170,
              height: 180,
              borderRadius: 150,
              resizeMode: "center",
              borderWidth: 3,
              borderColor: "grey",
            }}
          />
        )}
      </View>
      <View
        style={{
          borderRadius: 20,
          marginBottom: 15,
          marginTop: 15,
          backgroundColor: "lightgrey",
          alignItems: "center",
          marginHorizontal: 5,
        }}
      >
        <Icon
          name="add-outline"
          size={45}
          style={{ color: "black" }}
          onPress={() => toggleModal()}
        />
      </View>

      <View style={{ marginBottom: -9 }}>
        <FlatList
          columnWrapperStyle={{ justifyContent: "space-between" }}
          numColumns={3}
          data={pic_array}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => {
            return (
              <View>
                <Icon
                  name="close-circle-outline"
                  size={30}
                  style={{
                    color: "black",
                    marginTop: 9,
                    marginLeft: 80,
                    position: "absolute",
                    left: 10,
                    zIndex: 1,
                    color: "red",
                  }}
                  /*  onPress={() =>
                               DeleteFunc(item)
                             }    */
                />
                <TouchableOpacity
                  // onPress={() =>
                  //  navigation.navigate({
                  // key: "step_1",
                  // params: item,
                  //   })
                  //  }
                  style={{
                    backgroundColor: "lightgrey",
                    marginHorizontal: 5,
                    borderRadius: 10,
                    marginVertical: 7,
                  }}
                >
                  <AppImage sourceURI={item} style={[styles.dummyImg]} />
                </TouchableOpacity>
              </View>
            );
          }}
        />
      </View>
      <Modal isVisible={isModalVisible}>
        <View style={[styles.modalView]}>
          <View style={[styles.main]}>
            <View>
              <TouchableOpacity
                onPress={() => pickImage()}
                style={[styles.alignCenter, { marginTop: screenWidth.width20 }]}
              >
                <Image source={images.photo} style={[styles.dummyImg]} />
              </TouchableOpacity>
            </View>
            <View style={{ margin: 9 }}>
              <Button title="حفظ" onpress={submitRequest} />
            </View>
            <View>
              <Button title="الغاء" onpress={() => toggleModal()} />
            </View>
          </View>
        </View>
      </Modal>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // marginTop: screenWidth.width10,
  },
  alignCenter: {
    alignItems: "center",
  },
  dummyImg: {
    width: 120,
    height: 140,
  },
  alignRight: {
    alignSelf: "flex-end",
  },
  smallInputDiv: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  datePicker: {
    position: "absolute",
    bottom: 0,
    right: 0,
    marginRight: 40,
    marginBottom: 5,
  },
  InputStyle: {
    width: screenWidth.width25,
    padding: 5,
    borderWidth: 3,
    borderColor: "#BDBDBD",
    borderRadius: 20,
    paddingHorizontal: 10,

    textAlign: "right",
  },
  sheetText: {
    alignSelf: "center",
    marginVertical: 10,
  },
  timeFlex: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 20,
  },
  card: {
    height: "60%",
    backgroundColor: "lightgrey",
    marginHorizontal: 5,
    borderRadius: 10,
    borderColor: "#00a46c",
    borderWidth: 0.2,
    marginVertical: 10,
  },
});
