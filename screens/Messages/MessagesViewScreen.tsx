import * as React from 'react';
import { LogBox } from 'react-native';
import { GiftedChat, IMessage as IGiftedMessage, User as IGiftedUser } from 'react-native-gifted-chat'
import { StackScreenProps } from '@react-navigation/stack';

import { IUserBasic } from '../../application/API/Users';
import { db, firebase } from '../../application/Firebase';

import { Mutex } from 'async-mutex';
import { AntDesign } from "@expo/vector-icons";
import _ from 'lodash';

import { IMessageContent, ChatConverter, MessageContentConverter } from '../../application/API/Messages';
import { Loading } from '../../components/LoadingComponent';

interface Props extends StackScreenProps<any, any> {
    // 
}

interface State {
    messages: any[],
    loading: boolean
}

export class MessagesViewScreen extends React.Component<Props, State> {
    targetUser: IUserBasic;
    unsubscribeFirebase: (() => void)|null = null;

    collectionId: string|null = null;
    collectionIdMutex = new Mutex();

    constructor(props: Props) {
        super(props);
        LogBox.ignoreLogs([ 'Setting a timer' ]);

        this.state = { messages: [], loading: true }; // Initialize the state

        var {route} = this.props;
        let targetUser  = ((route.params) as any)['user'];
        this.targetUser = targetUser;

        this.convertFirestoreDocToGiftedMessage = this.convertFirestoreDocToGiftedMessage.bind(this);
    }

    navigateBackToChats() {
        this.props.navigation.reset({
            index: 0,
            routes: [{ name: 'Root', params: {
                screen: 'TabMessages',
                params: {
                    screen: 'TabMessagesScreen',
                }
            } }],
        });
    }

    componentDidMount() {
        console.log("componentDidMount");
        
        this.props.navigation.setOptions({
            headerTitleAlign: 'center',
            title: this.targetUser.displayName,
            headerLeft: (()=> 
                <AntDesign name="arrowleft"  
                    onPress={() => this.navigateBackToChats()}
                    size={25} style={{marginLeft: 15, marginTop: 4}} />).bind(this),
        });
        
        // Start the firebase 
        this.firebaseMessagesHandler();
    }

    componentWillUnmount() {
        // 
        if (this.unsubscribeFirebase != null && typeof(this.unsubscribeFirebase) === 'function') {
            this.unsubscribeFirebase();
        }
    }

    private async loadOrCreateChatContainer() {
        // Check if collection exists if not create it
        if (this.collectionId === null) {
            let release = await this.collectionIdMutex.acquire();

            // Check if a previous mutex already added the id
            if (this.collectionId !== null) {
                // Release the mutex
                release();
            } else {
                // Create the new id
                try {

                    const meta = this.getParticipantsMetaInformation();
                    const messages = db.collection('messages')
                        .withConverter(ChatConverter)
                    const query = await messages
                        .where('participants', 'array-contains', meta.participants[0]) // userId_otherUserId
                        .get();
    
                    // Check if it does not exists
                    if (query.docs.length == 0) {
                        // Create the collection
                        const insertObject = {
                            dateCreatedAt: new Date(),
                            dateUpdatedAt: new Date(),
                            participants: meta.participants,
                            users: meta.users
                        };

                        const added = await (messages as firebase.firestore.CollectionReference)
                            .add(insertObject);

                        this.collectionId = added.id
                        console.log("Inserting new collection = " + this.collectionId + ", Obj = ", insertObject);
                    } 
                    
                    else {
                        // Already have an id
                        this.collectionId = query.docs[0].id;
                        console.log("Already have an id!");
                    }
                } catch(e) {
                    console.warn("Error during creation of collection: ", e);
                } finally {
                    release();
                    return true;
                }
            }
        }
    }

