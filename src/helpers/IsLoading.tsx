import React from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import BackgroundContainer from "./BackgroundContainer";

const Loading = function Loading() {
  return (
    <BackgroundContainer>
      <View style={styles.loadingContainer}>
        <ActivityIndicator testID="Loading" size="large" color="red" />
      </View>
    </BackgroundContainer>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center"
  }
});

export default Loading;
