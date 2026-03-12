/**
 * Wallet.tsx
 * ---------------------------------
 * Écran du portefeuille Messay Pay.
 * 
 * C'est l'onglet central "Messay Pay" dans la navigation.
 * 
 * AFFICHE :
 * - Header avec retour et notifications
 * - Carte solde (comme WalletCard du Dashboard)
 * - Boutons d'action (Recharger, Voir historique)
 * - Liste des transactions (historique complet)
 * 
 * RÔLE MÉTIER :
 * - Centraliser toutes les opérations de paiement
 * - Afficher l'historique complet des transactions
 * - Permettre la recharge du portefeuille
 * - Suivre les paiements de courses, recharges, etc.
 */

import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

/**
 * Import Redux
 * 
 * useAppSelector : Hook typé pour lire le state Redux
 * useAppDispatch : Hook typé pour dispatcher des actions Redux
 * Permet d'accéder au solde et aux transactions depuis le store global
 */
import { useAppSelector, useAppDispatch } from '../../store/hooks';
import { credit, addTransaction, setLoading } from '../../store/wallet/wallet.slice';
import { Transaction } from '../../store/wallet/wallet.types';

/**
 * Import de l'illustration du portefeuille
 * 
 * CHEMIN RELATIF :
 * Ce fichier est dans : src/features/wallet/Wallet.tsx
 * Pour accéder à : src/assets/services/wallet.png
 * 
 * Calcul du chemin :
 * - wallet/ → remonte 1 niveau (../) → features/
 * - features/ → remonte 1 niveau (../../) → src/
 * - src/ → descend dans assets/services/ → ../../assets/services/wallet.png
 */
const WalletIllustration = require('../../assets/services/wallet.png');

