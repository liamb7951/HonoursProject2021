import { firestore } from "firebase";
import { db, firebase } from "../Firebase";
import { IUserBasic } from "./Users";

// Top collection
export interface IChat {
    id: string,
    dateCreatedAt: Date,
    dateUpdatedAt: Date,
    participants: string[],
    users: IUserMetaDictionary,

    lastMessage: string,
}


export interface IUserMeta {
    userId: string,
    displayName: string
}

// Dictionary / Hashset of the user information
export interface IUserMetaDictionary {
    [id: string]: IUserMeta
}

export interface IMessageContent {
    id: string,
    userId: string,
    message: string,
    dateCreatedAt: Date
}



export const ChatConverter = {
    toFirestore(message: IChat): firebase.firestore.DocumentData  {
        return {
            participants: message.participants,
            dateCreatedAt: firebase.firestore.Timestamp.fromDate(message.dateCreatedAt),
            dateUpdatedAt: firebase.firestore.Timestamp.fromDate(message.dateUpdatedAt),
            users: JSON.stringify(message.users),
            lastMessage: message.lastMessage === undefined ? "" : message.lastMessage
        }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot,
            options: firebase.firestore.SnapshotOptions): IChat {
        const data = snapshot.data(options)!;
        return {
            id: snapshot.id,
            participants: data.participants,
            dateCreatedAt: data.dateCreatedAt.toDate(),
            dateUpdatedAt: data.dateUpdatedAt.toDate(),
            users: JSON.parse(data.users),
            lastMessage: data.lastMessage === undefined ? "" : data.lastMessage
        };
    }
}

export const MessageContentConverter = {
    toFirestore(msg: IMessageContent): firebase.firestore.DocumentData {
        const {userId, message, dateCreatedAt } = msg;
        return { userId, message, dateCreatedAt: firebase.firestore.Timestamp.fromDate(msg.dateCreatedAt) }
    },
    fromFirestore(snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions): IMessageContent {
        const data = snapshot.data(options)!;
        const {userId, message, dateCreatedAt} = data;
        let response = {id: snapshot.id, userId, message, dateCreatedAt:data.dateCreatedAt.toDate()};
        return response;
    }
}