<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Exécute la migration : crée la table des transactions.
     * 
     * Cette table enregistre toutes les opérations financières effectuées sur les wallets.
     * Chaque transaction est liée à un wallet et peut être de type crédit (entrée d'argent)
     * ou débit (sortie d'argent).
     * 
     * Structure de la table :
     * - id : Identifiant unique de la transaction
     * - wallet_id : Référence vers le wallet concerné (cascade sur suppression)
     * - type : Type de transaction (credit = entrée, debit = sortie)
     * - amount : Montant de la transaction en FCFA
     * - status : Statut de la transaction (pending, completed, failed, cancelled)
     * - reference : Référence unique pour le suivi et la traçabilité
     * - description : Description textuelle de la transaction
     * - category : Catégorie de la transaction (recharge, payment, refund, transfert, bonus, other)
     * - metadata : Données JSON supplémentaires (ex: trip_id, event_id pour traçabilité)
     * - completed_at : Date et heure de finalisation de la transaction
     * - timestamps : created_at et updated_at
     */
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            // Identifiant unique auto-incrémenté
            $table->id();
            
            // Référence vers le wallet concerné (relation N:1)
            // onDelete('cascade') supprime toutes les transactions si le wallet est supprimé
            $table->foreignId('wallet_id')->constrained('portefeuilles')->onDelete('cascade');
            
            // Type de transaction :
            // - credit : Entrée d'argent dans le wallet (recharge, remboursement, bonus, etc.)
            // - debit : Sortie d'argent du wallet (paiement, transfertt, etc.)
            $table->enum('type', ['credit', 'debit']);
            
            // Montant de la transaction en FCFA
            // decimal(15, 2) permet de stocker jusqu'à 999 999 999 999 999.99 FCFA
            $table->decimal('amount', 15, 2);
            
            // Statut de la transaction :
            // - pending : Transaction en attente de traitement
            // - completed : Transaction complétée avec succès
            // - failed : Transaction échouée (erreur de paiement, etc.)
            // - cancelled : Transaction annulée par l'utilisateur ou le système
            $table->enum('status', ['pending', 'completed', 'failed', 'cancelled'])->default('pending');
            
            // Référence unique de la transaction
            // Utilisée pour le suivi, la traçabilité et la communication avec l'utilisateur
            // Format généré : TXN-{UNIQUE_ID}-{TIMESTAMP}
            $table->string('reference')->unique();
            
            // Description textuelle de la transaction
            // Permet de comprendre rapidement la nature de l'opération
            // Exemple : "Rechargement de 5000 FCFA via mobile_money"
            $table->string('description')->nullable();
            
            // Catégorie de la transaction pour le classement et les statistiques :
            // - recharge : Rechargement du wallet
            // - payment : Paiement d'un service (trajet, événement, etc.)
            // - refund : Remboursement
            // - transfert : transfertt vers un autre utilisateur
            // - bonus : Bonus ou promotion
            // - other : Autre type de transaction
            $table->enum('category', ['recharge', 'payment', 'refund', 'transfert', 'bonus', 'other'])->default('other');
            
            // Métadonnées supplémentaires au format JSON
            // Permet de stocker des informations contextuelles sans modifier le schéma
            // Exemples :
            // - Pour un paiement de trajet : {"trip_id": 123, "driver_id": 456}
            // - Pour un remboursement : {"original_transaction_id": 789, "reason": "annulation"}
            $table->json('metadata')->nullable();
            
            // Date et heure de finalisation de la transaction
            // Rempli automatiquement lorsque le status passe à 'completed'
            $table->timestamp('completed_at')->nullable();
            
            // Timestamps automatiques (created_at, updated_at)
            $table->timestamps();
            
            // Index pour optimiser les recherches et filtrages fréquents
            $table->index('wallet_id');    // Recherche rapide par wallet
            $table->index('type');         // Filtrage par type (credit/debit)
            $table->index('status');       // Filtrage par statut
            $table->index('reference');    // Recherche rapide par référence unique
            $table->index('category');     // Filtrage par catégorie
            $table->index('created_at');   // Tri chronologique et filtrage par date
        });
    }

    /**
     * Annule la migration : supprime la table des transactions.
     * 
     * Cette méthode est appelée lors d'un rollback de migration.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
