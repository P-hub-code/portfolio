/**
 * NameInputScreen.tsx
 * ---------------------------------
 * Écran de mise à jour du nom complet (nom et prénoms)
 * - Charge le profil avec GET /api/user au montage
 * - Préremplit fullName
 * - Mise à jour avec PUT /api/user { fullName }
 * - Gère 401 → redirection écran connexion
 * - Gère 422 → affichage des erreurs sous le champ
 */

import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    ActivityIndicator,
    Alert,
} from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../../store/auth/auth.slice';
import { setCurrentUser } from '../../../store/user/user.slice';
import { getUser, updateUserProfile } from '../../../services/api/user.api';
import SuccessModal from '../../../components/SuccessModal';

const MAX_FULLNAME_LENGTH = 255;

type NameInputParams = {
    phoneNumber?: string;
    token?: string;
};

export default function NameInputScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute<RouteProp<Record<string, NameInputParams>, string>>();
    const { phoneNumber, token } = route.params || {};
    const [fullName, setFullName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetchingUser, setIsFetchingUser] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [fieldError, setFieldError] = useState<string | null>(null);
    const [displayPhone, setDisplayPhone] = useState<string | null>(null);

    /** Charger le profil au montage (GET /api/user) */
    useEffect(() => {
        if (!token) return;
        setIsFetchingUser(true);
        getUser(token)
            .then((res) => {
                if (res?.user?.fullName) setFullName(res.user.fullName);
                if (res?.user?.phone) setDisplayPhone(res.user.phone);
            })
            .catch((err: Error & { status?: number }) => {
                if (err?.status === 401) {
                    (navigation as any).reset({
                        index: 0,
                        routes: [{ name: 'PhoneInput' }],
                    });
                }
            })
            .finally(() => setIsFetchingUser(false));
    }, [token, navigation]);

    /** Validation : au moins 1 caractère non vide, max 255 */
    const trimmed = fullName.trim();
    const isValidName = trimmed.length >= 1 && trimmed.length <= MAX_FULLNAME_LENGTH;

    const handleFullNameChange = (text: string) => {
        if (text.length <= MAX_FULLNAME_LENGTH) setFullName(text);
        setFieldError(null);
    };

    /**
     * Gestion de la soumission
     * PUT /api/user { fullName }
     */
    const handleContinue = async () => {
        setFieldError(null);
        if (!isValidName) return;

        const fullNameValue = trimmed;
        const firstName = fullNameValue.split(' ')[0] || fullNameValue;
        const lastName = fullNameValue.split(' ').slice(1).join(' ').trim() || '';

        const userData = {
            id: 'user',
            firstName,
            lastName,
            email: '',
            phone: phoneNumber || displayPhone || '',
        };

        if (token) {
            setIsLoading(true);
            try {
                const res = await updateUserProfile(token, {
                    fullName: fullNameValue,
                });
                const u = res?.user;
                const finalUser = {
                    id: String(u?.id ?? userData.id),
                    firstName: u?.fullName?.split(' ')[0] ?? firstName,
                    lastName: u?.fullName?.split(' ').slice(1).join(' ') ?? lastName,
                    email: '',
                    phone: u?.phone ?? phoneNumber ?? displayPhone ?? '',
                };
                dispatch(loginSuccess({ token, user: finalUser }));
                dispatch(setCurrentUser(finalUser));
                setShowSuccessModal(true);
            } catch (err: unknown) {
                const e = err as Error & {
                    status?: number;
                    data?: { errors?: { fullName?: string[] } };
                };
                if (e?.status === 401) {
                    (navigation as any).reset({
                        index: 0,
                        routes: [{ name: 'PhoneInput' }],
                    });
                    return;
                }
                if (e?.status === 422 && e?.data?.errors?.fullName?.length) {
                    setFieldError(e.data.errors.fullName[0]);
                    return;
                }
                Alert.alert('Erreur', e?.message ?? 'Une erreur est survenue.');
            } finally {
                setIsLoading(false);
            }
        } else {
            dispatch(
                loginSuccess({
                    token: 'local_' + Date.now(),
                    user: userData,
                })
            );
            dispatch(setCurrentUser(userData));
            setShowSuccessModal(true);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity
                        style={styles.backButton}
                        onPress={() => navigation.goBack()}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.backIcon}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.logoContainer}>
                        <Text style={styles.logo}>Messay</Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Titre principal */}
                <Text style={styles.mainTitle}>Quel est votre nom complet ?</Text>

                {displayPhone ? (
                    <Text style={styles.phoneLabel}>Téléphone : {displayPhone}</Text>
                ) : null}

                {/* Input nom */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.nameInput}
                        placeholder="Nom et prénoms"
                        placeholderTextColor="#999"
                        value={fullName}
                        onChangeText={handleFullNameChange}
                        autoCapitalize="words"
                        autoFocus
                        maxLength={MAX_FULLNAME_LENGTH}
                        editable={!isFetchingUser}
                    />
                    <View
                        style={[
                            styles.underline,
                            fullName && styles.underlineActive,
                            fieldError && styles.underlineError,
                        ]}
                    />
                    {fieldError ? (
                        <Text style={styles.fieldError}>{fieldError}</Text>
                    ) : null}
                    <Text style={styles.charCount}>
                        {fullName.length}/{MAX_FULLNAME_LENGTH}
                    </Text>
                </View>

                {/* Lien informatif */}
                <TouchableOpacity style={styles.whyLink} activeOpacity={0.7}>
                    <Text style={styles.whyLinkText}>Pourquoi avons-nous besoin de ça ?</Text>
                </TouchableOpacity>

                {/* Bouton Continuer (affiché seulement si le nom est valide) */}
                {(isValidName || isLoading) && (
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            isLoading && styles.continueButtonDisabled,
                        ]}
                        onPress={handleContinue}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.continueButtonText}>
                                Continuer
                            </Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>

            <SuccessModal
                visible={showSuccessModal}
                title="Connexion réussie !"
                message="Bienvenue sur Messay."
                onClose={() => setShowSuccessModal(false)}
            />
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 60,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    backIcon: {
        fontSize: 24,
        color: '#000000',
    },
    logoContainer: {
        alignItems: 'center',
    },
    logo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF6B35',
    },
    headerSpacer: {
        width: 40,
    },
    mainTitle: {
        fontSize: 28,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 40,
        textAlign: 'center',
    },
    phoneLabel: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 16,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 30,
    },
    nameInput: {
        fontSize: 18,
        color: '#000000',
        paddingVertical: 12,
        paddingHorizontal: 0,
        backgroundColor: 'transparent',
    },
    fieldError: {
        fontSize: 12,
        color: '#E53935',
        marginTop: 6,
    },
    charCount: {
        fontSize: 12,
        color: '#999999',
        marginTop: 4,
        textAlign: 'right',
    },
    underline: {
        height: 2,
        backgroundColor: '#E0E0E0',
        marginTop: 8,
    },
    underlineActive: {
        backgroundColor: '#FF6B35',
    },
    underlineError: {
        backgroundColor: '#E53935',
    },
    whyLink: {
        marginBottom: 40,
        alignSelf: 'center',
    },
    whyLinkText: {
        fontSize: 14,
        color: '#FF6B35',
        textDecorationLine: 'underline',
    },
    continueButton: {
        backgroundColor: '#FF6B35',
        borderRadius: 12,
        paddingVertical: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    continueButtonDisabled: {
        opacity: 0.7,
    },
    continueButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
});

