/**
 * DriverCard.tsx
 * ---------------------------------
 * Carte affichant les informations du chauffeur
 * (section "Chauffeur" de l'écran Carrières).
 *
 * UI alignée avec la maquette :
 * - Avatar rond à gauche
 * - Nom en gras
 * - Icône téléphone + numéro en dessous
 */

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface DriverCardProps {
    driverName: string;
    driverPhone: string;
}

export default function DriverCard({ driverName, driverPhone }: DriverCardProps) {
    return (
        <View style={styles.container}>
            {/* Avatar cercle avec emoji (placeholder) */}
            <View style={styles.avatarContainer}>
                <Text style={styles.avatarEmoji}>👷‍♂️</Text>
            </View>

            {/* Infos texte */}
            <View style={styles.infoContainer}>
                <Text style={styles.nameText}>{driverName}</Text>
                <View style={styles.phoneRow}>
                    <Text style={styles.phoneIcon}>📞</Text>
                    <Text style={styles.phoneText}>{driverPhone}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        width: 56,
        height: 56,
        borderRadius: 28,
        backgroundColor: '#F5F5F5',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    avatarEmoji: {
        fontSize: 28,
    },
    infoContainer: {
        flex: 1,
    },
    nameText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    phoneRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    phoneIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    phoneText: {
        fontSize: 14,
        color: '#000000',
        fontWeight: '500',
    },
});


