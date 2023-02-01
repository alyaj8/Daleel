import React, { Component } from "react";
import { FlatList, SafeAreaView, StyleSheet, Text, View,ImageBackground,ScrollView ,Pressable,Image,TouchableOpacity} from "react-native";
import { Rating } from "react-native-ratings";
import Icon from "react-native-vector-icons/Ionicons";
import { colors, images, screenWidth } from "../../config/Constant";
import text from "../../style/text";
class Comment extends Component {
    render() {
        let book = this.props.route.params;
        console.log(book);

        return (
            <SafeAreaView style={styles.container}>
            <ScrollView showsVerticalScrollIndicator={false}>
            <ImageBackground
          style={{ flex: 1 }}
          source={images.abackgroundImg}
          resizeMode="cover"
        >
                <Pressable
            onPress={() => navigation.goBack()}
            style={{ position: "absolute", margin: 15 }}
          >
            <Image source={images.arrow} style={[styles.arrowIcon]} />
          </Pressable>
          <View style={[styles.alignCenter, { marginTop: 20 }]}>
            <Text style={[text.text25, text.bold, { color: colors.Blue }]}>
            تقييم  {book.title}
            </Text>
          </View>
                    {book.reviews?.length > 0 ? (
                        <FlatList
                            style={styles.root}
                            data={book.reviews}
                            extraData={this.state}
                            scrollEnabled={true}
                            ItemSeparatorComponent={() => {
                                return <View style={styles.separator} />;
                            }}
                            keyExtractor={(item) => {
                                return item.comenteuseruid;
                            }}
                            renderItem={(item) => {
                                console.log(item.item);
                                let review = item.item;
                                return (
                                    <View style={styles.container1}>
                                        <View style={styles.content}>
                                            <View style={styles.contentHeader}>
                                                <Text style={styles.name}>{review.commentuser}</Text>
                                                <Text style={styles.time}>
                                                    {review.date}
                                                    {"   "} {review.time}
                                                </Text>
                                            </View>
                                            <Rating
                                                imageSize={25}
                                                fractions={20}
                                                showRating={false}
                                                readonly={true}
                                                startingValue={review.review}
                                                reviews={[]}
                                                style={{
                                                    marginVertical: 20,
                                                    marginLeft: 200,
                                                }}
                                            />
                                            <Text rkType="primary3 mediumLine">{review.comment}</Text>
                                        </View>
                                    </View>
                                );
                            }}
                        />
                    ) : (
                        <Text
                            style={{
                                marginTop: 200,
                                fontSize: 30,
                                color: "grey",
                                fontWeight: "bold",
                                // alignItems: "center",
                                // alignSelf: "center",
                                textAlign: "center",
                            }}
                        >
                            No Review Yet
                        </Text>
                    )}
               
               <TouchableOpacity
            style={{
                borderRadius: 25,
                backgroundColor: colors.brown ,
                width: "48%",
                alignSelf: "center",
                marginTop: 30,
                marginBottom: 20,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
         
            }}
          
            onPress={() => this.props.navigation.navigate("Review2", book)}
          >
            <Text
              style={{
                fontWeight: "bold",
                alignSelf: "center",
                fontSize: 18,
                color:"white",
              }}
            >
             قيم الجولة
            </Text>
          </TouchableOpacity>
                </ImageBackground>
            </ScrollView>
        </SafeAreaView>
        );
    }
}
export default Comment;

const styles = StyleSheet.create({
    container: {
        flex: 1,
      },
      alignCenter: {
        alignItems: "center",
      },
    root: {
        backgroundColor: "#ffffff",
        marginTop:20,
    },
    container1: {
        paddingLeft: 19,
        paddingRight: 16,
        paddingVertical: 12,
        flexDirection: "row",
        alignItems: "flex-start",
    },
    content: {
        marginLeft: 16,
        flex: 1,
    },
    contentHeader: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    separator: {
        height: 1,
        backgroundColor: "#CCCCCC",
    },
    image: {
        width: 45,
        height: 45,
        borderRadius: 20,
        marginLeft: 20,
    },
    time: {
        fontSize: 11,
        color: "#808080",
    },
    name: {
        fontSize: 16,
        fontWeight: "bold",
    },

    header: {
        flexDirection: "row",
        alignItems: "center",
        padding: 10,
        marginTop: 10,
        alignContent: "center",
        backgroundColor: "#00a46c",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
    },
    bookTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        color: "white",
    },
    dummyImg: {
        width: screenWidth.width50,
        height: screenWidth.width50,
        resizeMode: "contain",
        opacity: 0.7,
      },
      img: {
        width: screenWidth.width80,
        height: screenWidth.width60,
        resizeMode: "contain",
        borderRadius: 10,
        marginBottom: 15,
      },
      arrowIcon: {
        width: 30,
        height: 30,
        resizeMode: "contain",
        tintColor: colors.lightBrown,
      },
});
