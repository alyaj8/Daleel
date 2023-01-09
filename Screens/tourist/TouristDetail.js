import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, ImageBackground, ScrollView, TouchableOpacity } from 'react-native';
import React, { useState } from "react";
import { images, screenWidth } from '../../config/Constant';
import { SafeAreaView } from "react-native-safe-area-context";
import text from '../../style/text';
import Input from '../../component/inputText/Input';
import SmallInput from '../../component/inputText/smallInput';
import Button from '../../component/button/Button';
import Modal from "react-native-modal";
import * as ImagePicker from "expo-image-picker";

export default function BookingDetail({ navigation }) {
    const [isModalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState(null);
    const [date, setDate] = useState(null);
    const [time, setTime] = useState(null);
    const [location, setLocation] = useState(null);
    const [description, setDescription] = useState(null);
    const [filePath, setFilePath] = useState(null);
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setFilePath(result.assets[0].uri);
        }
    };






    const toggleModal = () => {
        setModalVisible(!isModalVisible);
    };
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
                <ImageBackground style={{ flex: 1 }}
                    source={images.backgroundImg} resizeMode="cover">
                    <View style={[styles.alignCenter, { marginTop: 20 }]}>
                        <Text style={[text.white, text.text30]}>جولاتي</Text>
                    </View>
                    <View style={[styles.card]}>
                        <View style={[styles.alignCenter, {}]}>
                            <Image source={images.photo} style={[styles.dummyImg]} />
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={[text.black, text.text40, { fontWeight: 'bold' }]}>
                                جولة بلدة
                            </Text>
                        </View>
                        <View style={{ alignSelf: 'center' }}>
                            <Text style={[text.black, text.text20, { fontWeight: 'bold' }]}>
                                جولة بلدة العلا القديمة
                            </Text>
                        </View>

                        <View style={{ alignSelf: 'flex-end', marginVertical: 10 }}>
                            <Text style={[text.black, text.text14]}>
                                السبت 4:00 - 5:00 مساء
                            </Text>
                        </View>
                        <View style={{ margin: 5 }}>
                            <Text style={[text.black, text.text18, text.right]}>
                                مخصصة للاسترخاء بتصميم عصري ومريح ندعوك لاستكشاف أشهر التكوينات الصخرية في العلاء مع فرصة مميزة لتأمل عظمة هذه التحفة الطبيعية الخالدة من موقع مثالي
                            </Text>
                        </View>
                        <View style={{ margin: 5 }}>
                            <Text style={[text.black, text.text18, text.right]}>
                                مخصصة للاسترخاء بتصميم عصري ومريح ندعوك لاستكشاف أشهر التكوينات الصخرية في العلاء مع فرصة مميزة لتأمل عظمة هذه التحفة الطبيعية الخالدة من موقع مثالي
                            </Text>
                        </View>

                        <TouchableOpacity
                            onPress={toggleModal}
                            style={[styles.btnDiv]}>
                            <Image style={[styles.icon, { tintColor: '#fff' }]} source={images.cart} />
                            <Text style={[text.white, text.text18]}> أحجز الرحلة الآن</Text>
                            <Text style={[text.white, text.text25]}>|</Text>
                            <Text style={[text.white, text.text18]}> ريال 70</Text>
                        </TouchableOpacity>
                    </View>

                    <StatusBar style="auto" />
                    <Modal isVisible={isModalVisible}>
                        <View style={[styles.modalView]}>
                            <View style={[styles.main]}>
                                <View style={{ marginVertical: 40, }}>
                                    <Text style={[text.themeDefault, text.text22, { textAlign: 'center', fontWeight: 'bold' }]}>
                                        هل أنت متأكد من حجز هذه الرحلة ؟
                                    </Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                    <View style={{}}>
                                        <Button title="حجز" onpress={toggleModal} />
                                    </View>
                                    <View style={{}}>
                                        <Button title="الغاء" onpress={toggleModal} />
                                    </View>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </ImageBackground>
            </ScrollView>

        </SafeAreaView>

    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: screenWidth.width10,
        backgroundColor: '#fff'

    },
    alignCenter: {
        alignItems: 'center'
    },
    dummyImg: {
        width: screenWidth.width50,
        height: screenWidth.width50,
        resizeMode: 'contain',
        opacity: 0.7
    },
    alignRight: {
        alignSelf: 'flex-end'
    },
    smallInputDiv: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'

    },
    main: {
        backgroundColor: '#fff',
        width: screenWidth.width80,
        padding: 20,
        borderRadius: 10,
    },
    card: {
        width: screenWidth.width90,
        padding: 30,
        borderRadius: 10,
        // backgroundColor: '#ececec',
        alignSelf: 'center',
        // marginVertical:50
    },
    icon: {
        width: 25,
        height: 25,
        tintColor: '#5398a0'
    },
    flexRow: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    iconLg: {
        width: 40,
        height: 40,
        tintColor: '#5398a0'

    },
    btnDiv: {
        backgroundColor: '#5398a0',
        borderRadius: 10,
        padding: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginVertical: 40
    }

});