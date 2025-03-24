import { Text, StyleSheet, View, ImageBackground } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons"

const PromoCard = ({ imagePath, smallText, MiddleText, MiddleNormal, LargeText, simple, name1, name2, name3 }) => {
  const SimpleCard = () => {
    return (
      <View style={styles.card}>
        <View style={styles.simpleContain}>
          <View style={styles.lineContain}>
            <Icon style={styles.Icon} name={name1} size={12} color={"#FFD700"} />
            <Text style={styles.Text}>{smallText}</Text>
          </View>
          <View style={styles.lineContain}>
            <Icon style={styles.Icon} name={name2} size={12} color={"#FFD700"} />
            <Text style={styles.Text}>{MiddleText}</Text>
          </View>
          <View style={styles.lineContain}>
            <Icon style={styles.Icon} name={name3} size={12} color={"#FFD700"} />
            <Text style={styles.Text}>{LargeText}</Text>
          </View>
        </View>
      </View>
    )
  }

  return (
    <>
      {simple ? <SimpleCard /> : <View style={styles.card}>
        <ImageBackground style={styles.imageBackground} imageStyle={styles.imageStyle} source={imagePath}>
          <View style={styles.textContainer}>
            <Text style={styles.smallText}>{smallText}</Text>
            <Text style={styles.largeText}>{MiddleText}</Text>
            {MiddleNormal &&<Text style={styles.smallText}>{MiddleNormal}</Text>}
            <Text style={styles.largeText}>{LargeText}</Text>
          </View>
        </ImageBackground>
      </View>}
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    borderColor: "#F8E6B5",
    borderWidth: 0.5,
    borderRadius: 12,
    overflow: "hidden",
    marginRight: -3,
    height: 82,
    width: 81,
    // marginVertical: 10,
  },
  imageBackground: {
    flex: 1,
  },
  imageStyle: {
    borderRadius: 12,
  },
  simpleContain: {
    flex: 1,
    justifyContent: "center",
    alignSelf: "center",
  },

  textContainer: {
    position: "absolute",
    bottom: 15,
    left: 10,
    right: 10,
  },
  smallText: {
    color: "#F8E6B5",
    fontSize: 7,
    lineHeight: 7,
    fontWeight: "400",
    letterSpacing: 1,
    marginBottom: 2,
  },
  Text: {
    color: "#F8E6B5",
    fontSize: 6.5,
    lineHeight: 12,
    fontWeight: "400",
    // marginBottom: 10,
  },
  largeText: {
    color: "#F8E6B5",
    fontSize: 10,
    lineHeight: 9,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 2,
  },
  Icon: {
    marginRight: 5, // Add some space between the text and the icon
  },

  lineContain: {
    flexDirection: "row",
    alignItems: "center", // Align items vertically in the center
    marginBottom: 4, // Add some space between each line
  }
});

export default PromoCard;