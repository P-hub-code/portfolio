/**
 * OTPVerificationScreen.tsx
 * ---------------------------------
 * Écran de vérification du code OTP (6 chiffres).
 *
 * Étape 2 du flux :
 * 1. PhoneInputScreen  → saisie du numéro
 * 2. OTPVerificationScreen → saisie du code
 * 3. NameInputScreen  → saisie du nom complet
 */

import React, { useState, useRef, useEffect } from 'react';
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
import {
    verifyPhoneOtp,
    resendPhoneOtp,
    getPendingConfirmation,
} from '../../../services/firebase/firebase-phone-auth';
import SuccessModal from '../../../components/SuccessModal';

type OTPRouteParams = {
    phoneNumber?: string;
};

export default function OTPVerificationScreen() {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const route = useRoute<RouteProp<Record<string, OTPRouteParams>, string>>();
    const phoneNumber = route.params?.phoneNumber || '+225 00 00 00 00 00';

    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(60);
    const [canResend, setCanResend] = useState(false);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const inputRefs = useRef<Array<TextInput | null>>([]);

    useEffect(() => {
        const timer = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    setCanResend(true);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const isOtpComplete = otp.every((digit) => digit !== '');

    const handleOtpChange = (text: string, index: number) => {
        const numeric = text.replace(/[^0-9]/g, '');
        if (numeric.length > 1) {
            return;
        }

        const next = [...otp];
        next[index] = numeric;
        setOtp(next);

        if (numeric && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyPress = (key: string, index: number) => {
        if (key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const handleVerify = async () => {
        if (!isOtpComplete) return;
        const confirmation = getPendingConfirmation();
        if (!confirmation) {
            Alert.alert(
                'Erreur',
                'Aucune demande OTP en cours. Retournez à l\'écran précédent pour renvoyer le code.'
            );
            return;
        }
        const code = otp.join('');
        setIsVerifying(true);
        try {
            const credential = await verifyPhoneOtp(code);
            const user = credential.user;
            const token = await user.getIdToken();
            const phone = user.phoneNumber || phoneNumber;
            const hasDisplayName = !!(user.displayName && user.displayName.trim());
            const userData = {
                id: user.uid,
                firstName: user.displayName?.split(' ')[0] || '',
                lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
                email: user.email || '',
                phone,
            };
            if (!hasDisplayName) {
                (navigation as any).navigate('NameInput', {
                    phoneNumber: phone,
                    token,
                });
                return;
            }
            dispatch(
                loginSuccess({
                    token,
                    user: userData,
                })
            );
            dispatch(setCurrentUser(userData));
            setShowSuccessModal(true);
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Code invalide ou expiré';
            Alert.alert('Erreur', message);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (!canResend) return;
        setIsResending(true);
        try {
            await resendPhoneOtp(phoneNumber);
            setCountdown(60);
            setCanResend(false);
            setOtp(['', '', '', '', '', '']);
            inputRefs.current[0]?.focus();
            Alert.alert('Succès', 'Un nouveau code a été envoyé par SMS.');
        } catch (err) {
            const message =
                err instanceof Error ? err.message : 'Impossible de renvoyer le code';
            Alert.alert('Erreur', message);
        } finally {
            setIsResending(false);
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
                    <Text style={styles.logo}>Messay</Text>
                    <View style={styles.headerSpacer} />
                </View>

                {/* Titre */}
                <Text style={styles.mainTitle}>SAISISSEZ LE CODE À 6 CHIFFRES</Text>
                <Text style={styles.subtitle}>
                    Nous l'avons envoyé par SMS au {phoneNumber}
                </Text>

                {/* Carte info */}
                <View style={styles.infoCard}>
                    <Text style={styles.infoIcon}>💬</Text>
                    <View style={styles.infoTextContainer}>
                        <Text style={styles.infoTitle}>Consultez vos messages</Text>
                        <Text style={styles.infoSubtitle}>
                            Le message n'est peut-être pas accompagné d'un son de notification.
                        </Text>
                    </View>
                </View>

                {/* Champs OTP */}
                <View style={styles.otpContainer}>
                    {otp.map((digit, index) => (
                        <TextInput
                            key={index}
                            ref={(ref) => {
                            inputRefs.current[index] = ref;
                        }}
                            style={[styles.otpInput, digit && styles.otpInputFilled]}
                            value={digit}
                            onChangeText={(text) => handleOtpChange(text, index)}
                            onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
                            keyboardType="number-pad"
                            maxLength={1}
                            selectTextOnFocus
                        />
                    ))}
                </View>

                {/* Renvoi code */}
                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>
                        Vous ne l'avez pas reçu ? {formatTime(countdown)}
                    </Text>
                    <TouchableOpacity
                        style={[
                            styles.resendButton,
                            (!canResend || isResending) &&
                                styles.resendButtonDisabled,
                        ]}
                        onPress={handleResend}
                        disabled={!canResend || isResending}
                        activeOpacity={0.7}
                    >
                        <Text
                            style={[
                                styles.resendButtonLabel,
                                !canResend && styles.resendButtonLabelDisabled,
                            ]}
                        >
                            Renvoyer le code par SMS
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Bouton Continuer */}
                {isOtpComplete && (
                    <TouchableOpacity
                        style={[
                            styles.continueButton,
                            (isVerifying || isResending) &&
                                styles.continueButtonDisabled,
                        ]}
                        onPress={handleVerify}
                        disabled={isVerifying}
                        activeOpacity={0.8}
                    >
                        {isVerifying ? (
                            <ActivityIndicator
                                color="#FFFFFF"
                                size="small"
                            />
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
        justifyContent: 'space-between',
        marginBottom: 40,
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
    logo: {
        fontSize: 24,
        fontWeight: '700',
        color: '#FF6B35',
    },
    headerSpacer: {
        width: 40,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: '700',
        color: '#000000',
        textAlign: 'center',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#666666',
        textAlign: 'center',
        marginBottom: 24,
    },
    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F5F5F5',
        borderRadius: 12,
        padding: 16,
        marginBottom: 32,
        borderWidth: 1,
        borderColor: '#FFE0CC',
    },
    infoIcon: {
        fontSize: 24,
        marginRight: 12,
    },
    infoTextContainer: {
        flex: 1,
    },
    infoTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 4,
    },
    infoSubtitle: {
        fontSize: 12,
        color: '#666666',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 32,
    },
    otpInput: {
        width: 45,
        height: 60,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#FF6B35',
        backgroundColor: '#FFFFFF',
        textAlign: 'center',
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
    },
    otpInputFilled: {
        borderColor: '#FF6B35',
    },
    resendContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    resendText: {
        fontSize: 14,
        color: '#666666',
        marginBottom: 12,
    },
    resendButton: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        backgroundColor: '#E8E8E8',
    },
    resendButtonDisabled: {
        opacity: 0.5,
    },
    resendButtonLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#555555',
    },
    resendButtonLabelDisabled: {
        color: '#999999',
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


