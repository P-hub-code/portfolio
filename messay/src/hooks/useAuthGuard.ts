/**
 * useAuthGuard.ts
 * ---------------------------------
 * Hook pour déclencher le flux d'authentification uniquement quand
 * l'utilisateur veut effectuer une action sensible (Commander / Réserver).
 *
 * Pattern :
 * - L'utilisateur peut explorer l'app sans être connecté
 * - Dès qu'il clique sur une action critique, on vérifie l'auth
 * - Si non authentifié → navigation vers le stack Auth (PhoneInput)
 */

import { useCallback } from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../store/hooks';

export function useAuthGuard() {
    const navigation = useNavigation();
    const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);

    /**
     * Vérifie si l'utilisateur est authentifié.
     *
     * - Si NON authentifié :
     *   - Ouvre le stack Auth en modal (écran PhoneInput)
     *   - Retourne false pour bloquer l'action en cours
     *
     * - Si OUI authentifié :
     *   - Retourne true pour autoriser l'action
     */
    const requireAuth = useCallback((): boolean => {
        if (!isAuthenticated) {
            // @ts-ignore : on ne typage pas finement la navigation ici
            navigation.navigate('Auth', { screen: 'PhoneInput' });
            return false;
        }
        return true;
    }, [isAuthenticated, navigation]);

    return {
        isAuthenticated,
        requireAuth,
    };
}


