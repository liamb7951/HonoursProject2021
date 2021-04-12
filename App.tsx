import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import useCachedResources from './hooks/useCachedResources';
import useColorScheme from './hooks/useColorScheme';

import Navigation from './navigation';

import './application/Firebase';
import _ from 'lodash';

import * as firebase from 'firebase';
import 'firebase/firestore';

export default function App() {
	const isLoadingComplete = useCachedResources();
	const colorScheme = useColorScheme();

	// If the applications is loading hide it.
	if (!isLoadingComplete) {
		return null;
	} else {
		// If loaded show the navigation and status bar
		return (
			<SafeAreaProvider>
				<Navigation colorScheme={colorScheme} />
				<StatusBar />
			</SafeAreaProvider>
		);
	}
}