import React, * as react from 'react';
import { StyleProp, Text } from 'react-native';

import * as Sugar from 'sugar';

// <HumanSince date={this.SomeDate} updateInterval={600} style={styles.date} />
interface Props {
    date: Date;
    updateInterval?: number;
    style?: StyleProp<any>;
}

interface State {
    // Text to display
    timeSince: string;
}

export default class HumanSince extends React.Component<Props, State> {
    updateInterval: number = 0;
    timerUpdate: NodeJS.Timeout;

    constructor(props: any) {
        super(props);

        // Set the default update interval, if its null then default to 600 ms.
        this.updateInterval = this.props.updateInterval ?? 600;
        this.state = { timeSince:"..." };

        this.updateLabel = this.updateLabel.bind(this);
    } 

    // When the UI is being shown on the screen
    componentDidMount() {
        // Run this function every X ms
        this.timerUpdate = setInterval(this.updateLabel, this.updateInterval);
    }

    // When the UI is being hidden, changing page or removing object
    componentWillUnmount() {
        // Remove the interval function so it does not update the UI
        if (this.timerUpdate !== null)
            clearInterval(this.timerUpdate);
    }

    updateLabel() {
        // If the date is invalid then display 3 dots (...)
        if (this.props.date === undefined || this.props.date === null) {
            this.setState({ timeSince: "..." });
        } 
        // If the date is not invalid then calculate the relative time from the current time
        else {
            this.setState({ timeSince: Sugar.Date.relative(this.props.date) });
        }
    }

    render() {
        return <Text style={this.props.style}>{this.state.timeSince}</Text>;
    }
}