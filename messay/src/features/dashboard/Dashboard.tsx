import React from 'react';
import { View, ScrollView, StyleSheet, TextInput, TouchableOpacity, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import ServicesGrid from './components/ServicesGrid';
import EventBanner from './components/EventBanner';

export default function Dashboard() {
    const navigation = useNavigation();

    const handleMenuPress = () => {
        (navigation.getParent() as any)?.navigate('Profile');
    };

    return (
        <View style={styles.container}>
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}
            >
                {/* Barre de recherche + hamburger */}
                <View style={styles.headerRow}>
                    <View style={styles.searchBarContainer}>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Saisir la destination"
                            placeholderTextColor="#999999"
                        />
                        <TouchableOpacity style={styles.searchIconContainer} activeOpacity={0.7}>
                            <Text style={styles.searchIcon}>🔍</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity
                        style={styles.menuButton}
                        onPress={handleMenuPress}
                        activeOpacity={0.7}
                    >
                        <View style={styles.menuLine} />
                        <View style={styles.menuLine} />
                        <View style={styles.menuLine} />
                    </TouchableOpacity>
                </View>

                {/* Services */}
                <ServicesGrid />

                {/* Fil d'actualité avec une seule carte événement */}
                <View style={styles.feedSection}>
                    <Text style={styles.feedTitle}>Fil d'actualité</Text>
                    <EventBanner />
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
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 20,
        marginTop: 15,
        marginBottom: 15,
        gap: 12,
    },
    searchBarContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    menuButton: {
        width: 44,
        height: 44,
        backgroundColor: '#FFFFFF',
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 4,
        elevation: 2,
    },
    menuLine: {
        width: 20,
        height: 2,
        backgroundColor: '#000000',
        marginVertical: 2,
        borderRadius: 1,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
        color: '#000000',
        paddingVertical: 0,
    },
    searchIconContainer: {
        marginLeft: 8,
    },
    searchIcon: {
        fontSize: 20,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 120,
    },
    feedSection: {
        marginTop: 64,
        paddingHorizontal: 20,
    },
    feedTitle: {
        fontSize: 20,
        fontWeight: '600',
        color: '#000000',
        marginBottom: 16,
    },
});

