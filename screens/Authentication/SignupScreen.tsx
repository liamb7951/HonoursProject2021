import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

import FormInput from '../../components/FormInput';
import FormButton from '../../components/FormButton';
import FormCheckbox from '../../components/FormCheckbox';

import { StackNavigationProp } from '@react-navigation/stack';
import { ScrollView } from 'react-native-gesture-handler';

import SvgLogo from '../../components/assets/SvgLogo';
import { StringIsEmptyOrWhitespaced } from '../../application/UtilityFunctions';
import Authentication from '../../application/Authentication';

interface Props {
	navigation: StackNavigationProp<any, "Authentication">
}

interface State {
	displayName: string;
	email: string;
	password: string;
	confirmPassword: string;
	agreeToTerms: boolean;
}

export default class SignupScreen extends React.Component<Props, State> {
	state: State = { displayName: "", email: "", password: "", confirmPassword: "", agreeToTerms: false };

	constructor(props: any) {
		super(props);

		this.registerForm = this.registerForm.bind(this);
	}

	async registerForm(displayName: string, email: string, password: string, confirmPassword: string, agreeToTerms: boolean) {
		console.log("registerForm: ", { displayName, email, matching: password === confirmPassword, agreeToTerms });
		if (StringIsEmptyOrWhitespaced(displayName)
			|| StringIsEmptyOrWhitespaced(email)
			|| StringIsEmptyOrWhitespaced(password)
			|| StringIsEmptyOrWhitespaced(confirmPassword)) {
			alert("One or more fields don't have information in them.\n\nPlease ensure you have typed both before continuing");
			return;
		}

		if (agreeToTerms === false) {
			alert("You have to agree to our terms before using this service.");
			return;
		}

		if (password !== confirmPassword) {
			alert("Password's do not match");
			return;
		}

		try {
			const registerForm = { DisplayName: displayName, Email: email, Password: password };
			const resp = await Authentication.Register(registerForm);

			// logged in
			console.log("Registered: ", resp);
			alert("Registered successfully!");
		} catch (arrErrors) {
			if (Array.isArray(arrErrors)) {
				for (let idx = 0; idx < arrErrors.length; idx++) {
					const error = arrErrors[idx];
					alert(error);
				}
			} else {
				// Handle Errors here.
				var error = arrErrors;
				var errorCode = error.code;
				var errorMessage = error.message;
				alert(errorMessage);
				console.log(JSON.stringify(error));
			}
		}
	}


	render() {
		let { displayName, email, password, confirmPassword, agreeToTerms } = this.state;

		return (
			<View style={styles.viewContainer}>
				<ScrollView contentContainerStyle={styles.container}>
					<View style={{ paddingTop: 30, justifyContent: 'center', alignItems: 'center' }}>
						<SvgLogo style={{ width: 200, height: 150, justifyContent: 'center', alignItems: 'center' }} />
					</View>

					<Text style={styles.text}>Register</Text>

					<FormInput
						labelValue={displayName}
						onChangeText={(v: string) => this.setState({ displayName: v })}
						placeholderText="Display Name"
						iconType="user"
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<FormInput
						labelValue={email}
						onChangeText={(v: string) => this.setState({ email: v })}
						placeholderText="Email"
						iconType="mail"
						keyboardType="email-address"
						autoCapitalize="none"
						autoCorrect={false}
					/>

					<FormInput
						labelValue={password}
						onChangeText={(v: string) => this.setState({ password: v })}
						placeholderText="Password"
						iconType="lock1"
						secureTextEntry={true}
					/>

					<FormInput
						labelValue={confirmPassword}
						onChangeText={(v: string) => this.setState({ confirmPassword: v })}
						placeholderText="Confirm Password"
						iconType="lock1"
						secureTextEntry={true}
					/>

				
					<FormCheckbox
						style={{ marginLeft: 10 }}
						isChecked={agreeToTerms}
						text="I agree to the Terms &amp; Conditions"
						labelValue=""
						onPress={(v: boolean) => {
							console.log("AgreeToTerms: " + v);
							this.setState({ agreeToTerms: v })
						}}
						iconType="warning"
						hideIcon={true}
					/>


					<FormButton
						buttonTitle="Register"
						onPress={() => this.registerForm(displayName as string, email as string, password as string, confirmPassword as string, agreeToTerms as boolean)}
					/>

					<TouchableOpacity
						style={styles.loginButton}
						onPress={
							() => this.props.navigation.navigate('Authentication', { screen: 'LoginScreen' })
						}>
						<Text style={styles.navButtonText}>
							Already have an account? Login here.
            			</Text>
					</TouchableOpacity>
				</ScrollView>
			</View>
		)
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
	loginButton: {
		marginVertical: 15,
	},
	navButtonText: {
		fontSize: 18,
		fontWeight: '500',
		color: '#2e64e5',
	},
});

/*
<FormCheckbox
	style={{ marginLeft: 10 }}
	value={agreeToTerms}
	labelValue="I agree to the terms and service"
	onValueChange={(v: boolean) => this.setState({ agreeToTerms: v })}
	iconType="warning"
	/>*/