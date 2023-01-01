import { StatusBar } from "expo-status-bar";
import React, { } from "react";
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
} from "react-native";
import text from "../../style/text";
import { images, screenWidth, REQUEST_TABLE } from "../../config/Constant";
import TourDetailCard from "../../component/card/TourDetailCard";



export default function Local_Home({ navigation }) {
    return (
        <View style={styles.container}>
            <ImageBackground style={{ flex: 1 }} source={images.backgroundImg}>
                <View style={[styles.alignCenter, { marginVertical: 10 }]}>
                    <Text style={[text.white, text.text30]}>جولاتي</Text>
                </View>
                <ScrollView style={{}} showsVerticalScrollIndicator={false}>
                    <View
                        style={[styles.cardDiv, { marginTop: screenWidth.width15 }]}
                    >
                        <TourDetailCard
                            source={images.photo}
                            title={'dsds'}
                            onpress={()=> navigation.navigate('TourDetailedInformation')}
                        />
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
    alignCenter: {
        alignItems: "center",
    },
    cardDiv: {
        marginTop: 20,
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
