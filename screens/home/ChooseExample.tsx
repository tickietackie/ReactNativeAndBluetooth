/**
 * Sample BLE React Native App
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
import {
  StyleSheet, View, Text, Button, ScrollView,
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

const Home = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text>Choose BLE example</Text>
      <ScrollView>
        <Button
          title="Toggle Arduino BLE"
          onPress={() => {
            navigation.navigate('');
          }}
        />
        <Button
          title="Device Scanner - BLE Library"
          onPress={() => {
            navigation.navigate('');
          }}
        />
        <Button
          title="Device Scanner - Native"
          onPress={() => {
            navigation.navigate('');
          }}
        />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: '2%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default Home;
