/**
 * ProfileScreen.tsx
 * ---------------------------------
 * Écran de profil utilisateur avec menu
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector } from '../../store/hooks';

export default function ProfileScreen() {
    const navigation = useNavigation();
    const currentUser = useAppSelector((state) => state.user.currentUser);

    // Données utilisateur (fallback si pas connecté)
    const userName = currentUser?.firstName || 'Sylla';
    const phoneNumber = currentUser?.phone || '';
    const avatar = currentUser?.avatar || null;

    const menuItems = [
        {
            id: 'promo',
            icon: '%',
            title: 'Réductions et cadeaux',
            subtitle: 'Saisir un code promotionnel',
            onPress: () => console.log('Promo code'),
        },
        {
            id: 'payment',
            icon: '💳',
            title: 'Modes de paiement',
            subtitle: 'Orange',
            onPress: () => console.log('Payment methods'),
        },
        {
            id: 'history',
            icon: '📋',
            title: 'Historique',
            onPress: () => console.log('History'),
        },
        {
            id: 'addresses',
            icon: '📍',
            title: 'Mes adresses',
            onPress: () => console.log('Addresses'),
        },
        {
            id: 'assistance',
            icon: '🎧',
            title: 'Assistance',
            onPress: () => console.log('Assistance'),
        },
        {
            id: 'driver',
            icon: '⭐',
            title: 'Travaillez comme conducteur',
            isDark: true,
            onPress: () => console.log('Become driver'),
        },
        {
            id: 'security',
            icon: '🛡️',
            title: 'Sécurité',
            onPress: () => console.log('Security'),
        },
        {
            id: 'settings',
            icon: '⚙️',
            title: 'Paramètres',
            onPress: () => console.log('Settings'),
        },
        {
            id: 'info',
            icon: 'ℹ️',
            title: 'Informations',
            onPress: () => console.log('Info'),
        },
    ];

    return (
        <View style={styles.container}>
            {/* Header avec bouton retour */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={styles.backIcon}>←</Text>
                </TouchableOpacity>
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* Section Profil Utilisateur */}
                <View style={styles.profileSection}>
                    <View style={styles.avatarContainer}>
                        {avatar ? (
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        ) : (
                            <View style={styles.avatarPlaceholder}>
                                <Text style={styles.avatarPlaceholderText}>👤</Text>
                            </View>
                        )}
                    </View>
                    <View style={styles.badge}>
                        <Text style={styles.badgeText}>Excellent</Text>
                    </View>
                    <TouchableOpacity style={styles.nameContainer} activeOpacity={0.7}>
                        <Text style={styles.userName}>{userName}</Text>
                        <Text style={styles.editIcon}>›</Text>
                    </TouchableOpacity>
                    <Text style={styles.phoneNumber}>{phoneNumber}</Text>
                </View>

                {/* Menu Items */}
                <View style={styles.menuContainer}>
                    {menuItems.map((item) => (
                        <TouchableOpacity
                            key={item.id}
                            style={[
                                styles.menuItem,
                                item.isDark && styles.menuItemDark,
                            ]}
                            onPress={item.onPress}
                            activeOpacity={0.7}
                        >
                            <View style={styles.menuItemLeft}>
                                <View
                                    style={[
                                        styles.iconContainer,
                                        item.isDark && styles.iconContainerDark,
                                    ]}
                                >
                                    <Text style={styles.iconText}>{item.icon}</Text>
                                </View>
                                <View style={styles.menuItemTextContainer}>
                                    <Text
                                        style={[
                                            styles.menuItemTitle,
                                            item.isDark && styles.menuItemTitleDark,
                                        ]}
                                    >
                                        {item.title}
                                    </Text>
                                    {item.subtitle && (
                                        <Text style={styles.menuItemSubtitle}>
                                            {item.subtitle}
                                        </Text>
                                    )}
                                </View>
                            </View>
                            <Text
                                style={[
                                    styles.arrowIcon,
                                    item.isDark && styles.arrowIconDark,
                                ]}
                            >
                                ›
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingTop: 15,
        paddingBottom: 10,
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
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 24,
    },
    profileSection: {
        alignItems: 'center',
        paddingTop: 20,
        paddingBottom: 30,
    },
    avatarContainer: {
        marginBottom: 12,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
    },
    avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#E0E0E0',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarPlaceholderText: {
        fontSize: 50,
    },
    badge: {
        backgroundColor: '#4CAF50',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 12,
    },
    badgeText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    nameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        color: '#000000',
        marginRight: 8,
    },
    editIcon: {
        fontSize: 20,
        color: '#000000',
    },
    phoneNumber: {
        fontSize: 14,
        color: '#666666',
    },
    menuContainer: {
        paddingHorizontal: 20,
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
    },
    menuItemDark: {
        backgroundColor: '#2C2C2E',
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 8,
        backgroundColor: '#F5F5F5',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    iconContainerDark: {
        backgroundColor: '#3A3A3C',
    },
    iconText: {
        fontSize: 20,
    },
    menuItemTextContainer: {
        flex: 1,
    },
    menuItemTitle: {
        fontSize: 16,
        fontWeight: '500',
        color: '#000000',
        marginBottom: 4,
    },
    menuItemTitleDark: {
        color: '#FFFFFF',
    },
    menuItemSubtitle: {
        fontSize: 14,
        color: '#666666',
    },
    arrowIcon: {
        fontSize: 24,
        color: '#666666',
    },
    arrowIconDark: {
        color: '#FF6B35',
    },
});

