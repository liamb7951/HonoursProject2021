import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { Dimensions, LogBox, StyleSheet, Text, View } from 'react-native';
import { margin, padding } from '../../application/StyleHelpers';
import { db, firebase } from '../../application/Firebase';

import { Loading } from '../../components/LoadingComponent';
import { IUserBasic } from '../../application/API/Users';
import { AntDesign } from '@expo/vector-icons';
import { GetAvatarColors, IAvatarInformation } from '../../application/Avatar';
import { FormMultilineInput } from '../../components/FormMultilineInput';
import FormButton from '../../components/FormButton';
import { ScrollView } from 'react-native-gesture-handler';
import FormInput from '../../components/FormInput';

interface Props extends StackScreenProps<any, any> {
    //
}

interface State {
    loading: boolean,

    userId: string,
    userInfo?: IUserBasic,
    avatar: IAvatarInformation
}

export class ProfileScreen extends React.Component<Props, State> {
    private descriptionMaxLength: number = 600;
    private isCurrentUser: boolean = false;

    constructor(props: Props) {
        super(props);
        LogBox.ignoreLogs(['Setting a timer']);

        // If the userId is null then its current user
        // navigating to the bottom tab screen instead of clicking on a user
        console.log("ProfileScreen Route Params: ", this.props.route);

        this.isCurrentUser = this.props.route?.params === undefined || !this.props.route.params.hasOwnProperty('userId');

        var userId = this.isCurrentUser
            ? null
            : this.props.route.params['userId'] as string

        if (userId === undefined || userId === null) {
            this.isCurrentUser = true;

            let fbUser = firebase.auth().currentUser;
            userId = fbUser.uid;
        }

        let avatar = GetAvatarColors(".");
        this.state = { avatar, userId, loading: true }; // Initialize the state
    }

    async componentDidMount() {
        // Load the user information
        this.setState({ loading: true });
        this.setupNavigationOptions("Loading user info.");

        var users = db.collection('users');
        var doc = users.doc(this.state.userId);
        var docData = await doc.get();
        var userInfo: IUserBasic = docData.data() as IUserBasic;

        // console.log("User Info: ", userInfo);
        this.setupNavigationOptions(this.isCurrentUser ? "My Profile" : userInfo.displayName);
        this.setState({ userInfo, loading: false, avatar: GetAvatarColors(userInfo.displayName) })
    }

    componentWillUnmount() {
        //
    }

    setupNavigationOptions(title: string) {
        var options: any = {
            headerTitleAlign: 'center'
        };

        if (this.isCurrentUser) {
            options = { ...options, title };
        } else {
            options = {
                ...options,
                title,
                headerLeft: (() =>
                    <AntDesign name="arrowleft"
                        onPress={() => this.navigateBackToMyUser()}
                        size={25} style={{ marginLeft: 15, marginTop: 4 }} />).bind(this)
            }
        }

        this.props.navigation.setOptions(options);
    }

    navigateBackToMyUser() {
        this.props.navigation.reset({
            index: 0,
            routes: [{
                name: 'Root', params: {
                    screen: 'TabProfile',
                    params: {
                        screen: 'TabProfileScreen',
                    }
                }
            }],
        });
    }

    async updateUserInformation() {
        var users = db.collection('users');
        var doc = users.doc(this.state.userId);

        await doc.update({description: this.state.userInfo.description});
        alert("Updated!");
    }

    render() {
        if (this.state.loading)
            return <Loading message="Loading user information..." />;

        let imageContainer = { ...styles.imageContainer, backgroundColor: this.state.avatar.background, color: this.state.avatar.forecolor };

        return (
            <View style={{ ...styles.viewContainer, height:  Dimensions.get('window').height }}>
                <ScrollView contentContainerStyle={styles.container}>
                    <View style={styles.imageMasterContainer}>
                        <View style={{ justifyContent: 'center', alignItems: 'center', padding: 5 }}>
                            <Text style={imageContainer}>
                                {this.state.avatar.name}
                            </Text>
                        </View>
                    </View>

                    <View style={{ margin: 20 }}>
                        <FormInput
                            labelValue={this.state.userInfo.displayName}
                            // onChangeText={(v: string) => this.setState({})}
                            placeholderText="Display Name"
                            iconType=""
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                            inputStyles={inputStyles.displayName}
                            inputElemStyles={inputStyles.displayNameInputElem}
                            editable={false}
                        />

                        <FormMultilineInput
                            labelValue={this.state.userInfo.description}
                            onChangeText={(v: string) => this.setState({ userInfo: { ...this.state.userInfo, description: v } })}
                            placeholderText={this.isCurrentUser ? "Write your user description here..." : "No profile description provided."}
                            iconType=""
                            keyboardType="default"
                            autoCapitalize="none"
                            autoCorrect={false}
                            numberOfLines={8}
                            maxLength={this.descriptionMaxLength}
                            inputStyles={inputStyles.description}
                            editable={this.isCurrentUser}
                        />
                        
                        {
                            this.isCurrentUser && 
                            <FormButton
                                buttonTitle="UPDATE"
                                onPress={() => this.updateUserInformation()}
                            />
                        }
                    </View>
                </ScrollView>
            </View>
        )

        return (
            <View style={styles.container}>
                
            </View>
        )
    }
}

const inputStyles = StyleSheet.create({
    description: {
        ...padding(30,20,30,20),
        borderRadius: 8,
    },

    displayName: {
        borderRadius: 8,
        ...padding(30,20,30,20),
    }, 
    displayNameInputElem: {
        fontStyle: 'italic',
        color: '#555'
    }
});

const styles = StyleSheet.create({
    viewContainer: {
        height: "auto",
        
    },
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#fff'
        // flexGrow: 1,
        // padding: 10,
        // paddingTop: 5
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

    imageMasterContainer: {
        top: -10
    },

    imageContainer: {
        width: 140,
        height: 140,
        marginRight: 10,
        textAlign: 'center',
        fontWeight: 'bold',
        fontSize: 40,
        marginTop: 0,
        alignContent: 'center',
        textAlignVertical: "center",

        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2
    },
});


const advertItemStyles = StyleSheet.create({
    container: {
        ...margin(0, 10, 10, 10),
    },

    borderBox: {
        backgroundColor: '#E6E6E6',
        borderRadius: 8,
    },

    message: {
        ...padding(20, 20, 20, 20),
        fontWeight: 'bold',
        fontSize: 16
    },

    seperator: {
        backgroundColor: '#fff',
        width: '80%',
        height: 3
    }
});