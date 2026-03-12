/**
 * wallet.types.ts
 * ---------------------------------
 * Types TypeScript pour le domaine Portefeuille
 * 
 * RÔLE :
 * - Définir les types du state wallet
 * - Définir les types des transactions
 * - Centraliser les types pour une meilleure maintenabilité
 */

/**
 * Transaction du portefeuille
 */
export interface Transaction {
    id: string;
    type: 'credit' | 'debit'; // credit = ajout, debit = retrait
    amount: number; // Montant en francs CFA
    description: string;
    date: string; // ISO date string
    status: 'pending' | 'completed' | 'failed';
    relatedEntity?: {
        type: 'trip' | 'recharge' | 'refund';
        id: string;
    };
}

/**
 * État du slice wallet
 */
export interface WalletState {
    /**
     * Solde disponible en francs CFA
     */
    balance: number;
    
    /**
     * Liste des transactions
     */
    transactions: Transaction[];
    
    /**
     * Indique si une opération est en cours (recharge, paiement, etc.)
     */
    isLoading: boolean;
    
    /**
     * Message d'erreur en cas d'échec
     */
    error: string | null;
}



























