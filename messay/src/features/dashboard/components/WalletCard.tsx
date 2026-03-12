/**
 * WalletCard.tsx
 * ---------------------------------
 * Carte Portefeuille (Messay Pay)
 * 
 * Affiche :
 * - Titre "Portefeuille"
 * - Solde disponible
 * - Bouton "Recharger"
 * - Illustration visuelle
 * 
 * Rôle métier :
 * - Montrer immédiatement si l'utilisateur peut payer
 * - Inciter à recharger
 * - Cœur financier de l'application
 */

import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

/**
 * Import Redux
 * 
 * useAppSelector : Hook typé pour lire le state Redux
 * useAppDispatch : Hook typé pour dispatcher des actions Redux
 * Permet d'accéder au solde du portefeuille depuis le store global
 * et de modifier le solde (recharge, débit, etc.)
 */
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import { credit, addTransaction, setLoading } from '../../../store/wallet/wallet.slice';

/**
 * Import de l'illustration du portefeuille
 * 
 * CHEMIN RELATIF CORRIGÉ :
 * Ce fichier est dans : src/features/dashboard/components/WalletCard.tsx
 * Pour accéder à : src/assets/services/wallet.png
 * 
 * Calcul du chemin :
 * - components/ → remonte 1 niveau (../) → dashboard/
 * - dashboard/ → remonte 1 niveau (../../) → features/
 * - features/ → remonte 1 niveau (../../../) → src/
 * - src/ → descend dans assets/services/ → ../../../assets/services/wallet.png
 * 
 * Donc il faut remonter 3 niveaux (../../../) et non 2 (../../)
 */
const WalletIllustration = require('../../../assets/services/wallet.png');

export default function WalletCard() {
    /**
     * Redux Hooks
     * 
     * dispatch : Fonction pour dispatcher des actions Redux
     * balance : Solde actuel du portefeuille
     * isLoading : Indique si une opération est en cours
     */
    const dispatch = useAppDispatch();
    const balance = useAppSelector((state) => state.wallet.balance);
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
            }));
            
            dispatch(setLoading(false));
            
            console.log(`✅ Recharge de ${rechargeAmount.toLocaleString()}F réussie`);
            // TODO: Afficher un message de succès à l'utilisateur (Toast, Alert, etc.)
        }, 1000); // Simule 1 seconde de traitement (comme une vraie API)
    };

    return (
        <View style={styles.container}>
            {/* Contenu principal */}
            <View style={styles.contentContainer}>
                {/* Titre et solde */}
                <View style={styles.textContainer}>
                    <Text style={styles.title}>Portefeuille</Text>
                    <Text style={styles.label}>Solde Disponible</Text>
                    <Text style={styles.balance}>
                        {balance.toLocaleString()}F
                    </Text>
                </View>

                {/* Bouton Recharger */}
                <TouchableOpacity
                    style={[styles.rechargeButton, isLoading && styles.rechargeButtonDisabled]}
                    activeOpacity={0.7}
                    onPress={handleRecharge}
                    disabled={isLoading} // Désactiver pendant le chargement
                >
                    <Text style={styles.rechargeButtonText}>
                        {isLoading ? '⏳ Rechargement...' : '⚡ Recharger'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Illustration visuelle (portefeuille + billets) */}
            <View style={styles.illustrationContainer}>
                <Image
                    source={WalletIllustration}
                    style={styles.illustration}
                    resizeMode="contain"
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF6B35', // Orange de la marque
        borderRadius: 16,
        padding: 20,
        marginHorizontal: 20,
        marginVertical: 15,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        minHeight: 140,
    },
    contentContainer: {
        flex: 1,
        justifyContent: 'space-between',
    },
    textContainer: {
        marginBottom: 15,
    },
    title: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    label: {
        fontSize: 14,
        color: '#FFFFFF',
        opacity: 0.9,
        marginBottom: 5,
    },
    balance: {
        fontSize: 32,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    rechargeButton: {
        backgroundColor: '#FFFFFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 8,
        alignSelf: 'flex-start',
    },
    rechargeButtonDisabled: {
        opacity: 0.6, // Réduire l'opacité quand désactivé
    },
    rechargeButtonText: {
        fontSize: 14,
        fontWeight: '600',
        color: '#FF6B35',
    },
    illustrationContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
    },
    illustration: {
        width: 100,
        height: 100,
    },
});


