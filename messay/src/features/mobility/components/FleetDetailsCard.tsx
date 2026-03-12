/**
 * FleetDetailsCard.tsx
 * ---------------------------------
 * Carte affichant les détails de la flotte de camions
 * 
 * Affiche :
 * - Nombre de camions
 * - Couleur
 * - Marque
 * - Immatriculation
 * 
 * Style : Fond bleu foncé avec texte blanc
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

interface FleetDetailsCardProps {
    numberOfTrucks: number;
    color: string;
    brand: string;
    registration: string;
}

// Icône camion pour la flotte
// Fichier actuel : src/features/mobility/components/FleetDetailsCard.tsx
// Chemin image : src/assets/carrières/Camion.png -> ../../../assets/carrières/Camion.png
const TruckIcon = require('../../../assets/carrières/Camion.png');

export default function FleetDetailsCard({
    numberOfTrucks,
    color,
    brand,
    registration,
}: FleetDetailsCardProps) {
    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                {/* Remplacement de l'emoji camion par une image dédiée */}
                <Image source={TruckIcon} style={styles.truckImage} resizeMode="contain" />
                <Text style={styles.title}>DÉTAILS DE LA FLOTTE</Text>
            </View>
            
            <View style={styles.contentRow}>
                {/* Colonne gauche */}
                <View style={styles.column}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>NOMBRE DE CAMIONS</Text>
                        <Text style={styles.value}>{numberOfTrucks} Véhicules</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>COULEUR</Text>
                        <Text style={styles.value}>{color}</Text>
                    </View>
                </View>
                
                {/* Colonne droite */}
                <View style={styles.column}>
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>MARQUE</Text>
                        <Text style={styles.value}>{brand}</Text>
                    </View>
                    
                    <View style={styles.infoItem}>
                        <Text style={styles.label}>IMMATRICULATION</Text>
                        <Text style={styles.value}>{registration}</Text>
                    </View>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#1E3A5F', // Bleu foncé (comme dans l'image)
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    truckIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    // Image camion alignée avec le titre
    truckImage: {
        width: 24,
        height: 24,
        marginRight: 8,
    },
    title: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
        textTransform: 'uppercase',
    },
    contentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    column: {
        flex: 1,
    },
    infoItem: {
        marginBottom: 20,
    },
    label: {
        fontSize: 11,
        fontWeight: '500',
        color: '#FFFFFF',
        opacity: 0.8,
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    value: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

