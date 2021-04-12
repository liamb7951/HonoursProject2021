import * as React from 'react';
import { StackScreenProps } from '@react-navigation/stack';
import { ProfileScreen } from './ProfileScreen';

interface Props extends StackScreenProps<any, any> {
    // 
}

interface State {
    // 
}

export class TabProfileScreen extends React.Component<Props, State> {

    constructor(props: Props) {
        super(props);
    }

    render() {
        return <ProfileScreen navigation={this.props.navigation} route={this.props.route} />
    }
}