export default function Wallet() {
    /**
     * Navigation React Navigation
     * Permet de naviguer en arrière avec navigation.goBack()
     */
    const navigation = useNavigation();

    /**
     * Redux Hooks
     * 
     * dispatch : Fonction pour dispatcher des actions Redux
     * balance : Solde actuel du portefeuille
     * transactions : Liste complète des transactions
     * isLoading : Indique si une opération est en cours
     */
    const dispatch = useAppDispatch();
    const balance = useAppSelector((state) => state.wallet.balance);
    const transactions = useAppSelector((state) => state.wallet.transactions);
    const isLoading = useAppSelector((state) => state.wallet.isLoading);

    /**
     * Gestion du clic sur le bouton Recharger
     * 
     * FONCTIONNE SANS BACKEND :
     * - Simule une recharge de 5000F
     * - Met à jour le solde immédiatement
     * - Ajoute une transaction dans l'historique
     * 
     * QUAND LE BACKEND SERA PRÊT :
     * - Remplacer par un thunk qui appelle l'API
     * - Le reste du code reste identique
     */
    const handleRecharge = () => {
        // Montant de recharge (peut être paramétrable plus tard)
        const rechargeAmount = 5000;

        // Simuler un délai de traitement (comme une vraie API)
        dispatch(setLoading(true));

        // Simuler l'appel API avec un setTimeout
        setTimeout(() => {
            // Créditer le portefeuille
            dispatch(credit(rechargeAmount));

            // Ajouter la transaction dans l'historique
            dispatch(addTransaction({
                id: `tx-${Date.now()}`,
                type: 'credit',
                amount: rechargeAmount,
                description: 'Recharge portefeuille',
                date: new Date().toISOString(),
                status: 'completed',
                relatedEntity: {
                    type: 'recharge',
                    id: `recharge-${Date.now()}`,
                },
            }));

            dispatch(setLoading(false));

            console.log(`✅ Recharge de ${rechargeAmount.toLocaleString()}F réussie`);
            // TODO: Afficher un message de succès à l'utilisateur (Toast, Alert, etc.)
        }, 1000); // Simule 1 seconde de traitement (comme une vraie API)
    };

    /**
     * Gestion du clic sur "Voir historique"
     * Pour l'instant, on scroll simplement vers le bas
     * Plus tard, on pourra naviguer vers un écran dédié
     */
    const handleViewHistory = () => {
        // TODO: Navigation vers écran historique détaillé ou scroll automatique
        console.log('Voir historique');
    };

    /**
     * Formatage de la date pour affichage
     * Convertit une date ISO en format lisible
     * 
     * Exemple : "2024-01-15T10:30:00Z" → "15/01/2024 10:30"
     */
    const formatDate = (dateString: string): string => {
        const date = new Date(dateString);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
    };

    /**
     * Récupération de l'icône selon le type de transaction
     * Pour l'instant, on utilise des emojis, plus tard on pourra utiliser des vraies icônes
     */
    const getTransactionIcon = (transaction: Transaction): string => {
        if (transaction.relatedEntity?.type === 'trip') {
            return '🚲'; // Course tricycle
        }
        if (transaction.relatedEntity?.type === 'recharge') {
            return '💰'; // Recharge
        }
        if (transaction.type === 'credit') {
            return '➕'; // Crédit
        }
        return '➖'; // Débit
    };

    /**
     * Gestion du bouton retour
     * Navigation vers l'écran précédent
     */
    const handleBackPress = () => {
        if (navigation.canGoBack()) {
            navigation.goBack();
        } else {
            // Si on ne peut pas revenir en arrière, on reste sur l'écran
            console.log('Pas d\'écran précédent');
        }
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.7}
                    onPress={handleBackPress}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Portefeuille</Text>
                <TouchableOpacity
                    style={styles.notificationButton}
                    activeOpacity={0.7}
                    onPress={() => console.log('Notifications')}
                >
                    <Text style={styles.notificationIcon}>🔔</Text>
                </TouchableOpacity>
            </View>

            {/* Contenu scrollable */}
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Carte solde (comme WalletCard du Dashboard) */}
                <View style={styles.balanceCard}>
                    <View style={styles.balanceContent}>
                        <View style={styles.balanceTextContainer}>
                            <Text style={styles.balanceTitle}>Portefeuille</Text>
                            <Text style={styles.balanceLabel}>Solde Disponible</Text>
                            <Text style={styles.balanceAmount}>
                                {balance.toLocaleString()}F
                            </Text>
                        </View>
                    </View>
                    <View style={styles.balanceIllustration}>
                        <Image
                            source={WalletIllustration}
                            style={styles.illustration}
                            resizeMode="contain"
                        />
                    </View>
                </View>

                {/* Boutons d'action */}
                <View style={styles.actionsContainer}>
                    <TouchableOpacity
                        style={[styles.actionButton, isLoading && styles.actionButtonDisabled]}
                        activeOpacity={0.7}
                        onPress={handleRecharge}
                        disabled={isLoading}
                    >
                        <Text style={styles.actionButtonIcon}>💰</Text>
                        <Text style={styles.actionButtonText}>Recharger</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.actionButton}
                        activeOpacity={0.7}
                        onPress={handleViewHistory}
                    >
                        <Text style={styles.actionButtonIcon}>📋</Text>
                        <Text style={styles.actionButtonText}>Voir historique</Text>
                    </TouchableOpacity>
                </View>

                {/* Section historique des transactions */}
                <View style={styles.transactionsSection}>
                    <Text style={styles.transactionsTitle}>Transactions Instantanées</Text>

                    {transactions.length === 0 ? (
                        <View style={styles.emptyState}>
                            <Text style={styles.emptyStateText}>
                                Aucune transaction pour le moment
                            </Text>
                        </View>
                    ) : (
                        transactions.map((transaction) => (
                            <View key={transaction.id} style={styles.transactionCard}>
                                {/* Icône transaction */}
                                <View style={styles.transactionIconContainer}>
                                    <Text style={styles.transactionIcon}>
                                        {getTransactionIcon(transaction)}
                                    </Text>
                                </View>

                                {/* Détails transaction */}
                                <View style={styles.transactionDetails}>
                                    <Text style={styles.transactionDescription}>
                                        {transaction.description}
                                    </Text>
                                    {transaction.relatedEntity?.type === 'trip' && (
                                        <Text style={styles.transactionSubDescription}>
                                            Course tricycle
                                        </Text>
                                    )}
                                    <Text style={styles.transactionDate}>
                                        {formatDate(transaction.date)}
                                    </Text>
                                </View>

                                {/* Montant transaction */}
                                <View style={styles.transactionAmountContainer}>
                                    <Text
                                        style={[
                                            styles.transactionAmount,
                                            transaction.type === 'credit'
                                                ? styles.transactionAmountCredit
                                                : styles.transactionAmountDebit,
                                        ]}
                                    >
                                        {transaction.type === 'credit' ? '+' : '-'}
                                        {transaction.amount.toLocaleString()}F
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    backIcon: {
        fontSize: 24,
        color: '#000000',
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
    },
    notificationButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    notificationIcon: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 20,
    },
    balanceCard: {
        backgroundColor: '#FF6B35', // Orange de la marque
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 140,
    },
    balanceContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    balanceTextContainer: {
        marginBottom: 15,
    },
    balanceTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 5,
    },
    balanceLabel: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 5,
    },
    balanceAmount: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    balanceIllustration: {
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    illustration: {
        width: 80,
        height: 80,
    },
    actionsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingVertical: 15,
        paddingHorizontal: 20,
        marginHorizontal: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    actionButtonDisabled: {
        opacity: 0.5,
    },
    actionButtonIcon: {
        fontSize: 20,
        marginRight: 8,
    },
    actionButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    transactionsSection: {
        paddingHorizontal: 20,
    },
    transactionsTitle: {
        fontSize: 18,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 15,
    },
    emptyState: {
        paddingVertical: 40,
        alignItems: 'center',
    },
    emptyStateText: {
        fontSize: 14,
        color: '#666666',
    },
    transactionCard: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 15,
        marginBottom: 10,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    transactionIconContainer: {
        width: 50,
        height: 50,
        borderRadius: 25,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    transactionIcon: {
        fontSize: 24,
    },
    transactionDetails: {
        flex: 1,
    },
    transactionDescription: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    transactionSubDescription: {
        fontSize: 12,
        color: '#666666',
        marginBottom: 4,
    },
    transactionDate: {
        fontSize: 12,
        color: '#999999',
    },
    transactionAmountContainer: {
        alignItems: 'flex-end',
    },
    transactionAmount: {
        fontSize: 16,
        fontWeight: '700',
    },
    transactionAmountCredit: {
        color: '#4CAF50', // Vert pour crédit
    },
    transactionAmountDebit: {
        color: '#F44336', // Rouge pour débit
    },
});
