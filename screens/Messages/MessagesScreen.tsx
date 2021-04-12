import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { FlatList, LogBox, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { margin } from '../../application/StyleHelpers';
import { db, firebase } from '../../application/Firebase';

import { MessagesParamList } from '../../types';
import { MessageUserItem } from './MessageUserItem';
import { IChat, ChatConverter } from '../../application/API/Messages';
import { Loading } from '../../components/LoadingComponent';

interface Props extends StackScreenProps<any, any> {
    //
}

interface State {
    chats: IChat[]
    loading: boolean
}

export class MessagesScreen extends React.Component<Props, State> {
    unsubscribeFirebase: (() => () => void)|null = null;

    constructor(props: Props) {
        super(props);
        LogBox.ignoreLogs([ 'Setting a timer' ]);

        this.state = { chats: [], loading: true }; // Initialize the state
    }

    componentDidMount() {
        // Start the firebase 
        this.firebaseMessagesHandler();
    }

    componentWillUnmount() {
        // 
        if (this.unsubscribeFirebase != null && typeof(this.unsubscribeFirebase) === 'function') {
            this.unsubscribeFirebase();
        }
    }

    convertFirestoreDocToChat(
        currentUser: firebase.User,
        doc: firebase.firestore.DocumentData
    ): IChat {
        return doc.data();
    }

    firebaseMessagesHandler(): void {
        const currentUser = (firebase.auth().currentUser as firebase.User);

        // Get all cu messages
        const messages = db.collection('messages')
            .withConverter(ChatConverter)
            .where('participants', 'array-contains', currentUser.uid)
            // .orderBy('dateLastMessage', 'desc')
        
        this.firebaseMessagesHandler = messages.onSnapshot( (snapshot) => {
            this.setState({loading: false});

            // Delete messages if empty
            if (snapshot.empty)
                this.setState({ chats: [] });

            let chats: IChat[] = snapshot.docs.map( (d) => this.convertFirestoreDocToChat(currentUser, d) );
            
            chats.sort(function(a,b){
                //@ts-ignore
                return b.dateUpdatedAt - a.dateUpdatedAt;
            });

            this.setState({chats, loading: false});
        });
    }

    render() {
        if (this.state.loading) 
            return <Loading message="Loading chat messages..." />;

        return (
            <View style={styles.container}>
                <FlatList
                    data={this.state.chats}
                    keyExtractor={ (item) => item.id }
                    renderItem={ ({item}) => 
                        <MessageUserItem style={styles.item} chat={item} 
                            navigation={this.props.navigation} route={this.props.route} /> 
                    }
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#fff'
    },

    item: {
        ...margin (0,10,10,10), 
        fontSize: 18,
    },
});
