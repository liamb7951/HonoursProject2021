import * as React from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { StyleProp, StyleSheet, Text, View } from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import { IAdvert } from '../../application/API/Adverts';
import { IUserBasic } from '../../application/API/Users';
import { padding } from '../../application/StyleHelpers';
import HumanSince from '../../components/HumanSince';

interface Props {
    navigation?: StackNavigationProp<any, any>
    advert: IAdvert,

    style?: StyleProp<any>,
};

export class AdvertListItem extends React.Component<Props,any> {
    constructor(props: any) {
        super(props);
        this.advertSelected = this.advertSelected.bind(this);
    }

    advertSelected(): void {
        var { navigation, advert } = this.props;
        
        // Navigate to the user message page
        const params: IUserBasic = {
            displayName: advert.userDisplayName,
            userId: advert.userId
        };

        navigation?.navigate('Root', {
            screen: 'TabMessages',
            params: {
                screen: 'MessagesViewScreen',
                params: { user: params }
            }
        });
    }

    render() {
        // Merge any styles passed into the item with the container styles
        let rootStyles = { ...styles.container, ...this.props.style };
        
        return (
            <View style={rootStyles}>
                <View style={styles.borderBox}>
                    <TouchableHighlight onPress={this.advertSelected} activeOpacity={0.8} underlayColor="#DDDDDD">
                        <View>
                            <Text style={styles.message}> {this.props.advert.message} </Text>
                            <View style={styles.detailsContainer}>
                                <Text style={styles.detailsAuthor}> {this.props.advert.userDisplayName} </Text>
                                <Text style={styles.detailsDate}><HumanSince date={this.props.advert.date} /> &gt;</Text>
                            </View>
                        </View>
                    </TouchableHighlight>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: { 
    },

    borderBox: {
        backgroundColor: '#F6F6F6',
        borderRadius: 8,
    },

    message: {
        ...padding(20,20,5,20)
    },

    detailsContainer: {
        flexDirection: 'row',
        flex: 1,
        ...padding(5, 10,10,10)
    },

    detailsAuthor: {
        fontWeight: 'bold',
        flexGrow: 1
    },

    detailsDate: {
        minWidth: 80,
    },

    seperator: {
        backgroundColor: '#fff',
        width: '80%',
        height: 3
    }
});

