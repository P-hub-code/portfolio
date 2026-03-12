/**
 * AuthStack.tsx
 * ---------------------------------
 * Stack Navigator pour le flux d'authentification :
 * - PhoneInputScreen  : saisie du numéro
 * - OTPVerification   : saisie du code à 6 chiffres
 * - NameInputScreen   : saisie du nom complet
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import PhoneInputScreen from '../../features/auth/screens/PhoneInputScreen';
import OTPVerificationScreen from '../../features/auth/screens/OTPVerificationScreen';
import NameInputScreen from '../../features/auth/screens/NameInputScreen';

export type AuthStackParamList = {
    PhoneInput: undefined;
    OTPVerification: { phoneNumber?: string } | undefined;
    NameInput: { phoneNumber?: string; token?: string } | undefined;
};

const Stack = createStackNavigator<AuthStackParamList>();

export default function AuthStack() {
    return (
        <Stack.Navigator
            initialRouteName="PhoneInput"
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="PhoneInput" component={PhoneInputScreen} />
            <Stack.Screen name="OTPVerification" component={OTPVerificationScreen} />
            <Stack.Screen name="NameInput" component={NameInputScreen} />
        </Stack.Navigator>
    );
}


