import * as React from 'react';
import { useState, useEffect } from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { FlatList, LogBox, StyleSheet, View } from 'react-native';
import { margin } from '../../application/StyleHelpers';

import { AdvertListItem } from './AdvertListItem'
import { IAdvert, AdvertsConverter } from '../../application/API/Adverts';

import AntDesign from 'react-native-vector-icons/Entypo';
import DesignColors from '../../constants/Colors';
import { TouchableHighlight } from 'react-native-gesture-handler';

import { db } from '../../application/Firebase';
import { Loading } from '../../components/LoadingComponent';


export default function AdvertsScreen({
    navigation,
}: StackScreenProps<any, any>) {
    LogBox.ignoreLogs([ 'Setting a timer' ]);
    const [loading, setLoading] = useState<boolean>(true);
    const [messages, setMessages] = useState<IAdvert[]>([]);

    // Load information from react and dynamically update it.
    const handleFirestoreDb = () => {
        const collection = db.collection('adverts')
            .withConverter(AdvertsConverter)
            .orderBy('date', 'desc');
        
        let unsubscribeSnapshot = collection.onSnapshot( (snapshot) => {
            const messages: IAdvert[] = snapshot.docs.map((doc) => ({ ...doc.data() }) as IAdvert);

            setMessages(messages);
            setLoading(false);
        });

        // Cleanup method
        return () => {
            unsubscribeSnapshot();
        };
    }

    useEffect(() => handleFirestoreDb(), [])

    
    const btnAddNew_Clicked = () => {
        // Navigate to Root->TabAdverts->AdvertsNewScreen
        navigation?.push('Root', {
            screen: 'TabAdverts',
            params: {
                screen: 'AdvertsNewScreen'
            }
        });
    };

    // Add a button to the navigation top right section
    React.useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableHighlight style={styles.headerButton} onPress={btnAddNew_Clicked} activeOpacity={0.8} underlayColor="#DDDDDD">
                    <AntDesign name="plus" size={25} color={DesignColors.light.tint} />
                </TouchableHighlight>
            ),
        });
    }, [navigation] );

    if (loading) 
        return <Loading message="Loading adverts..." />

    return (
        <View style={styles.container}>
            <FlatList
                data={messages}
                keyExtractor={ (item) => item.id }
                renderItem={ ({item}) => 
                    <AdvertListItem style={styles.item} advert={item} navigation={navigation as any} /> 
                }
            />
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 22,
        backgroundColor: '#fff'
    },

    item: {
        ...margin(0, 10, 10, 10),
        fontSize: 18,
    },

    headerButton: {
        padding: 15
    }
});



