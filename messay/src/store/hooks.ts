/**
 * hooks.ts
 * ---------------------------------
 * Hooks Redux typés pour une utilisation type-safe
 * 
 * RÔLE :
 * - Fournir useSelector et useDispatch typés avec les types de notre store
 * - Éviter de répéter les types à chaque utilisation
 * - Améliorer l'expérience développeur avec l'autocomplétion
 * 
 * UTILISATION :
 * Au lieu de :
 *   const dispatch = useDispatch<AppDispatch>();
 *   const balance = useSelector((state: RootState) => state.wallet.balance);
 * 
 * On peut faire :
 *   const dispatch = useAppDispatch();
 *   const balance = useAppSelector((state) => state.wallet.balance);
 */

import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from './index';

/**
 * Hook useDispatch typé
 * 
 * Remplace useDispatch() standard pour avoir le type AppDispatch automatiquement.
 * 
 * Exemple d'utilisation :
 * const dispatch = useAppDispatch();
 * dispatch(setBalance(5000)); // TypeScript connaît toutes les actions disponibles
 */
export const useAppDispatch = () => useDispatch<AppDispatch>();

/**
 * Hook useSelector typé
 * 
 * Remplace useSelector() standard pour avoir le type RootState automatiquement.
 * 
 * Exemple d'utilisation :
 * const balance = useAppSelector((state) => state.wallet.balance);
 * const user = useAppSelector((state) => state.user.currentUser);
 * 
 * TypeScript connaît toute la structure du state et offre l'autocomplétion.
 */
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;







