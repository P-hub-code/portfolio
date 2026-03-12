/**
 * MainTabNavigator.tsx
 * ---------------------------------
 * Définit la barre de navigation inférieure (Tab Bar).
 * 
 * Chaque onglet :
 * - correspond à un module métier
 * - pointe vers une feature précise
 * 
 * IMPORTANT :
 * - aucune logique métier ici
 * - uniquement de la navigation
 */

import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';

/**
 * Import des écrans principaux
 * Chaque écran est placé directement dans sa feature
 * (pas de dossier screens)
 */
import Dashboard from '../../features/dashboard/Dashboard';
import Tricycle from '../../features/mobility/Tricycle';
import Wallet from '../../features/wallet/Wallet';
import Delivery from '../../features/mobility/Delivery';
import CareersStack from '../careersStack';
// import Profile from '../../features/identity/Profile';

/**
 * Import des icônes pour la barre de navigation
 * Les fichiers sont dans des sous-dossiers avec le même nom que le fichier
 * On utilise require() car React Native nécessite cette syntaxe pour les images
 */
const AccueilIcon = require('../../assets/icons/accueil.png');
const TricycleIcon = require('../../assets/icons/tricycle.png');
const WalletIcon = require('../../assets/icons/wallet.png');
const CarriereIcon = require('../../assets/icons/carrière.png');

/**
 * Création du navigateur par onglets
 */
