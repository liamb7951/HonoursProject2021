import {firebase} from '../Firebase';


export interface IAdvert {
    id: string,
    userId: string, 
    userDisplayName: string,
    message: String,
    date: Date
}


// Convert an object to firebase and back.
export const AdvertsConverter = {
    toFirestore(msg: IAdvert): firebase.firestore.DocumentData {
        let data: any = msg;
        try { delete data.id; } catch {}
        data.date = firebase.firestore.Timestamp.fromDate(msg.date);
        return data;
    },
    fromFirestore(
        snapshot: firebase.firestore.QueryDocumentSnapshot,
        options: firebase.firestore.SnapshotOptions
    ): IAdvert {
        const {userId, userDisplayName, message, date} = snapshot.data(options)!;
        let response = {id: snapshot.id, userId, userDisplayName, message, date: date.toDate()};
        return response;
    }
}