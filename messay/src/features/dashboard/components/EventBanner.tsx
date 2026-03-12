/**
 * EventBanner.tsx
 * ---------------------------------
 * Bannière d’événement spécial sur l’écran d’accueil.
 *
 * Affiche une image promotionnelle et un CTA "Voir plus".
 */

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

const EventImage = require('../../../assets/services/events.png');

export default function EventBanner() {
    const handlePress = () => {
        console.log('Voir plus - Événement spécial');
    };

    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Text style={styles.title}>Concert Live Ce Soir !</Text>
                <Text style={styles.subtitle}>Réservez votre place dès maintenant avec Messay.</Text>

                <TouchableOpacity
                    style={styles.ctaButton}
                    activeOpacity={0.7}
                    onPress={handlePress}
                >
                    <Text style={styles.ctaText}>Voir plus</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.imageContainer}>
                <Image
                    source={EventImage}
                    style={styles.image}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        backgroundColor: '#1E1B4B',
        borderRadius: 16,
        marginBottom: 24,
        padding: 16,
        alignItems: 'flex-start',
    },
    content: {
        flex: 1,
        marginRight: 10,
        alignItems: 'flex-start',
    },
    title: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    subtitle: {
        fontSize: 13,
        color: '#E5E5E5',
        marginBottom: 10,
    },
    ctaButton: {
        backgroundColor: '#FF6B35',
        paddingVertical: 8,
        paddingHorizontal: 16,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    ctaText: {
        color: '#FFFFFF',
        fontSize: 13,
        fontWeight: '600',
    },
    imageContainer: {
        width: 80,
        height: 80,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: 80,
        height: 80,
    },
});

