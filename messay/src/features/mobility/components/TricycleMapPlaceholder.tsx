/**
 * TricycleMapPlaceholder.tsx
 * ---------------------------------
 * Carte visuelle (image statique) pour l'écran Tricycles
 * 
 * RESPONSABILITÉS :
 * - Afficher une représentation visuelle de la carte d'Abidjan
 * - Afficher les marqueurs (position utilisateur, tricycles) - VISUEL
 * - Afficher le trajet estimé - VISUEL
 * 
 * RÔLE MÉTIER :
 * - VISUEL UNIQUEMENT (image statique)
 * - Backend = PAS nécessaire maintenant
 * - La carte n'est PAS le cœur métier, c'est une vue
 * 
 * ÉLÉMENTS BACKEND FUTURS (quand on intégrera react-native-maps) :
 * 
 * 1. POSITION UTILISATEUR :
 *    - Backend devra fournir : { latitude: number, longitude: number }
 *    - Exemple : { latitude: 5.3600, longitude: -4.0083 } (Abidjan)
 * 
 * 2. MARQUEURS TRICYCLES :
 *    - Backend devra fournir : Array<{ id: string, latitude: number, longitude: number, driverName: string }>
 *    - Exemple : [
 *        { id: '1', latitude: 5.3610, longitude: -4.0090, driverName: 'Kouamé Yves' },
 *        { id: '2', latitude: 5.3620, longitude: -4.0100, driverName: 'Aka Kouassi' }
 *      ]
 * 
 * 3. TRAJET ESTIMÉ (Polyline) :
 *    - Backend devra fournir : Array<{ latitude: number, longitude: number }>
 *    - Exemple : [
 *        { latitude: 5.3600, longitude: -4.0083 }, // Départ
 *        { latitude: 5.3610, longitude: -4.0090 }, // Point intermédiaire
 *        { latitude: 5.3620, longitude: -4.0100 }  // Arrivée
 *      ]
 * 
 * 4. RÉGION DE LA CARTE (Region) :
 *    - Backend devra fournir : { latitude: number, longitude: number, latitudeDelta: number, longitudeDelta: number }
 *    - Exemple : { latitude: 5.3600, longitude: -4.0083, latitudeDelta: 0.1, longitudeDelta: 0.1 }
 * 
 * NOTE :
 * Pour l'instant, c'est une image statique (abidjan-map.png).
 * Plus tard, on remplacera par react-native-maps avec les données backend ci-dessus.
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

/**
 * Import de l'image de la carte d'Abidjan
 * CHEMIN : src/assets/images/abidjan-map.png (ou .jpg)
 */
const AbidjanMapImage = require('../../../assets/images/abidjan-map.png');

interface TricycleMapPlaceholderProps {
    /**
     * Hauteur de la carte (optionnel)
     */
    height?: number;
}

export default function TricycleMapPlaceholder({ height = 250 }: TricycleMapPlaceholderProps) {
    return (
        <View style={[styles.container, { height }]}>
            {/* Image de la carte d'Abidjan */}
            <Image
                source={AbidjanMapImage}
                style={styles.mapImage}
                resizeMode="cover"
            />

            {/* Légende des marqueurs (superposée sur l'image) */}
            <View style={styles.legend}>
                <View style={styles.legendItem}>
                    <View style={[styles.marker, styles.userMarker]} />
                    <Text style={styles.legendText}>Votre position</Text>
                </View>
                <View style={styles.legendItem}>
                    <View style={[styles.marker, styles.tricycleMarker]} />
                    <Text style={styles.legendText}>Tricycles disponibles</Text>
                </View>
            </View>

            {/* 
                TODO BACKEND - MARQUEURS À AJOUTER ICI :
                Quand on intégrera react-native-maps, on ajoutera :
                
                1. Marqueur position utilisateur :
                   <Marker coordinate={userPosition} pinColor="blue" />
                
                2. Marqueurs tricycles (boucle sur les données backend) :
                   {tricycles.map(tricycle => (
                     <Marker 
                       key={tricycle.id}
                       coordinate={{ latitude: tricycle.latitude, longitude: tricycle.longitude }}
                       pinColor="orange"
                     />
                   ))}
                
                3. Polyline pour le trajet :
                   <Polyline 
                     coordinates={routeCoordinates}
                     strokeColor="#FF6B35"
                     strokeWidth={3}
                   />
            */}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginVertical: 15,
        borderRadius: 12,
        overflow: 'hidden',
        position: 'relative',
    },
    mapImage: {
        width: '100%',
        height: '100%',
    },
    legend: {
        position: 'absolute',
        top: 10,
        left: 10,
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    legendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    marker: {
        width: 12,
        height: 12,
        borderRadius: 6,
        marginRight: 8,
    },
    userMarker: {
        backgroundColor: '#2196F3', // Bleu pour l'utilisateur
    },
    tricycleMarker: {
        backgroundColor: '#FF6B35', // Orange pour les tricycles
    },
    legendText: {
        fontSize: 12,
        color: '#000000',
    },
});

