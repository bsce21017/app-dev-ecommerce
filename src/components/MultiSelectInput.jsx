import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const MultiSelectInput = ({
  options,
  placeholder = 'Select an option',
  selectedValue = null,
  onValueChange,
  style,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const selectOption = (value) => {
    onValueChange(value);
    setShowOptions(false);
  };

  return (
    <View style={[styles.container, style]}>
      <TouchableOpacity
        style={styles.input}
        onPress={() => setShowOptions(!showOptions)}
      >
        <Text style={!selectedValue || !options.find(opt => opt.value === selectedValue) ? styles.placeholder : styles.selectedText}>
          {selectedValue && options.find(opt => opt.value === selectedValue)
            ? options.find(opt => opt.value === selectedValue).label
            : placeholder}
        </Text>
      </TouchableOpacity>

      {showOptions && (
        <View style={styles.optionsContainer}>
          {options.map((option) => (
            <TouchableOpacity
              key={option.value}
              style={[
                styles.option,
                selectedValue === option.value && styles.selectedOption
              ]}
              onPress={() => selectOption(option.value)}
            >
              <Text>{option.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginVertical: 8,
  },
  input: {
    // borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    // padding: 12,
  },
  placeholder: {
    color: '#999',
  },
  selectedText: {
    color: '#000',
  },
  optionsContainer: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    marginTop: 4,
    zIndex: 10,
  },
  option: {
    // paddingTop: 5,
    paddingLeft: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  selectedOption: {
    backgroundColor: '#e0f7fa',
  },
});

export default MultiSelectInput;