import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { ButtonGroup } from 'react-native-elements';

const styles = StyleSheet.create({
  buttonGroupContainer: {
    height: 30,
  },
  selectedButtonStyle: {
    backgroundColor: 'rgb(244, 2, 87)',
  },
});

const SpotsButtonGroup = ({ onChangeTab }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const updateIndex = index => {
    setSelectedIndex(index);
    onChangeTab(index);
  };

  const buttons = ['Submitted', 'Bookmarked'];

  return (
    <ButtonGroup
      onPress={updateIndex}
      selectedIndex={selectedIndex}
      buttons={buttons}
      containerStyle={styles.buttonGroupContainer}
      selectedButtonStyle={styles.selectedButtonStyle}
    />
  );
};

export default SpotsButtonGroup;
