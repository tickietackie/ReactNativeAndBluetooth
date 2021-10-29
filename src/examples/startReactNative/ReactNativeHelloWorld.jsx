import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default App = () => (
  <View style={styles.container}>
    <Text>My first app.</Text>
    <Text>React Native rocks!</Text>
  </View>
);

const backgroundColor = "#fff";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor,
    alignItems: "center",
    justifyContent: "center"
  }
});
