/**
 * DashboardHeader.tsx
 * ---------------------------------
 * Barre supérieure du Dashboard
 * 
 * Affiche :
 * - Message de bienvenue personnalisé avec prénom
 * - Icône de notification
 * 
 * Rôle métier :
 * - Confirmer la connexion de l'utilisateur
 * - Humaniser l'application
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

/**
 * Import Redux
 * 
 * useAppSelector : Hook typé pour lire le state Redux
 * Permet d'accéder aux données utilisateur depuis le store global
 */
// import { useAppSelector } from '../../../store/hooks';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';

export default function DashboardHeader() {
    /**
     * Lecture du prénom utilisateur depuis Redux
     * 
     * useAppSelector : Hook typé qui lit le state Redux
     * state.user.currentUser?.firstName : Accès au prénom dans le store
     * 
     * AVANT (données mockées) :
     * const firstName = MOCK_USER.firstName;
     * 
     * MAINTENANT (Redux) :
     * Le prénom vient directement du store Redux, synchronisé avec le backend
     * 
     * Note : Si currentUser est null (utilisateur non connecté), on affiche "Utilisateur"
     */
    const firstName = useAppSelector(
        (state) => state.user.currentUser?.firstName || 'Utilisateur'
    );

    return (
        <View style={styles.container}>
            {/* Message de bienvenue */}
            <View style={styles.greetingContainer}>
                <Text style={styles.greetingText}>
                    Bonjour, {firstName} 👋
                </Text>
            </View>

            {/* Icône notification */}
            <TouchableOpacity
                style={styles.notificationButton}
                activeOpacity={0.7}
                onPress={() => {
                    // TODO: Navigation vers écran notifications
                    console.log('Notifications');
                }}
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
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
    },
    greetingContainer: {
        flex: 1,
    },
    greetingText: {
        fontSize: 24,
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






