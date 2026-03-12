/**
 * PhoneInputScreen.tsx
 * ---------------------------------
 * Écran de saisie du numéro de téléphone
 * Première étape du processus d'authentification.
 *
 * Règles métier :
 * - Numéro au format Côte d'Ivoire : 10 chiffres sans indicatif
 * - Indicatif affiché : +225
 * - Bouton "Continuer" visible uniquement si le numéro est valide
 */

import React, { useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { sendPhoneOtp } from '../../../services/firebase/firebase-phone-auth';

export default function PhoneInputScreen() {
    const navigation = useNavigation();
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    /**
     * Validation du numéro de téléphone
     * Format attendu : 10 chiffres (sans l'indicatif +225)
     * Format Côte d'Ivoire : 07 12 55 66 66 → "0712556666"
     */
    const isValidPhoneNumber = phoneNumber.length === 10 && /^\d+$/.test(phoneNumber);

    /**
     * Gestion du bouton continuer
     * Firebase envoie l'OTP par SMS au numéro (temps réel).
     */
    const handleContinue = async () => {
        if (!isValidPhoneNumber) return;
        const fullPhone = `+225${phoneNumber}`;
        setIsLoading(true);
        try {
            await sendPhoneOtp(fullPhone);
            (navigation as any).navigate('OTPVerification', {
                phoneNumber: fullPhone,
            });
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Erreur réseau';
            Alert.alert('Erreur', message);
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Formatage du numéro de téléphone
     * - Garde uniquement les chiffres
     * - Limite à 10 chiffres
     */
    const formatPhoneNumber = (text: string) => {
        const cleaned = text.replace(/\D/g, '');
        const limited = cleaned.slice(0, 10);
        return limited;
    };

    const handlePhoneChange = (text: string) => {
        const formatted = formatPhoneNumber(text);
        setPhoneNumber(formatted);
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
                    <View style={styles.headerCenter}>
                        <Text style={styles.headerLogo}>Messay</Text>
                    </View>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Titre principal */}
                <Text style={styles.mainTitle}>SAISISSEZ VOTRE NUMÉRO DE TÉLÉPHONE</Text>
                <Text style={styles.subtitle}>
                    Nous enverrons un code de confirmation par SMS à ce numéro.
                </Text>

                {/* Input téléphone */}
                <View style={styles.inputContainer}>
                    <View style={styles.countryCodeContainer}>
                        <Text style={styles.flag}>🇨🇮</Text>
                        <Text style={styles.countryCode}>+225</Text>
                    </View>
                    <View style={styles.separator} />
                    <TextInput
                        style={styles.phoneInput}
                        placeholder="00 00 00 00 00"
                        placeholderTextColor="#999"
                        value={phoneNumber}
                        onChangeText={handlePhoneChange}
                        keyboardType="phone-pad"
                        maxLength={10}
                        autoFocus
                    />
                    {phoneNumber.length > 0 && (
                        <TouchableOpacity
                            style={styles.clearButton}
                            onPress={() => setPhoneNumber('')}
                            activeOpacity={0.7}
                        >
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>

                {/* Conditions d'utilisation */}
                <View style={styles.termsContainer}>
                    <Text style={styles.termsText}>
                        En continuant, j'accepte les{' '}
                        <Text style={styles.termsLink}>Conditions d'utilisation</Text>,{' '}
                        <Text style={styles.termsLink}>Contrat de licence Messay</Text>,{' '}
                        <Text style={styles.termsLink}>Politique de confidentialité</Text>
                    </Text>
                </View>

                {/* Bouton Continuer (affiché seulement si le numéro est valide) */}
                {isValidPhoneNumber && (
                    <TouchableOpacity
                        style={[styles.continueButton, isLoading && styles.continueButtonDisabled]}
                        onPress={handleContinue}
                        disabled={isLoading}
                        activeOpacity={0.8}
                    >
                        {isLoading ? (
                            <ActivityIndicator color="#FFFFFF" size="small" />
                        ) : (
                            <Text style={styles.continueButtonText}>Continuer</Text>
                        )}
                    </TouchableOpacity>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFFFF',
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 40,
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    headerCenter: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    headerLogo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF6B35',
    },
    headerSpacer: {
        width: 40,
    },
    backIcon: {
        fontSize: 24,
        color: '#000000',
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        marginBottom: 12,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 40,
        textAlign: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 30,
        borderWidth: 2,
        borderColor: '#FF6B35',
    },
    countryCodeContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 12,
    },
    separator: {
        width: 1,
        height: 24,
        backgroundColor: '#E0E0E0',
        marginRight: 12,
    },
    flag: {
        fontSize: 24,
        marginRight: 8,
    },
    countryCode: {
        fontSize: 16,
        fontWeight: '600',
        color: '#000000',
    },
    phoneInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
        fontWeight: '500',
    },
    clearButton: {
        width: 24,
        height: 24,
        justifyContent: 'center',
        alignItems: 'center',
    },
    clearIcon: {
        fontSize: 18,
        color: '#999999',
    },
    termsContainer: {
        marginBottom: 30,
    },
    termsText: {
        fontSize: 12,
        color: '#999999',
        textAlign: 'center',
        lineHeight: 18,
    },
    termsLink: {
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


