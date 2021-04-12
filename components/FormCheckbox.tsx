import React from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../constants/Layout';

import BouncyCheckbox from 'react-native-bouncy-checkbox';

let windowHeight = Layout.window.height;
let windowWidth = Layout.window.width;
//if hiding the icon dont render the Icon Box
// ...rest = <FormCheckbox hideIcon="true/false" etc />
const FormCheckbox = ({ labelValue, iconType, ...rest }: any) => {
  let cb = <BouncyCheckbox {...rest} />;

  return (
    <View style={styles.inputContainer}>
      {
        
        (rest['hideIcon'] === undefined || rest['hideIcon'] === false) && 
        <View style={styles.iconStyle}>
          <AntDesign name={iconType} size={25} color="#666" />
        </View>
      }
      <View style={{ flexDirection: 'row' }}>
        {cb}
        {(labelValue !== undefined || labelValue !== null) &&
          <Text style={{ marginTop: 5 }}>{labelValue}</Text>}
      </View>
    </View>
  );
};

export default FormCheckbox;

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



/*
// Old code
import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Platform,
  StyleSheet,
  ScrollView,
  TextInput,
  CheckBox as NativeCheckbox
} from 'react-native';
import CommunityCheckbox from '@react-native-community/checkbox';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Layout from '../constants/Layout';

let windowHeight = Layout.window.height;
let windowWidth = Layout.window.width;

const FormInput = ({labelValue, iconType, ...rest}: any) => {
    let cb = Platform.OS === 'android' 
        ? ( <CommunityCheckbox {...rest} /> ) 
        : ( <NativeCheckbox {...rest} /> ) ;

    return (
        <View style={styles.inputContainer}>
            <View style={styles.iconStyle}>
                <AntDesign name={iconType} size={25} color="#666" />
            </View>
            <View style={{ flexDirection: 'row' }}>
                {cb}
                <Text style={{marginTop: 5}}>{labelValue}</Text>
            </View>
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
}); */