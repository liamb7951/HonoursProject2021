import * as React from 'react';
import { StyleSheet, Text, View, FlatList, ImageLoadEventDataAndroid,TouchableOpacity, ActivityIndicator } from 'react-native';

interface IProps {
    message: string,
    showEllipse: boolean
};

interface IState {
    ellipseText: string
}


// <Loading showEllipse=false>
export class Loading extends React.Component<IProps, IState> {
    public static defaultProps = { 
        showEllipse: true
    };

    ellipseCounter = 0; // Counter that holds the ellipse counter
    ellipseTextInterval: NodeJS.Timeout|null = null;

    constructor(props: any) {
        super(props);

        this.state = { ellipseText: "" }

        // Bind the functions so I dont loose the `this` instance reference.
        this.updateEllipseText = this.updateEllipseText.bind(this);
    }

    updateEllipseText() {
        // If the component is no longer mounted or dont show ellipse
        // then to stop updating...
        if (!this.props.showEllipse) {
            // Reset ellipse text
            this.setState( { ellipseText: "" } );
            return;
        }

        // Increment the counter (0 to 3)
        this.ellipseCounter = clamp(this.ellipseCounter + 1, 0, 4);
        if (this.ellipseCounter == 4) this.ellipseCounter = 0;
        
        // Generate the periods 
        let text = "";
        for (let counter = 0; counter < this.ellipseCounter; counter++) 
            text += ".";

        // Update the text
        this.setState( { ellipseText: text } );
    }

    componentDidMount() {
        this.ellipseTextInterval = setInterval(this.updateEllipseText, 600);
    }

    componentWillUnmount() {
        if (this.ellipseTextInterval !== null)
            clearInterval(this.ellipseTextInterval);
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>{this.props.message}</Text>
                <Text style={styles.title}>{this.state.ellipseText}</Text>

                <ActivityIndicator style={{marginTop: 50}} size="large" color="#0000ff" />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    }
});


// 1,10  25=10   -5 = 1  6 = 6
function clamp(num:number, min:number, max:number) {
    if (num < min)
        return min;
    else if (num > max) 
        return max;
    return num;
}