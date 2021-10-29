import React from "react";
import { Button, StyleSheet, View, Text } from "react-native";

export default CounterButton = ({ title, color, disabled, message }) => {
  const [counter, setCounter] = React.useState(0);
  color = color || "blue";

  return (
    <View style={styles.container}>
      <Text>{counter}</Text>
      <Button
        title={title}
        disabled={disabled}
        color={color}
        onPress={() => {
          setCounter(counter + 1);
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
