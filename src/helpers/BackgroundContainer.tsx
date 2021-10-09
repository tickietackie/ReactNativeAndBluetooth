import React, { ReactNode } from 'react';
import {
  StyleSheet, StatusBar, SafeAreaView, useColorScheme, Platform, useWindowDimensions,
} from 'react-native';

declare interface AppProps {
  children: ReactNode;
}

export default function BackgroundContainer({ children }: AppProps) {
  // Container for backgroundcolor and to provide offline screen to every screen
  // Child props have to be passed because otherwise they won't render

  const colorScheme = useColorScheme();

  const marginHorizontal: string = useWindowDimensions().width > 1000 ? '10%' : '0%';

  const themeStatusBarStyle = colorScheme === 'light' ? 'dark-content' : 'light-content';

  return (
    <SafeAreaView style={[styles.container, { marginHorizontal }, { marginTop: Platform.OS !== 'ios' ? '3%' : '8%' }]}>
      {children}
      <StatusBar barStyle={themeStatusBarStyle} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: '1%',
    // width: "100%",
    // left: "10%",
    // maxWidth: 1000,
    // alignSelf: "center",
    // maxWidth: 1000,
    // paddingTop: Constants.statusBarHeight,
  },
});
