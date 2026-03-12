/**
 * Delivery.tsx
 * ---------------------------------
 * Écran principal du service "Carrières" (Option A).
 *
 * UI conforme à la maquette :
 * - Choisissez un matériau (Sable / Gravier / Fer)
 * - Prix estimé + temps de livraison
 * - Quantité (boutons - / +, libellé "4.5 tonnes")
 * - Disponible maintenant (Voir détails flotte)
 * - Chauffeur (nom + téléphone)
 * - Bouton "Commander maintenant >"
 */

import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity, Text, Image } from 'react-native';
import CareersHeader from './components/CareersHeader';
import DriverCard from './components/DriverCard';
import { useAuthGuard } from '../../hooks/useAuthGuard';

type MaterialType = 'sable' | 'fer' | 'gravier';

const MATERIAL_PRICES: Record<MaterialType, number> = {
    sable: 2500,
    gravier: 3000,
    fer: 10000,
};

const SableIcon = require('../../assets/carrières/Sable.png');
const GravierIcon = require('../../assets/carrières/Gravier.png');
const FerIcon = require('../../assets/carrières/Fer.png');

export default function Delivery() {
    const { requireAuth } = useAuthGuard();

    const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>('gravier');
    const [quantity, setQuantity] = useState<number>(4.5);

    const handleMaterialSelect = (material: MaterialType) => {
        setSelectedMaterial(material);
    };

    const handleIncreaseQuantity = () => {
        setQuantity((prev) => Math.min(prev + 0.5, 50));
    };

    const handleDecreaseQuantity = () => {
        setQuantity((prev) => Math.max(prev - 0.5, 0.5));
    };

    const calculateEstimatedPrice = () => {
        const basePrice = MATERIAL_PRICES[selectedMaterial];
        const total = basePrice * quantity;
        return `${total.toLocaleString('fr-FR')} F`;
    };

    const handleOrder = () => {
        if (!requireAuth()) {
            return;
        }
        console.log(
            `Commande Carrières : matériau=${selectedMaterial}, quantité=${quantity} tonnes, prix=${calculateEstimatedPrice()}`,
        );
        // TODO: Appel API / navigation confirmation
    };

    return (
        <View style={styles.container}>
            <CareersHeader />

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Choix matériau */}
                <Text style={styles.sectionTitle}>Choisissez un matériau</Text>
                <View style={styles.materialRow}>
                    <MaterialCard
                        label="SABLE"
                        subtitle="À partir de 2 500 F"
                        icon={SableIcon}
                        selected={selectedMaterial === 'sable'}
                        onPress={() => handleMaterialSelect('sable')}
                    />
                    <MaterialCard
                        label="GRAVIER"
                        subtitle="À partir de 3 000 F"
                        icon={GravierIcon}
                        selected={selectedMaterial === 'gravier'}
                        onPress={() => handleMaterialSelect('gravier')}
                    />
                    <MaterialCard
                        label="FER"
                        subtitle="À partir de 10 000 F"
                        icon={FerIcon}
                        selected={selectedMaterial === 'fer'}
                        onPress={() => handleMaterialSelect('fer')}
                    />
                </View>

                {/* Prix estimé */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Prix estimé</Text>
                    <Text style={styles.priceText}>{calculateEstimatedPrice()}</Text>
                    <View style={styles.rowCenter}>
                        <Text style={styles.clockIcon}>🕒</Text>
                        <Text style={styles.lightText}>Livraison ~45 min</Text>
                    </View>
                </View>

                {/* Quantité */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Quantité</Text>
                    <View style={styles.quantityRow}>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            activeOpacity={0.7}
                            onPress={handleDecreaseQuantity}
                        >
                            <Text style={styles.quantityButtonText}>−</Text>
                        </TouchableOpacity>
                        <View style={styles.quantityValueContainer}>
                            <Text style={styles.quantityValueText}>{quantity} tonnes</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.quantityButton}
                            activeOpacity={0.7}
                            onPress={handleIncreaseQuantity}
                        >
                            <Text style={styles.quantityButtonText}>+</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* Disponibilité */}
                <View style={styles.card}>
                    <View style={styles.rowCenter}>
                        <View style={styles.statusDot} />
                        <Text style={styles.cardLabel}>Disponible maintenant</Text>
                    </View>
                    <TouchableOpacity activeOpacity={0.7}>
                        <Text style={styles.linkText}>Voir détails flotte ›</Text>
                    </TouchableOpacity>
                </View>

                {/* Chauffeur */}
                <View style={styles.card}>
                    <Text style={styles.cardLabel}>Chauffeur</Text>
                    <DriverCard
                        driverName="OUATTARA ADAMA"
                        driverPhone="+225 07 45 82 91"
                    />
                </View>

                {/* Bouton Commander */}
                <View style={styles.orderButtonContainer}>
                    <TouchableOpacity
                        style={styles.orderButton}
                        activeOpacity={0.8}
                        onPress={handleOrder}
                    >
                        <Text style={styles.orderButtonText}>Commander maintenant &gt;</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </View>
    );
}

