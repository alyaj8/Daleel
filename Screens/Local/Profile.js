import { StatusBar } from "expo-status-bar";
import React, {useState } from "react";
import {
    StyleSheet,
    Text,
    View,
    ScrollView,
    ImageBackground,
} from "react-native";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import Button from "../../component/button/Button";
import { removeDataFromStorage } from "../../util/Storage";
import Loader from "../../component/Loaders/Loader";

export default function Profile({ navigation }) {
    const [isLoading, setIsLoading] = useState(false);

    const logout = async () => {
        setIsLoading(true);
        const response = await removeDataFromStorage('user');
        console.log('logout--------->', response)
        navigation.replace('Log_in2');
        setIsLoading(true);

    };
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
                {/* <View style={[styles.alignCenter, { marginVertical: 10 }]}>
                    <Text style={[text.white, text.text30]}>جولاتي</Text>
                </View> */}
                <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                    <View style={{ alignItems: 'center', marginTop: screenWidth.width50 }}>
                        <Button title={'LogOut'} onpress={logout} />
                    </View>
                </ScrollView>
            </ImageBackground>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: screenWidth.width10,
        backgroundColor: "#fff",
    },


});
