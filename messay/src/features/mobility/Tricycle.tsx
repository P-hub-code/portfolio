/**
 * Tricycle.tsx
 * ---------------------------------
 * Écran du service Tricycles (mobilité).
 *
 * Assemble :
 * - Header avec bouton retour
 * - Barre de recherche
 * - Carte (placeholder image Abidjan)
 * - Liste des tricycles (mock)
 * - Bouton "Réserver un tricycle"
 *
 * Branche la logique Redux pour :
 * - Vérifier le solde du wallet
 * - Créer une course active
 * - Enregistrer la transaction dans le wallet
 */

import React, { useMemo, useState } from 'react';
import { View, StyleSheet, Alert, ScrollView, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import TricycleHeader from './components/TricycleHeader';
import TricycleSearchBar from './components/TricycleSearchBar';
import TricycleMapPlaceholder from './components/TricycleMapPlaceholder';
import TricycleList from './components/TricycleList';
import { MOCK_TRICYCLES } from './components/mockTricycleData';
import { TricycleData } from './components/TricycleCard';

import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setActiveTrip, setLoading as setMobilityLoading, setError as setMobilityError } from '../../store/mobility/mobility.slice';
import { Trip } from '../../store/mobility/mobility.types';
import { debit, addTransaction } from '../../store/wallet/wallet.slice';
import { useAuthGuard } from '../../hooks/useAuthGuard';

export default function Tricycle() {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const { requireAuth } = useAuthGuard();

    const balance = useAppSelector((state) => state.wallet.balance);
    const activeTrip = useAppSelector((state) => state.mobility.activeTrip);
    const isMobilityLoading = useAppSelector((state) => state.mobility.isLoading);

    const [selectedTricycle, setSelectedTricycle] = useState<TricycleData | null>(null);
    const [searchValue, setSearchValue] = useState('');

    const filteredTricycles = useMemo(() => {
        if (!searchValue.trim()) {
            return MOCK_TRICYCLES;
        }

        const lower = searchValue.toLowerCase();
        return MOCK_TRICYCLES.filter((t) =>
            t.driverName.toLowerCase().includes(lower) ||
            t.departure.toLowerCase().includes(lower) ||
            t.destination.toLowerCase().includes(lower)
        );
    }, [searchValue]);

    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            console.log('Pas d\'écran précédent');
        }
    };

    const handleReservePress = () => {
        // Vérifie l'authentification en premier (redirige vers auth si non connecté)
        if (!requireAuth()) {
            return; // L'utilisateur sera redirigé vers le flux d'authentification
        }

        if (!selectedTricycle) {
            Alert.alert('Sélection requise', 'Veuillez sélectionner un tricycle.');
            return;
        }

        if (activeTrip) {
            Alert.alert('Course en cours', 'Vous avez déjà une course active.');
            return;
        }

        if (balance < selectedTricycle.price) {
            Alert.alert('Solde insuffisant', 'Votre solde est insuffisant pour cette course.');
            return;
        }

        dispatch(setMobilityLoading(true));

        const now = new Date();
        const tripId = `trip-${now.getTime()}`;

        const newTrip: Trip = {
            id: tripId,
            driverId: selectedTricycle.id,
            driverName: selectedTricycle.driverName,
            departure: selectedTricycle.departure,
            destination: selectedTricycle.destination,
            estimatedTime: selectedTricycle.estimatedTime,
            distance: selectedTricycle.distance,
            price: selectedTricycle.price,
            status: 'pending',
            createdAt: now.toISOString(),
        };

        try {
            dispatch(setActiveTrip(newTrip));
            dispatch(debit(selectedTricycle.price));
            dispatch(addTransaction({
                id: `tx-${now.getTime()}`,
                type: 'debit',
                amount: selectedTricycle.price,
                description: 'Course tricycle',
                date: now.toISOString(),
                status: 'completed',
                relatedEntity: {
                    type: 'trip',
                    id: tripId,
                },
            }));

            console.log('Course tricycle réservée avec succès');
        } catch (error) {
            console.error('Erreur lors de la réservation du tricycle', error);
            dispatch(setMobilityError('Erreur lors de la réservation du tricycle'));
        } finally {
            dispatch(setMobilityLoading(false));
        }
    };

    return (
        <View style={styles.container}>
            <TricycleHeader onBackPress={handleBackPress} />

            <TricycleSearchBar
                searchValue={searchValue}
                onSearchChange={setSearchValue}
            />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                <TricycleMapPlaceholder />

                <TricycleList
                    tricycles={filteredTricycles}
                    onTricyclePress={setSelectedTricycle}
                />
            </ScrollView>

            <View style={styles.reserveContainer}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handleReservePress}
                    disabled={isMobilityLoading}
                    style={[
                        styles.reserveButton,
                        isMobilityLoading && styles.reserveButtonDisabled,
                    ]}
                >
                    <Text style={styles.reserveButtonText}>
                        {isMobilityLoading ? 'Réservation en cours...' : 'Réserver un tricycle'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 100,
    },
    reserveContainer: {
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        padding: 20,
        backgroundColor: 'rgba(245, 245, 245, 0.95)',
    },
    reserveButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    reserveButtonDisabled: {
        opacity: 0.5,
    },
    reserveButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});

