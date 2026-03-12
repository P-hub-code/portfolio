/**
 * TricycleList.tsx
 * ---------------------------------
 * Liste scrollable des tricycles disponibles
 * 
 * RESPONSABILITÉS :
 * - Afficher la liste des tricycles disponibles
 * - Gérer le scroll
 * - Utiliser TricycleCard pour chaque élément
 * 
 * RÔLE MÉTIER :
 * - Afficher les données fournies (mockées pour l'instant)
 * - Plus tard, recevra les données du backend
 */

import React from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import TricycleCard, { TricycleData } from './TricycleCard';

interface TricycleListProps {
    /**
     * Liste des tricycles à afficher
     * Données mockées pour l'instant, remplacées par API plus tard
     */
    tricycles: TricycleData[];
    /**
     * Callback quand on clique sur un tricycle
     */
    onTricyclePress?: (tricycle: TricycleData) => void;
}

export default function TricycleList({ tricycles, onTricyclePress }: TricycleListProps) {
    return (
        <View style={styles.container}>
            <FlatList
                data={tricycles}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TricycleCard
                        tricycle={item}
                        onPress={onTricyclePress}
                    />
                )}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.listContent}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    listContent: {
        paddingBottom: 100, // Espace pour le bouton "Réserver" en bas
    },
});































