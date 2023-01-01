import { StatusBar } from "expo-status-bar";
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
} from "react-native";
import * as React from "react";
import { images, screenWidth } from "../../config/Constant";
import { SafeAreaView } from "react-native-safe-area-context";
import text from "../../style/text";
import { getDateTime } from "../../util/DateHelper";
import ButtonComponent from "../button/Button";

export default function Input({
    onpress,
    source,
}) {
    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={onpress}
                style={[styles.card]}>
                <View style={[styles.flexDirection]}>
                    <View style={{}}>
                        <Image source={source} style={[styles.img]} />
                    </View>
                        <View style={{ flex: 1,marginLeft:10 }}>
                            <Text style={[text.themeDefault, text.text20, { textAlign: 'center', fontWeight: 'bold' }]}>جولة بلدة العلا القديمةبلدة العلا القدي</Text>
                        </View>
                </View>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    card: {
        width: screenWidth.width90,
        padding: 20,
        borderRadius: 10,
        backgroundColor: "#ececec",
        alignSelf: "center",
    },
    flexDirection: {
        flexDirection: "row",
        alignItems: 'center',
        justifyContent:'space-between'

    },
    img: {
        width: screenWidth.width30,
        height: screenWidth.width40,
        resizeMode: "contain",
    },
});
