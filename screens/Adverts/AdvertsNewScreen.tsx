import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';

import { FormMultilineInput } from '../../components/FormMultilineInput';
import FormButton from '../../components/FormButton';

import { margin, padding } from '../../application/StyleHelpers';
import { StringIsEmptyOrWhitespaced } from '../../application/UtilityFunctions';
import { firebase, db } from '../../application/Firebase';


interface Props {
    navigation: StackNavigationProp<any, any>
};

interface State {
    description: string;
}

export class AdvertsNewScreen extends React.Component<Props, State> {
    private descriptionMaxLength: number = 600;

    constructor(props: any) {
        super(props);

        this.state = { description: "" };
        this.postNewAdvert = this.postNewAdvert.bind(this);
    }

    async postNewAdvert() {
        // Check if the advert is empty
        if (StringIsEmptyOrWhitespaced(this.state.description)) {
            alert("Please enter the advert's contents.");
            return;
        }

        const {uid, displayName} = firebase.auth().currentUser as firebase.User;

        // Limit text to first 600 chars
        let trimmed = this.state.description.length > this.descriptionMaxLength 
            ? this.state.description.substring(0, this.descriptionMaxLength)
            : this.state.description
        
        // Insert the new advert
        let adverts = db.collection('adverts');
        await adverts.add({
            date: firebase.firestore.Timestamp.now(),
            message: trimmed,
            userId: uid,
            userDisplayName: displayName
        });

        alert("Posted advert!");

        // Navigate back to the adverts screen
        if (this.props.navigation.canGoBack()) {
            this.props.navigation.goBack();
        } else {
            this.props.navigation.reset({
                index: 0,
                routes: [{ name: 'Root' }],
            });
        }
    }

    render() {
        return (
            <View style={styles.viewContainer}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.container}>
                        <View style={advertItemStyles.borderBox}>
                            <View>
                                <Text style={advertItemStyles.message}>
                                    Please Specify wether your a team or player in the ad please:
                                </Text>
                            </View>
                        </View>
                    </View>

                    <FormMultilineInput
                        labelValue={this.state.description}
                        onChangeText={(v: string) => this.setState({description: v})}
                        placeholderText="Write your ad here (Max 600 chars)..."
                        iconType="form"
                        keyboardType="default"
                        autoCapitalize="none"
                        autoCorrect={false}
                        numberOfLines={8}
                        maxLength={this.descriptionMaxLength}
                    />

                    <FormButton
                        buttonTitle="POST ADVERT"
                        onPress={() => this.postNewAdvert()}
                    />
                </ScrollView>
            </View>
        );
    }
}


const screenHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
  viewContainer: {
    height: "auto",
    maxHeight: screenHeight
  },
  container: {
    flexGrow: 1,
    padding: 10,
    paddingTop: 5
  },
  logo: {
    height: 50,
    width: 50,
    resizeMode: 'cover',
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  textButton: {
    marginVertical: 15,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
  },

    borderBox: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
    },
});


const advertItemStyles = StyleSheet.create({
    container: { 
        ...margin (0,10,10,10), 
    },

    borderBox: {
        backgroundColor: '#E6E6E6',
        borderRadius: 8,
    },

    message: {
        ...padding(20,20,20,20),
        fontWeight: 'bold',
        fontSize: 16
    },

    seperator: {
        backgroundColor: '#fff',
        width: '80%',
        height: 3
    }
});