const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
    return (
        <Tab.Navigator
            /**
             * Options globales de la Tab Bar
             */
            screenOptions={{
                headerShown: false, // On masque le header natif
                tabBarActiveTintColor: '#FF6B35', // Orange pour les onglets actifs
                tabBarInactiveTintColor: '#8E8E93', // Gris pour les onglets inactifs
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '500',
                    marginTop: 4,
                },
                tabBarStyle: {
                    height: 80,
                    paddingBottom: 10,
                    paddingTop: 10,
                    borderTopWidth: 1,
                    borderTopColor: '#E5E5E5',
                },
            }}
        >
            {/* Onglet Accueil */}
            <Tab.Screen
                name="Accueil"
                component={Dashboard}
                options={{
                    tabBarLabel: 'Accueil',
                    /**
                     * Icône pour l'onglet Accueil
                     * On affiche l'image telle quelle, sans recolorer l'icône
                     */
                    tabBarIcon: ({ size }) => (
                        <Image
                            source={AccueilIcon}
                            style={{ width: size, height: size }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />

            {/* Onglet Tricycles */}
            <Tab.Screen
                name="Tricycles"
                component={Tricycle}
                options={{
                    tabBarLabel: 'Tricycles',
                    /**
                     * Icône pour l'onglet Tricycles
                     * Image affichée sans tintColor pour respecter le visuel fourni
                     */
                    tabBarIcon: ({ size }) => (
                        <Image
                            source={TricycleIcon}
                            style={{ width: size, height: size }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />

            {/* Onglet central - Paiement avec rond orange */}
            <Tab.Screen
                name="Messay Pay"
                component={Wallet}
                options={{
                    tabBarLabel: 'Messay Pay',
                    /**
                     * Bouton personnalisé pour l'onglet "Messay Pay"
                     * 
                     * PROBLÈME RÉSOLU :
                     * React Navigation passe des props qui peuvent contenir des valeurs `null`,
                     * mais TouchableOpacity n'accepte que `undefined` (pas `null`) pour certaines props.
                     * Cela cause une erreur TypeScript de compatibilité de types.
                     * 
                     * SOLUTION :
                     * On extrait les props problématiques, on les normalise (null → undefined),
                     * et on les repasse explicitement à TouchableOpacity.
                     */
                    tabBarButton: (props) => {
                        /**
                         * Extraction des props qui peuvent être null
                         * On sépare ces props du reste pour pouvoir les traiter individuellement
                         */
                        const {
                            delayLongPress,    // Délai avant le long press (peut être null)
                            disabled,          // État désactivé (peut être null)
                            onBlur,            // Callback blur (peut être null)
                            onFocus,           // Callback focus (peut être null)
                            onLongPress,       // Callback long press (peut être null)
                            onPressIn,          // Callback press in (peut être null)
                            onPressOut,         // Callback press out (peut être null)
                            ref,                // Ref React (on ne le propage pas car incompatible avec TouchableOpacity)
                            ...restProps        // Toutes les autres props (on les propage telles quelles)
                        } = props;

                        return (
                            <TouchableOpacity
                                {...restProps}
                                /**
                                 * Normalisation des props : conversion null → undefined
                                 * 
                                 * Pourquoi ? TouchableOpacity attend `number | undefined` pour delayLongPress,
                                 * mais React Navigation peut passer `number | null | undefined`.
                                 * L'opérateur ?? convertit null en undefined.
                                 */
                                delayLongPress={delayLongPress ?? undefined}
                                disabled={disabled ?? undefined}
                                onBlur={onBlur ?? undefined}
                                onFocus={onFocus ?? undefined}
                                onLongPress={onLongPress ?? undefined}
                                onPressIn={onPressIn ?? undefined}
                                onPressOut={onPressOut ?? undefined}
                                /**
                                 * Style personnalisé pour le bouton Messay Pay
                                 * On combine le style par défaut (props.style) avec notre style custom
                                 */
                                style={[props.style, styles.messayPayButton]}
                                /**
                                 * Opacité lors du press (feedback visuel)
                                 */
                                activeOpacity={0.7}
                            >
                                {/* Conteneur principal du bouton Messay Pay */}
                                <View style={styles.messayPayContainer}>
                                    {/* Cercle orange qui apparaît quand l'onglet est sélectionné */}
                                    <View style={[styles.messayPayCircle, props.accessibilityState?.selected && styles.messayPayCircleActive]}>
                                        {/* Icône wallet dans le cercle */}
                                        <Image
                                            source={WalletIcon}
                                            style={styles.messayPayIcon}
                                            resizeMode="contain"
                                        />
                                    </View>
                                    {/* Label "Messay Pay" avec style conditionnel selon l'état actif/inactif */}
                                    <Text style={[styles.messayPayLabel, props.accessibilityState?.selected && styles.messayPayLabelActive]}>
                                        Messay Pay
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        );
                    },
                    tabBarIcon: () => null, // On gère l'icône dans le bouton personnalisé
                }}
            />

            {/* Onglet Carrières */}
            <Tab.Screen
                name="Carrières"
                component={CareersStack}
                options={{
                    tabBarLabel: 'Carrières',
                    /**
                     * Icône pour l'onglet Carrières
                     * Image affichée telle quelle, sans couleur pleine ajoutée
                     */
                    tabBarIcon: ({ size }) => (
                        <Image
                            source={CarriereIcon}
                            style={{ width: size, height: size }}
                            resizeMode="contain"
                        />
                    ),
                }}
            />

            {/* Onglet Profil utilisateur */}
            {/* <Tab.Screen
                name="Profil"
                component={Profile}
            /> */}
        </Tab.Navigator>
    );
}

/**
 * Styles pour le bouton personnalisé "Messay Pay"
 * 
 * Ces styles créent l'effet visuel du bouton central avec :
 * - Un cercle orange qui apparaît quand l'onglet est sélectionné
 * - Un label qui change de couleur selon l'état actif/inactif
 */
const styles = StyleSheet.create({
    /**
     * Style du bouton TouchableOpacity lui-même
     * flex: 1 permet au bouton de prendre tout l'espace disponible dans la tab bar
     */
    messayPayButton: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    /**
     * Conteneur interne qui centre le cercle et le label
     */
    messayPayContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    /**
     * Style du cercle (état par défaut = transparent)
     * C'est un cercle de 50x50px qui devient orange quand l'onglet est sélectionné
     */
    messayPayCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,              // Cercle parfait (rayon = moitié de la largeur/hauteur)
        backgroundColor: 'transparent',  // Transparent par défaut
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 4,                // Espacement entre le cercle et le label
    },
    /**
     * Style appliqué au cercle quand l'onglet est actif
     * Le cercle devient orange (#FF6B35) pour indiquer la sélection
     */
    messayPayCircleActive: {
        backgroundColor: '#FF6B35', // Couleur orange de la marque
    },
    /**
     * Style de l'icône dans le cercle Messay Pay
     * Taille de l'icône : 24x24px pour s'adapter au cercle de 50x50px
     * Pas de tintColor : on laisse les couleurs naturelles de l'image
     */
    messayPayIcon: {
        width: 24,
        height: 24,
        // Pas de tintColor : affichage des couleurs naturelles
    },
    /**
     * Style du label "Messay Pay" (état inactif)
     * Gris par défaut pour correspondre aux autres onglets inactifs
     */
    messayPayLabel: {
        fontSize: 12,
        fontWeight: '500',
        color: '#8E8E93', // Gris pour l'état inactif
    },
    /**
     * Style du label quand l'onglet est actif
     * Le texte devient orange et plus gras pour indiquer la sélection
     */
    messayPayLabelActive: {
        color: '#FF6B35',  // Orange pour correspondre au cercle actif
        fontWeight: '600', // Plus gras pour plus de visibilité
    },
});
