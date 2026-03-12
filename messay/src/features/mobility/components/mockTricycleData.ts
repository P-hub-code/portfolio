/**
 * mockTricycleData.ts
 * ---------------------------------
 * Données mockées pour les tricycles
 * 
 * RÔLE :
 * - Fournir des données de test pour le développement
 * - Définir la structure exacte des données attendues du backend
 * - Plus tard, ces données seront remplacées par les appels API
 * 
 * CONTRAT BACKEND :
 * Cette structure définit exactement ce que le backend devra fournir
 */

import { TricycleData } from './TricycleCard';

/**
 * Import de l'image du tricycle
 * CHEMIN : src/assets/services/tricycle.png
 */
const TricycleImage = require('../../../assets/services/tricycle.png');

/**
 * Données mockées des tricycles disponibles
 * Personnalisées pour la Côte d'Ivoire (Abidjan)
 * 
 * LIEUX RÉELS D'ABIDJAN :
 * - Plateau : Centre-ville d'Abidjan
 * - Cocody : Quartier résidentiel et commercial
 * - Yopougon : Grand quartier populaire
 * - Marcory : Quartier commercial
 * - Treichville : Quartier animé avec marché
 * - Deux-Plateaux : Quartier résidentiel chic
 * - Adjamé : Grand marché et hub de transport
 * - Riviera : Quartier résidentiel
 */
export const MOCK_TRICYCLES: TricycleData[] = [
    {
        id: '1',
        driverName: 'Kouamé Yves',
        departure: 'Plateau',
        destination: 'Cocody',
        estimatedTime: '18 min',
        distance: '6.5 km',
        price: 2500,
        priceRange: '±100F',
        note: 'École ou travail',
        image: TricycleImage, // Image du tricycle
    },
    {
        id: '2',
        driverName: 'Aka Kouassi',
        departure: 'Adjamé',
        destination: 'Yopougon',
        estimatedTime: '25 min',
        distance: '8.2 km',
        price: 3000,
        note: 'École ou travail',
        image: TricycleImage, // Image du tricycle
    },
    {
        id: '3',
        driverName: 'Bamba Mamadou',
        departure: 'Deux-Plateaux',
        destination: 'Marcory',
        estimatedTime: '15 min',
        distance: '5.8 km',
        price: 2200,
        image: TricycleImage, // Image du tricycle
    },
    {
        id: '4',
        driverName: 'Kouassi Jean',
        departure: 'Treichville',
        destination: 'Riviera',
        estimatedTime: '20 min',
        distance: '7.3 km',
        price: 2800,
        priceRange: '±150F',
        note: 'École ou travail',
        image: TricycleImage, // Image du tricycle
    },
    {
        id: '5',
        driverName: 'Traoré Amadou',
        departure: 'Cocody',
        destination: 'Plateau',
        estimatedTime: '12 min',
        distance: '4.5 km',
        price: 2000,
        image: TricycleImage, // Image du tricycle
    },
];

