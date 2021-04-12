import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TextInput
} from 'react-native';

import AntDesign from 'react-native-vector-icons/AntDesign';
import { StringIsEmptyOrWhitespaced } from '../application/UtilityFunctions';
import Layout from '../constants/Layout';

let windowHeight = Layout.window.height;
let windowWidth = Layout.window.width;

const FormInput = ({labelValue, placeholderText, iconType, ...rest}) => {


  let [height, setHeight] = useState(windowHeight / 15);
  let inputContainer = Object.assign({}, styles.inputContainer, rest['inputStyles']);
  let inputStyle = Object.assign({}, styles.input, rest['inputElemStyles'], {height: Math.max(35, height)});

  return (
    <View style={inputContainer}>
      { 
        // If hiding the icon dont render the Icon Box
        (!StringIsEmptyOrWhitespaced(iconType)) &&
        <View style={styles.iconStyle}>
          <AntDesign name={iconType} size={25} color="#666" />
        </View> 
      }
      <TextInput
        style={inputStyle}
        numberOfLines={1}
        value={labelValue}
        placeholder={placeholderText}
        placeholderTextColor="#666"
        onContentSizeChange={(event) => {
          setHeight(event.nativeEvent.contentSize.height)
        }}

        {...rest}
      />
    </View>
  );
};

export default FormInput;

const styles = StyleSheet.create({
  inputContainer: {
    marginTop: 5,
    marginBottom: 10,
    width: '100%',
    height: windowHeight / 15,
    borderColor: '#ccc',
    borderRadius: 3,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  iconStyle: {
    padding: 10,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: 1,
    width: 50,
  },
  input: {
    padding: 10,
    flex: 1,
    fontSize: 16,
    color: '#333',
    justifyContent: 'center',
    alignItems: 'center',
  },
  inputField: {
    padding: 10,
    marginTop: 5,
    marginBottom: 10,
    width: windowWidth / 1.5,
    height: windowHeight / 15,
    fontSize: 16,
    borderRadius: 8,
    borderWidth: 1,
  },
});