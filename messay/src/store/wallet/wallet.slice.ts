/**
 * wallet.slice.ts
 * ---------------------------------
 * Slice Redux pour le portefeuille (Wallet)
 * 
 * RÔLE MÉTIER :
 * - Gérer le solde du portefeuille
 * - Gérer l'historique des transactions
 * - Gérer les opérations (recharge, paiement, etc.)
 * 
 * UTILISÉ PAR :
 * - WalletCard (Dashboard) - Afficher le solde
 * - Wallet.tsx (Onglet Messay Pay) - Afficher le solde et les transactions
 * - Tricycle.tsx - Vérifier le solde avant réservation
 * - ReserveButton - Vérifier si le solde est suffisant
 */

import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WalletState, Transaction } from './wallet.types';

/**
 * État initial du slice wallet
 * 
 * Données mockées pour l'instant, remplacées par API plus tard
 */
const initialState: WalletState = {
    balance: 3500, // Solde initial en francs CFA
    transactions: [],
    isLoading: false,
    error: null,
};

/**
 * Slice Redux pour le portefeuille
 */
const walletSlice = createSlice({
    name: 'wallet',
    initialState,
    reducers: {
        /**
         * Action : Mettre à jour le solde
         * Utilisée après une recharge, un paiement, etc.
         * 
         * Payload : Nouveau solde en francs CFA
         * 
         * Exemple :
         * dispatch(setBalance(5000));
         */
        setBalance: (state, action: PayloadAction<number>) => {
            state.balance = action.payload;
            state.error = null;
        },
        
        /**
         * Action : Ajouter une transaction
         * Utilisée après chaque opération (recharge, paiement, etc.)
         * 
         * Payload : Transaction complète
         * 
         * Exemple :
         * dispatch(addTransaction({
         *   id: 'tx-123',
         *   type: 'credit',
         *   amount: 1000,
         *   description: 'Recharge',
         *   date: new Date().toISOString(),
         *   status: 'completed'
         * }));
         */
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.transactions.unshift(action.payload); // Ajouter au début de la liste
        },
        
        /**
         * Action : Définir toutes les transactions
         * Utilisée lors du chargement de l'historique depuis l'API
         * 
         * Payload : Liste complète des transactions
         */
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.transactions = action.payload;
        },
        
        /**
         * Action : Débiter le portefeuille
         * Utilisée lors d'un paiement
         * 
         * Payload : Montant à débiter
         * 
         * Exemple :
         * dispatch(debit(2500)); // Débite 2500F
         */
        debit: (state, action: PayloadAction<number>) => {
            state.balance = Math.max(0, state.balance - action.payload);
        },
        
        /**
         * Action : Créditer le portefeuille
         * Utilisée lors d'une recharge
         * 
         * Payload : Montant à créditer
         * 
         * Exemple :
         * dispatch(credit(1000)); // Ajoute 1000F
         */
        credit: (state, action: PayloadAction<number>) => {
            state.balance += action.payload;
        },
        
        /**
         * Action : Définir l'état de chargement
         * Utilisée pendant les appels API (recharge, chargement historique, etc.)
         * 
         * Payload : true si chargement en cours, false sinon
         */
        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },
        
        /**
         * Action : Définir une erreur
         * Utilisée en cas d'échec d'une opération
         * 
         * Payload : Message d'erreur
         */
        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        
        /**
         * Action : Réinitialiser le portefeuille
         * Utilisée lors de la déconnexion
         */
        resetWallet: (state) => {
            state.balance = 0;
            state.transactions = [];
            state.error = null;
            state.isLoading = false;
        },
    },
});

/**
 * Export des actions pour utilisation dans les composants
 * 
 * Exemple d'utilisation :
 * dispatch(setBalance(5000));
 * dispatch(credit(1000));
 * dispatch(debit(2500));
 */
export const {
    setBalance,
    addTransaction,
    setTransactions,
    debit,
    credit,
    setLoading,
    setError,
    resetWallet,
} = walletSlice.actions;

/**
 * Export du reducer pour utilisation dans rootReducer
 */
export default walletSlice.reducer;



























