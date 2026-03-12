/**
 * CareersHeader.tsx
 * ---------------------------------
 * Header pour l'écran Carrières
 * 
 * Affiche :
 * - Bouton retour (←)
 * - Titre "Carrières"
 * - Icône de notification (🔔)
 * 
 * Utilise les mêmes styles que TricycleHeader pour la cohérence
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface CareersHeaderProps {
    onNotificationPress?: () => void;
}

export default function CareersHeader({ onNotificationPress }: CareersHeaderProps) {
    const navigation = useNavigation();

    /**
     * Gestion du bouton retour
     * Navigation vers l'écran précédent
     */
    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            console.log('Pas d\'écran précédent');
        }
    };

    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={handleBackPress}
            >
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
            
            <Text style={styles.title}>Carrières</Text>
            
            <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={onNotificationPress || (() => console.log('Notifications'))}
            >
                <Text style={styles.notificationIcon}>🔔</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#000000',
    },
    title: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 24,
    },
});



























