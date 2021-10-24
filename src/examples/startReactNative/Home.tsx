import React from "react";
import { StyleSheet, Text, View } from "react-native";

import SimpleButton from "./SimpleButton";
import Counter from "./Counter";

export default App = () => (
  <View style={styles.container}>
    <Text>Home screen</Text>
    <SimpleButton title="Press to show alert" message="Caution!" color="red" disabled={false} />
    <Counter title="Press to count" message="Caution!" color="red" disabled={false} />
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