    convertFirestoreDocToGiftedMessage(
        currentUser: firebase.User,
        doc: firebase.firestore.DocumentData
    ): IGiftedMessage {
        let msgData: IMessageContent = doc.data(); 
        let userData = 
            // Check if the message was sent by the other user
            msgData.userId !== currentUser.uid 
            // Return the other user information
            ? this.targetUser 
            // If it was sent by current user then store current user information
            : { 
                userId: currentUser.uid,
                displayName: currentUser.displayName
            };

        return {
            _id: doc.id,
            text: msgData.message,
            createdAt: msgData.dateCreatedAt,
            user: {
                _id: userData.userId,
                name: userData.displayName as string
            },
        };
    }

    async firebaseMessagesHandler() {
        // Create or find the chat id
        await this.loadOrCreateChatContainer();
        // Get the chat collection and order the messages
        const chat = db
            .collection('messages/' + this.collectionId + '/chat')
            .withConverter(MessageContentConverter)
            .orderBy('dateCreatedAt', 'desc');
        
        // Get the current user 
        const currentUser = (firebase.auth().currentUser as firebase.User);
        
        // Listen for changes in the chat container in real time.
        // store the unsubscribe function so it can be used to stop listening for changes
        // when the screen has changed.
        this.unsubscribeFirebase = chat.onSnapshot( (snapshot) => {
            // If cu has no messages then use an empty array
            if (snapshot.empty)
                this.setState({messages: []});
            
            // Convert the firebase messages to to the GiftedChat message format
            const messages: IGiftedMessage[] = snapshot.docs.map(
                (d) => this.convertFirestoreDocToGiftedMessage(currentUser, d));
            
            // Update the UI to render the messages and hide the loading screen
            this.setState({messages, loading: false});
        });
    }

    getParticipantsMetaInformation() {
        const {displayName, uid} = (firebase.auth().currentUser as firebase.User);

        // Store the user id's and displayNames to lookup later
        let userObject: any = {};
        userObject[this.targetUser.userId] = this.targetUser;
        userObject[uid] = {userId: uid, displayName};

        // Generate our participants object to find this current chat later.
        return {
            participants: [
                // Private message ids,
                // These are used to lookup the current chat
                uid + "_" + this.targetUser.userId, 
                this.targetUser.userId + "_" + uid,

                // User id's, this is used to list the chat in the user's messages screen
                uid, 
                this.targetUser.userId
            ],

            users: userObject
        };
    }

    async createMessage(message: any): Promise<boolean> {
        // Create or find the chat id
        await this.loadOrCreateChatContainer();
        
        // Get the current user's ID
        const {uid} = (firebase.auth().currentUser as firebase.User);
        // Create the chat element to store in the database
        const dbElement: IMessageContent = {
            id: "",
            userId: uid,
            message: message.text,
            dateCreatedAt: message.createdAt as Date
        };
    
        // Validate if our collectionId was not created or found.
        if (this.collectionId === null) {
            alert("Failed to initiate PM session, Please try again later");
            return false;
        }
        
        
        try {
            //add the message to the database
            var messages = await db.collection('messages/' + this.collectionId + '/chat')
                .withConverter(MessageContentConverter)
                .add(dbElement);
            console.log(
                "Added to collection: ", this.collectionId, 
                "  New msg: ", messages.id);
    
            // Update db collection 
            var collection = await db.collection('messages')
                .doc(this.collectionId)
                .withConverter(ChatConverter)
                .update({ dateUpdatedAt: new Date(), lastMessage: dbElement.message });
                
            console.log("Updated lastUpdatedAt date to now.")
        } catch (e) {
            // Log any errors
            console.log("Promise rejection adding message: ", e);
        }
    
        return true;
    }

    async onMessageSend(newMessages: any[]) {
        for (let index = 0; index < newMessages.length; index++) {
            const msg = newMessages[index];
            this.createMessage(msg);
        }

        let messages = GiftedChat.append(this.state.messages, newMessages);
        this.setState({messages});
    }

    render() {
        const user = (firebase.auth().currentUser as firebase.User);
 
        const giftedUser: IGiftedUser = {
            _id: user.uid,
            name: user.displayName as string
        };

        return <GiftedChat
                renderLoading={() =>  <Loading message="Loading chat..." />}
                messages={this.state.messages}
                onSend={messages => this.onMessageSend(messages as any[])}
                user={giftedUser}
                scrollToBottom
                />;
    }
}