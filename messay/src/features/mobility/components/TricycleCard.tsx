/**
 * TricycleCard.tsx
 * ---------------------------------
 * Carte individuelle d'un tricycle disponible
 * 
 * RESPONSABILITÉS :
 * - Afficher les informations d'un tricycle :
 *   - Nom du chauffeur
 *   - Point de départ
 *   - Destination
 *   - Distance
 *   - Temps estimé
 *   - Prix
 * 
 * RÔLE MÉTIER :
 * - C'est le VRAI cœur métier
 * - C'est EXACTEMENT ce que le backend devra fournir plus tard
 * - Données mockées pour l'instant, remplacées par API plus tard
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

/**
 * Type pour les données d'un tricycle
 * Ce type définit le contrat avec le backend
 */
export interface TricycleData {
    id: string;
    driverName: string;
    departure: string;
    destination: string;
    estimatedTime: string; // Format: "15 min"
    distance: string; // Format: "5 km"
    price: number; // Prix en francs CFA
    priceRange?: string; // Format: "f ±50" (optionnel)
    note?: string; // Ex: "École ou làm"
    image?: any; // Image du tricycle (optionnel)
}

interface TricycleCardProps {
    /**
     * Données du tricycle à afficher
     */
    tricycle: TricycleData;
    /**
     * Callback quand on clique sur la carte
     * TODO: Navigation vers détails ou réservation
     */
    onPress?: (tricycle: TricycleData) => void;
}

export default function TricycleCard({ tricycle, onPress }: TricycleCardProps) {
    return (
        <TouchableOpacity
            style={styles.container}
            activeOpacity={0.7}
            onPress={() => onPress?.(tricycle)}
        >
            {/* Image du tricycle */}
            <View style={styles.imageContainer}>
                {tricycle.image ? (
                    <Image
                        source={tricycle.image}
                        style={styles.image}
                        resizeMode="contain"
                    />
                ) : (
                    <Text style={styles.imagePlaceholder}>🚲</Text>
                )}
            </View>

            {/* Informations du tricycle */}
            <View style={styles.contentContainer}>
                {/* Nom du chauffeur */}
                <Text style={styles.driverName}>{tricycle.driverName}</Text>

                {/* Trajet */}
                <Text style={styles.route}>
                    {tricycle.departure} - {tricycle.destination}
                </Text>

                {/* Temps et distance */}
                <View style={styles.timeDistanceContainer}>
                    <Text style={styles.timeDistance}>
                        ⏱️ {tricycle.estimatedTime} - {tricycle.distance}
                    </Text>
                </View>

                {/* Prix */}
                <View style={styles.priceContainer}>
                    {tricycle.priceRange && (
                        <Text style={styles.priceRange}>{tricycle.priceRange}</Text>
                    )}
                    <Text style={styles.price}>{tricycle.price.toLocaleString()}F</Text>
                </View>

                {/* Note optionnelle */}
                {tricycle.note && (
                    <View style={styles.noteContainer}>
                        <Text style={styles.noteIcon}>🚚</Text>
                        <Text style={styles.note}>{tricycle.note}</Text>
                    </View>
                )}
            </View>

            {/* Bouton de prix (optionnel, selon le design) */}
            <View style={styles.priceButtonContainer}>
                <TouchableOpacity style={styles.priceButton} activeOpacity={0.7}>
                    <Text style={styles.priceButtonText}>
                        {tricycle.price.toLocaleString()}F
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginHorizontal: 20,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    imageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    image: {
        width: 80,
        height: 80,
    },
    imagePlaceholder: {
        fontSize: 48,
    },
    contentContainer: {
        flex: 1,
    },
    driverName: {
        fontSize: 16,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 5,
    },
    route: {
        fontSize: 14,
        color: '#000000',
        marginBottom: 8,
    },
    timeDistanceContainer: {
        marginBottom: 8,
    },
    timeDistance: {
        fontSize: 13,
        color: '#8E8E93',
    },
    priceContainer: {
        marginBottom: 8,
    },
    priceRange: {
        fontSize: 12,
        color: '#8E8E93',
        marginBottom: 2,
    },
    price: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
    },
    noteContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 5,
    },
    noteIcon: {
        fontSize: 14,
        marginRight: 5,
    },
    note: {
        fontSize: 12,
        color: '#8E8E93',
    },
    priceButtonContainer: {
        justifyContent: 'center',
        marginLeft: 10,
    },
    priceButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 8,
        paddingHorizontal: 15,
        borderRadius: 8,
    },
    priceButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});

