import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as React from "react";

export default function Log_in(navigation) {
    return (
        <View style={styles.container}>
            <View>
                <Text>Welcome to Daleel test2 </Text>

                <TouchableOpacity
                    style={{
                        borderRadius: 25,
                        width: "48%",
                        height: 50,
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                // onPress={() => navigation.navigate("Sign_up")}
                >
                    <Text
                        style={{
                            fontWeight: "bold",
                            alignSelf: "center",
                            fontSize: 18,
                        }}
                    >hugy
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
