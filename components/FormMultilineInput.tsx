import { AntDesign } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";


interface Props {
    labelValue: string, 
    placeholderText: string, 
    iconType: string
}

interface State {
    height: number;
}

export class FormMultilineInput extends React.Component<Props & any,State> {
    state: any;

    constructor(props: Props|any) {
        super(props);
        this.state = { height: 0 };
    }

    render() {
        // Update the input height each render allow for new lines from the user
        let inputStyle = Object.assign({}, styles.input, {height: Math.max(35, this.state.height)});
        
        // Dynamically expand the container height to compensate for the input height's
        let inputContainer = Object.assign({}, styles.inputContainer, this.props.inputStyles);
        if (inputContainer.height < (inputStyle.height - 5))
            inputContainer.height = inputStyle.height + 5;

        // console.log("InputContainer Height: " + inputContainer.height, "Input Style Height: " + inputStyle.height);
        return (
            <View style={inputContainer}>
                { 
                    this.props.iconType === undefined || this.props.iconType == null &&
                    <View style={styles.iconStyle}>
                        <AntDesign name={this.props.iconType} size={25} color="#666" />
                    </View> 
                }
                <TextInput
                    {...this.props}
                    placeholder={this.props.placeholderText}
                    placeholderTextColor="#666"

                    multiline={true}
                    
                    onContentSizeChange={(event) => {
                        this.setState({ height: event.nativeEvent.contentSize.height + 10 })
                    }}
                    style={inputStyle}
                    
                    value={this.props.labelValue}
                    onChangeText={(text) => {
                        if (typeof(this.props.onChangeText) === 'function') {
                            this.props.onChangeText(text);
                        }
                    }}
                />
            </View>
        );
    }
}

import Layout from '../constants/Layout';

let windowHeight = Layout.window.height;
let windowWidth = Layout.window.width;

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