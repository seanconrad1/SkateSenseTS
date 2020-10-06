import React, { useState } from 'react'
import { Animated, TouchableOpacity, StyleSheet, Text } from 'react-native'

const TestAnimation = () => {
  const [slideUpValue, setSideUpValie] = useState(new Animated.Value(0))
  const [opened, setOpened] = useState(true)


  const _start = () => {
    Animated.timing(slideUpValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true
    }).start();
    setOpened(true)
  };

  const _close = () => {
    Animated.timing(slideUpValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true
    }).start();
    setOpened(false)

  };

  return (
    <>
      <Animated.View
        style={{
          transform: [
            {
              translateY: slideUpValue.interpolate({
                inputRange: [0, 1],
                outputRange: [400, 200]
              })
            }
          ],
          flex: 1,
          height: 250,
          width: '90%',
          borderRadius: 12,
          backgroundColor: "lightgrey",
          justifyContent: "flex-start",
          alignItems: "center",
          position: 'absolute',
          zIndex: 100,
        }}
      >
        <TouchableOpacity style={styles.btn} onPress={() => opened ? _close() : _start()}>
          <Text style={styles.textBtn}>{opened ? "Close" : "Open"}</Text>
        </TouchableOpacity>
      </Animated.View>
    </>
  )
}

// DavidSchlossbach
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    alignItems: "center"
  },
  item: {},
  btn: {
    backgroundColor: "#480032",
    height: 40,
    padding: 3,
    justifyContent: "center",
    borderRadius: 6,
    width: '100%'
  },
  text: {
    fontSize: 20,
    color: "#fff",
    fontWeight: "bold",
    textAlign: "center"
  },
  item1: {
    backgroundColor: "red",
    padding: 20,
    width: 100,
    margin: 10
  },

  textBtn: {
    color: "#f4f4f4",
    fontWeight: "bold",
    textAlign: "center"
  }
});

export default TestAnimation