/**
 * careersStack.tsx
 * ---------------------------------
 * Stack Navigator pour les écrans Carrières
 * 
 * Gère la navigation entre :
 * - Delivery (écran principal)
 * - OrderScreen (écran de commande)
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Delivery from '../features/mobility/Delivery';
import OrderScreen from '../features/mobility/components/OrderScreen';

const Stack = createStackNavigator();

export default function CareersStack() {
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false, // On utilise nos propres headers
            }}
        >
            <Stack.Screen name="Delivery" component={Delivery} />
            <Stack.Screen name="OrderScreen" component={OrderScreen} />
        </Stack.Navigator>
    );
}


































