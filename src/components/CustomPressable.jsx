import React from "react";
import { Pressable, Text, StyleSheet, View, Image } from "react-native";


const CustomPressable = ({ title, onPress, style, textStyle, imagePath , absPos, disabled}) => {
    return (
        <Pressable style={({ pressed }) => [
            pressed && styles.pressedButton,
            style, styles.button,
        ]} onPress={onPress} disabled = {disabled}>
            <View style = {styles.imageCase}>
                <Image style = {[absPos, styles.image]} source={imagePath} />
                <Text style={[styles.text, textStyle]}>{title}</Text>
            </View>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    button: {
        borderRadius: 30,
        alignSelf: "center",
        justifyContent: "center",
        alignItems: "center",
    },

    pressedButton: {
        backgroundColor: "#003d80",
        // borderColor: "#003d80",
    },
    text: {
        fontSize: 14,
        fontWeight: 400,
        letterSpacing: 0.7,
        fontStyle: "normal",
        position: "relative",
    },

    imageCase: {
        position: "absolute",
        flexDirection: "row",
        alignItems: "center",
    },

    image: {
        // marginRight: 20,
        position: "absolute",
    },
});

export default CustomPressable;