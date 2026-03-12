/**
 * routes.ts
 * ---------------------------------
 * Routeur principal de l’application.
 *
 * Pattern « lazy authentication » :
 * - L'utilisateur voit toujours l'onglet principal (MainTabNavigator)
 * - Quand une action sensible demande une authentification,
 *   on ouvre le stack Auth en modal (AuthStack).
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabNavigator from './tabs/MainTabNavigator';
import AuthStack from './stacks/AuthStack';
import ProfileScreen from '../features/profile/ProfileScreen';

type RootStackParamList = {
    Main: undefined;
    Auth: undefined;
    Profile: undefined;
};

const RootStack = createStackNavigator<RootStackParamList>();

export default function RootNavigator() {
    return (
        <RootStack.Navigator
            initialRouteName="Main"
            screenOptions={{
                headerShown: false,
            }}
        >
            <RootStack.Screen name="Main" component={MainTabNavigator} />
            <RootStack.Screen
                name="Auth"
                component={AuthStack}
                options={{
                    presentation: 'modal',
                }}
            />
            <RootStack.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerShown: false,
                }}
            />
        </RootStack.Navigator>
    );
}
