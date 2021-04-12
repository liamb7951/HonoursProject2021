import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import firebase from 'firebase';
import { Dimensions, StyleProp, StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { IChat, IUserMeta } from '../../application/API/Messages';
import { IUser, IUserBasic } from '../../application/API/Users';
import { margin } from '../../application/StyleHelpers';

import { TruncateString } from '../../application/UtilityFunctions';
import HumanSince from '../../components/HumanSince';
import { IAvatarInformation, GetAvatarColors } from '../../application/Avatar';

interface Props extends StackScreenProps<any, any> {
    style?: StyleProp<any>,
    chat: IChat
}

interface State {
    avatar: IAvatarInformation
}

export class MessageUserItem extends React.Component<Props, State> {
    currentUser: firebase.User;
    otherUser: IUserMeta;

    constructor(props: Props) {
        super(props);

        this.currentUser = (firebase.auth().currentUser as firebase.User);
        this.otherUser = this.getOtherUser();

        let avatar = GetAvatarColors(this.otherUser.displayName);
        this.state = { avatar }; // Initialize the state

        this.messageSelected = this.messageSelected.bind(this);
        this.profileSelected = this.profileSelected.bind(this);
    }

    getOtherUser(): IUserMeta {
        const {uid} = this.currentUser;
        const {chat} = this.props;

        // 1. Get the list of user id's 
        // 2. Remove my user id from the list
        // 3. Any user id's remaining should be the other user
        // 4. Return the other user's information

        // Get the user id's
        var keys: string[] = Object.keys(chat.users);
        var keyLen = keys.length; // how many user id's we have

        // Remove cu user id from the id's list
        keys.splice (keys.indexOf(uid), 1);

        let otherUser: IUser;

        // If keyLengh was 2 or 1 and is now 0, this means
        // we are chatting with ourselves. So return the 
        // current user object instead.
        if ((keyLen === 2 || keyLen === 1) && keys.length === 0 ) 
            otherUser = chat.users[uid] as IUser;
        else {
            const otherUserUid: string = keys[0];
            otherUser = chat.users[otherUserUid] as IUser;
        }
        
        // console.info("------------ Other User!" , otherUser, {keyLen, length: keys.length, keys, chat});
        return otherUser;
    }

    messageSelected(): void {
        var {navigation} = this.props;
        
        // Navigate to the user message page
        const params: IUserBasic = {
            displayName: this.otherUser.displayName,
            userId: this.otherUser.userId
        };

        navigation?.navigate('Root', {
            screen: 'TabMessages',
            params: {
                screen: 'MessagesViewScreen',
                params: { user: params }
            }
        });
    }

    profileSelected(): void {
        var {navigation} = this.props;
        
        // Navigate to the user message page
        const params = {
            userId: this.otherUser.userId
        };

        navigation?.navigate('Root', {
            screen: 'TabProfile',
            params: {
                screen: 'ProfileScreen',
                params: params
            }
        });
    }

    render() {
        // Merge any styles passed into the item with the container styles
        let rootStyles = { ...styles.container, ...this.props.style };
        let imageContainer = { 
            ...styles.imageContainer, 
            backgroundColor: this.state.avatar.background, 
            color: this.state.avatar.forecolor 
        };

        return (
            <View style={rootStyles}>
                <View style={styles.borderBox}>
                    <View style={styles.userContainer}>
                        <TouchableHighlight onPress={this.profileSelected} activeOpacity={0.8} underlayColor="#DDDDDD">
                            <View style={{justifyContent: 'center', alignItems: 'center', padding: 5}}>
                                <Text style={imageContainer}> 
                                    {this.state.avatar.name}
                                </Text>
                            </View>
                        </TouchableHighlight>

                        <View style={styles.bodyContents}>
                            <TouchableHighlight onPress={this.messageSelected} activeOpacity={0.8} underlayColor="#DDDDDD">
                                <View style={{flex: 1, flexGrow: 1}}> 
                                    <View style={styles.nameContainer}>
                                        <Text style={styles.nameFullName}>{this.otherUser.displayName}</Text>
                                        <Text style={styles.nameDate}><HumanSince date={this.props.chat.dateUpdatedAt}/> &gt;</Text>
                                    </View>
                                    <Text style={styles.message}>
                                        {TruncateString(this.props.chat.lastMessage)}
                                    </Text>
                                </View>
                            </TouchableHighlight>
                        </View>
                    </View>
                </View>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: { },

    userContainer: {
        //backgroundColor: '#0f0',
        margin: 10,
        flexDirection: 'row',
        flex: 1
    },

    bodyContents: {
        flexGrow: 1,
        flex: 1,
    },
    
    message: {
        //backgroundColor: '#ff0',
        flex: 1,
        flexGrow: 1,
        fontStyle: 'italic'
    },

    imageContainer: {
        width: 50,
        height: 50,
        marginRight: 10,
        textAlign: 'center', 
        fontWeight: 'bold',
        fontSize: 18,
        marginTop: 0,
        alignContent: 'center',
        textAlignVertical: "center",

        borderRadius: Math.round(Dimensions.get('window').width + Dimensions.get('window').height) / 2
    },

    nameContainer: {
        flex: 1,
        flexDirection: 'row',
    },

    nameFullName: {
        flexGrow: 1
    },

    nameDate: {
        minWidth: 60,
        marginRight: 5,
    },

    borderBox: {
        backgroundColor: '#F1F1F1',
        borderRadius: 8,
    },
});
