import React from "react";
import { Button, StyleSheet, View, Alert } from "react-native";

export default SimpleButton = ({ title, color, disabled, message }) => {
  color = color || "blue";

  return (
    <View style={styles.container}>
      <Button
        title={title}
        disabled={disabled}
        color={color}
        onPress={() => {
          Alert.alert(message);
        }}
      />
    </View>
  );
};

const backgroundColor = "#fff";

const styles = StyleSheet.create({
  container: {
    backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  }
});
