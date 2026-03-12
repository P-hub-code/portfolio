/**
 * OrderScreen.tsx
 * ---------------------------------
 * Écran de commande de matériaux
 * 
 * Affiche :
 * - Informations utilisateur (N° Permis, Téléphone)
 * - Titre "COMMANDER MAINTENANT"
 * - Sélection de matériaux (Sable, Fer, Gravier)
 * - Bouton de validation
 */

import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

interface OrderScreenProps {
    licenseNumber?: string;
    phoneNumber?: string;
    onValidate?: (selectedMaterial: string) => void;
}

type MaterialType = 'sable' | 'fer' | 'gravier' | null;

// Icônes matériaux pour l'écran de commande
// Fichier courant : src/features/mobility/components/OrderScreen.tsx
// Images : src/assets/carrières/{Sable,Fer,Gravier}.png -> ../../../assets/carrières/...
const SableIcon = require('../../../assets/carrières/Sable.png');
const FerIcon = require('../../../assets/carrières/Fer.png');
const GravierIcon = require('../../../assets/carrières/Gravier.png');

export default function OrderScreen({
    /**
     * Exemple de numéro de permis / code interne transporteur
     * Ici format libre, adapté à la démo Côte d'Ivoire.
     */
    licenseNumber = 'CI-8820-ME',
    /**
     * Numéro ivoirien au format international +225
     * Affiché tel quel pour que l'utilisateur retrouve sa structure habituelle.
     */
    phoneNumber = '+225 07 45 82 91 74',
    onValidate,
}: OrderScreenProps) {
    const navigation = useNavigation();
    const [selectedMaterial, setSelectedMaterial] = useState<MaterialType>(null);

    /**
     * Gestion de la sélection d'un matériau
     */
    const handleMaterialSelect = (material: MaterialType) => {
        setSelectedMaterial(material);
    };

    /**
     * Gestion de la validation de la commande
     */
    const handleValidate = () => {
        if (selectedMaterial) {
            if (onValidate) {
                onValidate(selectedMaterial);
            } else {
                console.log(`Commande validée : ${selectedMaterial}`);
                // TODO: Appel API pour créer la commande
            }
            // Retour à l'écran précédent après validation
            if (navigation.canGoBack()) {
                navigation.goBack();
            }
        } else {
            console.log('Veuillez sélectionner un matériau sable, fer ou gravier');
        }
    };

    return (
        <View style={styles.wrapper}>
            {/* Header avec retour */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    activeOpacity={0.7}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Commande</Text>
                <View style={styles.placeholder} />
            </View>
            
            <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                {/* Informations utilisateur */}
            <View style={styles.userInfoContainer}>
                <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>N° PERMIS</Text>
                    <Text style={styles.infoValue}>{licenseNumber}</Text>
                </View>
                
                <View style={styles.infoBlock}>
                    <Text style={styles.infoLabel}>TÉLÉPHONE</Text>
                    <Text style={styles.infoValue}>{phoneNumber}</Text>
                </View>
            </View>

            {/* Titre */}
            <Text style={styles.title}>COMMANDER MAINTENANT</Text>

            {/* Sélection de matériaux */}
            <View style={styles.materialsContainer}>
                <TouchableOpacity
                    style={[
                        styles.materialCard,
                        selectedMaterial === 'sable' && styles.materialCardSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleMaterialSelect('sable')}
                >
                    {/* Icône Sable */}
                    <Image source={SableIcon} style={styles.materialImage} resizeMode="contain" />
                    <Text style={styles.materialLabel}>SABLE</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.materialCard,
                        selectedMaterial === 'fer' && styles.materialCardSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleMaterialSelect('fer')}
                >
                    {/* Icône Fer */}
                    <Image source={FerIcon} style={styles.materialImage} resizeMode="contain" />
                    <Text style={styles.materialLabel}>FER</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[
                        styles.materialCard,
                        selectedMaterial === 'gravier' && styles.materialCardSelected,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => handleMaterialSelect('gravier')}
                >
                    {/* Icône Gravier */}
                    <Image source={GravierIcon} style={styles.materialImage} resizeMode="contain" />
                    <Text style={styles.materialLabel}>GRAVIER</Text>
                </TouchableOpacity>
            </View>

            {/* Bouton de validation */}
            <TouchableOpacity
                style={[
                    styles.validateButton,
                    !selectedMaterial && styles.validateButtonDisabled,
                ]}
                activeOpacity={0.7}
                onPress={handleValidate}
                disabled={!selectedMaterial}
            >
                <Text style={styles.validateButtonText}>Valider la commande &gt;</Text>
            </TouchableOpacity>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    wrapper: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 15,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F5F5F5',
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
        fontWeight: '600',
        color: '#000000',
    },
    placeholder: {
        width: 40,
    },
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    userInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 30,
    },
    infoBlock: {
        flex: 1,
        backgroundColor: '#E0E0E0',
        borderRadius: 8,
        padding: 15,
        marginHorizontal: 5,
    },
    infoLabel: {
        fontSize: 11,
        fontWeight: '500',
        color: '#666666',
        marginBottom: 5,
        textTransform: 'uppercase',
    },
    infoValue: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 25,
        textAlign: 'center',
    },
    materialsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
    },
    materialCard: {
        width: 100,
        height: 100,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    materialCardSelected: {
        borderColor: '#FF6B35', // Orange de la marque
        borderWidth: 2,
        backgroundColor: '#FFF5F0',
    },
    materialIcon: {
        fontSize: 32,
        marginBottom: 8,
    },
    materialImage: {
        width: 40,
        height: 40,
        marginBottom: 8,
    },
    materialLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: '#000000',
    },
    validateButton: {
        backgroundColor: '#B0BEC5', // Bleu-gris clair (comme dans l'image)
        borderRadius: 12,
        paddingVertical: 16,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    validateButtonDisabled: {
        opacity: 0.5,
    },
    validateButtonText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#424242',
    },
});

