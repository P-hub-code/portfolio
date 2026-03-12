/**
 * TricycleHeader.tsx
 * ---------------------------------
 * Header de l'écran Tricycles
 * 
 * RESPONSABILITÉS :
 * - Afficher le bouton retour (navigation)
 * - Afficher le titre "Tricycles"
 * - Afficher l'icône notification/profil
 * 
 * RÔLE MÉTIER :
 * - Navigation + contexte utilisateur
 * - Pas de logique métier complexe ici
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface TricycleHeaderProps {
    /**
     * Callback pour le bouton retour
     * TODO: Utiliser React Navigation pour la navigation réelle
     */
    onBackPress?: () => void;
    /**
     * Callback pour l'icône notification
     * TODO: Navigation vers écran notifications
     */
    onNotificationPress?: () => void;
}

export default function TricycleHeader({ 
    onBackPress, 
    onNotificationPress 
}: TricycleHeaderProps) {
    return (
        <View style={styles.container}>
            {/* Bouton retour */}
            <TouchableOpacity
                style={styles.backButton}
                activeOpacity={0.7}
                onPress={onBackPress || (() => console.log('Retour'))}
            >
                <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>

            {/* Titre */}
            <Text style={styles.title}>Tricycles</Text>

            {/* Icône notification */}
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
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
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
        fontWeight: '700',
        color: '#000000',
        flex: 1,
        textAlign: 'center',
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