interface MaterialCardProps {
    label: string;
    subtitle: string;
    icon: any;
    selected: boolean;
    onPress: () => void;
}

function MaterialCard({ label, subtitle, icon, selected, onPress }: MaterialCardProps) {
    return (
        <TouchableOpacity
            style={[styles.materialCard, selected && styles.materialCardSelected]}
            activeOpacity={0.7}
            onPress={onPress}
        >
            <View style={styles.materialImageWrapper}>
                <Image source={icon} style={styles.materialImage} resizeMode="cover" />
                {selected && (
                    <View style={styles.checkBadge}>
                        <Text style={styles.checkBadgeText}>✓</Text>
                    </View>
                )}
            </View>
            <Text style={styles.materialLabel}>{label}</Text>
            <Text style={styles.materialSubtitle}>{subtitle}</Text>
        </TouchableOpacity>
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
        paddingBottom: 32,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        marginHorizontal: 20,
        marginTop: 16,
        marginBottom: 16,
    },
    materialRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    materialCard: {
        width: 110,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 12,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    materialCardSelected: {
        borderColor: '#FF6B35',
    },
    materialImageWrapper: {
        width: '100%',
        height: 80,
        borderRadius: 10,
        overflow: 'hidden',
        marginBottom: 8,
        position: 'relative',
    },
    materialImage: {
        width: '100%',
        height: '100%',
    },
    checkBadge: {
        position: 'absolute',
        top: 6,
        right: 6,
        width: 22,
        height: 22,
        borderRadius: 11,
        backgroundColor: '#4CAF50',
        alignItems: 'center',
        justifyContent: 'center',
    },
    checkBadgeText: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 14,
    },
    materialLabel: {
        fontSize: 14,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 4,
    },
    materialSubtitle: {
        fontSize: 12,
        color: '#777777',
        textAlign: 'center',
    },
    card: {
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 20,
        marginHorizontal: 20,
        marginBottom: 16,
    },
    cardLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 8,
    },
    priceText: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 10,
    },
    rowCenter: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    clockIcon: {
        fontSize: 16,
        marginRight: 6,
    },
    lightText: {
        fontSize: 14,
        color: '#666666',
    },
    quantityRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    quantityButton: {
        width: 44,
        height: 44,
        borderRadius: 22,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
    },
    quantityButtonText: {
        color: '#FFFFFF',
        fontSize: 24,
        fontWeight: '700',
    },
    quantityValueContainer: {
        flex: 1,
        marginHorizontal: 12,
        borderRadius: 22,
        backgroundColor: '#333333',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 10,
    },
    quantityValueText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
    statusDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#4CAF50',
        marginRight: 8,
    },
    linkText: {
        marginTop: 8,
        fontSize: 14,
        color: '#666666',
    },
    orderButtonContainer: {
        paddingHorizontal: 20,
        marginTop: 8,
    },
    orderButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    orderButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});

