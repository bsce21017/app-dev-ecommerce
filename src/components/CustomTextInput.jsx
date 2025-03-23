import React from "react";
import { TextInput, StyleSheet, View, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialIcons';

const CustomTextInput = ({ value, placeholder, style, textStyle, shouldNotEmpty, onChangeText, search = false }) => {
    const [val, setVal] = React.useState(value || "");
    const [isEmpty, setIsEmpty] = React.useState(false);

    const onChange = (text) => {
        setVal(text);
        onChangeText(text);
    };

    const onEnd = () => { setIsEmpty(!val.trim()); };

    return (
        <View>
            <View style={[styles.inputContainer, style]}>
                {search && <Icon style={styles.icon} name="search" size={20} color="gray" />}
                <TextInput
                    value={val}
                    onChangeText={onChange}
                    placeholder={placeholder}
                    placeholderTextColor="gray"
                    style={[styles.input, textStyle]}
                    secureTextEntry={placeholder === "Password"}
                    onBlur={onEnd}
                />
            </View>

            {shouldNotEmpty && isEmpty && <Text style={styles.alert}>! This field is mandatory</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "white",
        paddingHorizontal: 15,
        borderColor: "white",
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 0,
    },
    alert: {
        color: "red",
        fontSize: 12,
        marginTop: 5,
        marginLeft: 15,
    },
});

export default CustomTextInput;