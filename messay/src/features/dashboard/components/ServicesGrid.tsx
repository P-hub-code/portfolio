/**
 * ServicesGrid.tsx
 * ---------------------------------
 * Grille des services disponibles sur l’écran d’accueil.
 *
 * Services :
 * - Tricycles
 * - Carrières
 * - Tickets
 * - Courses
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TricycleIcon = require('../../../assets/services/tricycle.png');
const CareersIcon = require('../../../assets/services/carrière.png');
const TicketsIcon = require('../../../assets/services/ticket.png');
const ShoppingIcon = require('../../../assets/services/courses.png');

interface ServiceItem {
    id: string;
    title: string;
    icon: any;
    targetTab?: string;
}

const SERVICES: ServiceItem[] = [
    {
        id: 'tricycles',
        title: 'Tricycles',
        icon: TricycleIcon,
        targetTab: 'Tricycles',
    },
    {
        id: 'careers',
        title: 'Carrières',
        icon: CareersIcon,
        targetTab: 'Carrières',
    },
    {
        id: 'tickets',
        title: 'Tickets',
        icon: TicketsIcon,
    },
    {
        id: 'shopping',
        title: 'Courses',
        icon: ShoppingIcon,
    },
];

export default function ServicesGrid() {
    const navigation = useNavigation();

    const handlePress = (service: ServiceItem) => {
        // Connexion vers les onglets de la Tab Bar désactivée (demande utilisateur).
        // Pour l’instant on ne fait qu’un log, sans navigation automatique.
        console.log(`Service "${service.title}" cliqué (navigation désactivée)`);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Vos services</Text>

            <View style={styles.grid}>
                {SERVICES.map((service) => (
                    <TouchableOpacity
                        key={service.id}
                        style={styles.card}
                        activeOpacity={0.7}
                        onPress={() => handlePress(service)}
                    >
                        <View style={styles.iconContainer}>
                            <Image
                                source={service.icon}
                                style={styles.icon}
                                resizeMode="contain"
                            />
                        </View>
                        <Text style={styles.cardTitle}>{service.title}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginHorizontal: 20,
        marginTop: 24,
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    card: {
        width: '48%',
        height: 120, // Hauteur fixe pour uniformiser toutes les cartes
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 12,
        marginBottom: 12,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 3,
        elevation: 2,
    },
    iconContainer: {
        width: 60,
        height: 60,
        marginBottom: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        width: 60,
        height: 60,
    },
    cardTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
});

