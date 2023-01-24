import { StatusBar } from "expo-status-bar";
import React, { useState } from "react";
import { ImageBackground, Modal, StyleSheet, Text, View } from "react-native";
import AppButton from "../../component/AppButton";
import TourForm from "../../component/forms/TourForm";
import Loading from "../../component/Loading";
import TabsWrapper from "../../component/TabsWrapper";
import { colors, highlights, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
import ActivityForm from "./../../component/forms/ActivityForm";

const tabs = [
  { title: "الجولة", selected: false },
  { title: "الأنشطة", selected: false },
];

const PostTourV2 = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);

  const onPressTab = (index) => {
    setSelectedMenu(index);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 0:
        return <TourForm />;
      case 1:
        return <ActivityForm />;
      default:
        return <TourForm />;
    }
  };

  return (
    <View style={styles.container}>
      <Loading text="جاري نشر الجولة..." visible={isLoading} />
      <ImageBackground
        style={{
          flex: 1,
          width: "100%",
        }}
        source={images.backgroundImg}
        resizeMode="cover"
      >
        {/* Header */}
        <View
          style={{
            alignItems: "center",
            marginTop: screenWidth.width10,
            // marginVertical: 0,
          }}
        >
          <View style={styles.headerContaner}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%",
              }}
            >
              <Text style={styles.headerText}>نشر جولة جديدة</Text>
              <AppButton
                disabled={false}
                style={{
                  // ...styles.button,
                  height: 40,
                  width: 60,
                  ...styles.shadow,
                }}
                title={"نشر"}
                onPress={() => {
                  setModalVisible(true);
                }}
              />
            </View>
          </View>
          <TabsWrapper menuTabs={tabs} onPressTab={onPressTab} />
        </View>

        <View
          style={{
            // flex: 1,
            // height: "100%",
            alignItems: "center",
            flexGrow: 1,
            width: screenWidth.width90,
            alignSelf: "center",
            marginBottom: 10,
            ...highlights.brdr01,
          }}
        >
          {renderContent()}
        </View>
        <View>
          <AppButton
            disabled={false}
            style={{
              ...styles.button,
              ...styles.shadow,
            }}
            title={"نشر"}
            onPress={() => {
              setModalVisible(true);
            }}
          />
        </View>
      </ImageBackground>

      {/* Modal */}
      <Modal
        visible={isModalVisible}
        transparent={true}
        collapsable={true}
        animationType="fade"
      >
        <View style={[styles.modalView]}>
          <View style={[styles.main]}>
            <View style={{ marginVertical: 20 }}>
              <Text
                style={[
                  text.themeDefault,
                  text.text22,
                  { textAlign: "center" },
                ]}
              >
                هل أنت متأكد أنك تريد نشر هذه الجولة؟
              </Text>
            </View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <AppButton
                title="نشر"
                // onPress={submitRequest}
                style={{ width: "45%", height: 55 }}
              />
              <AppButton
                title="الغاء"
                onPress={() => {
                  setModalVisible(false);
                }}
                style={{
                  width: "45%",
                  height: 55,
                  backgroundColor: colors.apple,
                }}
              />
            </View>
          </View>
        </View>
      </Modal>

      <StatusBar style="auto" />
    </View>
  );
};

export default PostTourV2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
  },
  headerContaner: {
    // flexDirection: "row",
    alignItems: "center",
    // justifyContent: "space-between",
    width: screenWidth.width90,
    marginTop: 10,
    ...highlights.brdr01,
  },
  headerText: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "right",
    width: "75%",
  },
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // ...highlights.brdr01,
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  main: {
    backgroundColor: "#fff",
    // width: screenWidth.width80,
    // backgroundColor: "red",
    padding: 20,
    borderRadius: 20,
  },
  button: {
    height: 55,
    width: "90%",
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 29,

    ...highlights.brdr07,
  },

  shadow: {
    // drop top shadow
    shadowColor: "#000",
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    // drop bottom shadow
    elevation: 5,
  },
});
