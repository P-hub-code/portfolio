/**
 * CompanyCard.tsx
 * ---------------------------------
 * Carte affichant les informations de la société partenaire
 * 
 * Affiche :
 * - Icône société (orange)
 * - Nom de la société
 * - Statut "Agréé Carrière d'État" (vert)
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface CompanyCardProps {
    companyName: string;
    status: string;
}

// Icône société partenaire (image Entreprise)
// Chemin : ce fichier est dans src/features/mobility/components
// On remonte 3 niveaux pour arriver à src puis on va dans assets/carrières
// ../../../ -> components -> mobility -> features -> src
const CompanyIcon = require('../../../assets/carrières/Entreprise.png');

export default function CompanyCard({ companyName, status }: CompanyCardProps) {
    return (
        <View style={styles.container}>
            {/* Icône société */}
            <View style={styles.iconContainer}>
                {/* Remplacement de l'emoji par une vraie image */}
                <Image source={CompanyIcon} style={styles.iconImage} resizeMode="contain" />
            </View>
            
            {/* Informations société */}
            <View style={styles.contentContainer}>
                <Text style={styles.label}>SOCIÉTÉ PARTENAIRE</Text>
                <Text style={styles.companyName}>{companyName}</Text>
                <View style={styles.statusContainer}>
                    <View style={styles.statusDot} />
                    <Text style={styles.statusText}>{status}</Text>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    iconContainer: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: '#FF6B35', // Orange de la marque
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    icon: {
        fontSize: 32,
    },
    // Style de l'image Entreprise (diamètre proche du cercle orange)
    iconImage: {
        width: 40,
        height: 40,
    },
    contentContainer: {
        flex: 1,
    },
    label: {
        fontSize: 12,
        fontWeight: '600',
        color: '#666666',
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    companyName: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 8,
    },
    statusContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    statusDot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#4CAF50', // Vert (couleur Carrières)
        marginRight: 6,
    },
    statusText: {
        fontSize: 14,
        color: '#4CAF50',
        fontWeight: '500',
    },
});


