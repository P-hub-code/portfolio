/**
 * TricycleSearchBar.tsx
 * ---------------------------------
 * Barre de recherche et filtres pour les tricycles
 * 
 * RESPONSABILITÉS :
 * - Champ de recherche (lieu / destination)
 * - Bouton "Votre position"
 * - Bouton "Filtres"
 * 
 * RÔLE MÉTIER :
 * - Filtrage côté frontend (pour l'instant)
 * - Backend = optionnel au début
 * - Les filtres réels seront gérés par le backend plus tard
 */

import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

interface TricycleSearchBarProps {
    /**
     * Valeur du champ de recherche
     */
    searchValue?: string;
    /**
     * Callback quand la recherche change
     */
    onSearchChange?: (text: string) => void;
    /**
     * Callback pour "Votre position"
     * TODO: Intégrer la géolocalisation
     */
    onLocationPress?: () => void;
    /**
     * Callback pour "Filtres"
     * TODO: Ouvrir modal de filtres
     */
    onFiltersPress?: () => void;
}

export default function TricycleSearchBar({
    searchValue = '',
    onSearchChange,
    onLocationPress,
    onFiltersPress,
}: TricycleSearchBarProps) {
    return (
        <View style={styles.container}>
            {/* Champ de recherche */}
            <View style={styles.searchContainer}>
                <Text style={styles.searchIcon}>🔍</Text>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Recherche..."
                    placeholderTextColor="#8E8E93"
                    value={searchValue}
                    onChangeText={onSearchChange}
                />
            </View>

            {/* Boutons position et filtres */}
            <View style={styles.actionsContainer}>
                {/* Bouton "Votre position" */}
                <TouchableOpacity
                    style={styles.locationButton}
                    activeOpacity={0.7}
                    onPress={onLocationPress || (() => console.log('Votre position'))}
                >
                    <Text style={styles.locationIcon}>📍</Text>
                    <Text style={styles.locationText}>Votre position</Text>
                </TouchableOpacity>

                {/* Bouton "Filtres" */}
                <TouchableOpacity
                    style={styles.filtersButton}
                    activeOpacity={0.7}
                    onPress={onFiltersPress || (() => console.log('Filtres'))}
                >
                    <Text style={styles.filtersText}>Filtres ▼</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 12,
        marginBottom: 10,
    },
    searchIcon: {
        fontSize: 20,
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    locationButton: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderRadius: 8,
        flex: 1,
        marginRight: 10,
    },
    locationIcon: {
        fontSize: 16,
        marginRight: 8,
    },
    locationText: {
        fontSize: 14,
        color: '#000000',
    },
    filtersButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
    },
    filtersText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FFFFFF',
    },
});































