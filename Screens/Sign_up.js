import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as React from "react";
import Icon from "react-native-vector-icons/Ionicons";

export default function Sign_up({ navigation }) {
    return (
        <View style={styles.container}>
            <View
                style={{
                    width: "100%",
                    height: 40,
                    paddingHorizontal: 20,
                }}
            >
                <Icon
                    name="arrow-back-outline"
                    size={40}
                    style={{ color: "black" }}
                    onPress={() => navigation.navigate("Log_in2")}
                />
            </View>
            <View>
                <Text>تسجيل حساب جديد</Text>

                <TouchableOpacity
                    style={{
                        borderRadius: 25,
                        width: "48%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigation.navigate("Local_Sign_up");
                    }}

                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            alignSelf: "center",
                            fontSize: 18,
                        }}
                    >مرشد سياحي

                    </Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={{
                        borderRadius: 25,
                        width: "48%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                    onPress={() => {
                        navigation.navigate("Tourist_Sign_up");
                    }}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            alignSelf: "center",
                            fontSize: 18,
                        }}
                    >سائح
                    </Text>
                </TouchableOpacity>

            </View>
            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});