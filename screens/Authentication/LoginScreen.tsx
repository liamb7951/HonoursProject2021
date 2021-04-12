import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { StringIsEmptyOrWhitespaced } from '../../application/UtilityFunctions';

import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import SvgLogo from '../../components/assets/SvgLogo';

import { StackNavigationProp } from '@react-navigation/stack';

import * as firebase from "firebase";
import Authentication from '../../application/Authentication';

// ------------------------------------------

interface Props {
	navigation: StackNavigationProp<any, "Authentication">
}

interface State {
	email: string;
	password: string;
}

export default class LoginScreen extends React.Component<Props, State> {
	firebaseAuthUnsubscribe: any = null;

	constructor(props: any) {
		super(props);
		this.state = { email: "", password: "" };

		this.onAuthStateChanged = this.onAuthStateChanged.bind(this);
	}

	componentDidMount() {
		console.log("Login screen mounted");
		this.firebaseAuthUnsubscribe = firebase.auth().onAuthStateChanged(this.onAuthStateChanged);
	}

	componentWillUnmount() {
		console.log("Unmounted LoginScreen ", this.firebaseAuthUnsubscribe !== null);
		if (this.firebaseAuthUnsubscribe !== null)
			this.firebaseAuthUnsubscribe();
	}

	onAuthStateChanged(user: firebase.User | null) {
		// Check if the user is null 
		if (user == null) {
			console.log("onAuthState Changed: Logged out");

			// Do nothing
			return;
		}

		// logged in
		console.log("Auto state changed: ", user.displayName, user.uid);
		Authentication.DisplayWelcomeNotification();

		// Navigate to the root and reset the back stack so the user
		// cannot press back to goto the Auth screen.
		this.props.navigation.reset({
			index: 0,
			routes: [{ name: 'Root' }],
		});
	}

	async formLogin(email: string, password: string) {
		console.log("Form login!");

		if (StringIsEmptyOrWhitespaced(email) || StringIsEmptyOrWhitespaced(password)) {
			alert("The email or password is not entered\nPlease ensure you have typed both before continuing");
			return;
		}

		try {
			const user = await Authentication.Login(email, password);
			//logged in
			console.log("formLogin: Logged in, ", user);
		} catch (error) {
			// Handle Errors here.
			var errorCode = error.code;
			var errorMessage = error.message;
			if (errorCode === 'auth/wrong-password') {
				alert('Wrong password.');
			} else {
				alert(errorMessage);
			}
			console.log(JSON.stringify(error));
		}
	};

	render() {
		let email = this.state.email;
		let password = this.state.password;

		return (
			<View style={styles.viewContainer}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={{ paddingTop: 30, justifyContent: 'center', alignItems: 'center' }}>
						<SvgLogo style={{ width: 200, height: 150, justifyContent: 'center', alignItems: 'center' }} />
					</View>

					<Text style={styles.text}>Login</Text>

					<FormInput
						labelValue={email}
						onChangeText={(v: string) => this.setState({ email: v })}
						placeholderText="Email"
						iconType="user"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<FormInput
						labelValue={password}
						onChangeText={(v: string) => this.setState({ password: v })}
						placeholderText="Password"
						iconType="lock"
						secureTextEntry={true}
					/>

					<FormButton
						buttonTitle="Sign In"
						onPress={() => this.formLogin(email as string, password as string)}
					/>

					<TouchableOpacity style={styles.textButton} onPress={() => alert("Not implemented")}>
						<Text style={styles.navButtonText}>Forgot Password?</Text>
					</TouchableOpacity>

					<TouchableOpacity
						style={styles.textButton}
						onPress={ () => this.props.navigation.navigate('Authentication', { screen: 'SignupScreen' }) }>
						<Text style={styles.navButtonText}>Don't have an account? Create here.</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		);
	}
}




const screenHeight = Dimensions.get('window').height
const styles = StyleSheet.create({
	viewContainer: {
		height: "auto",
		maxHeight: screenHeight,
		margin: 10
	},
	container: {
		flexGrow: 1,
		padding: 10,
		paddingTop: 5
	},
	logo: {
		height: 50,
		width: 50,
		resizeMode: 'cover',
	},
	text: {
		fontSize: 28,
		marginBottom: 10,
		color: '#051d5f',
	},
	navButton: {
		marginTop: 15,
	},
	textButton: {
		marginVertical: 15,
	},
	navButtonText: {
		fontSize: 18,
		fontWeight: '500',
		color: '#2e64e5',
	},
});