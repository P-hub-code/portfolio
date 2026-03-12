/**
 * SplashScreen.tsx
 * ---------------------------------
 * Écran de chargement avec messay-logo-2 (visuel jaune) en plein écran
 */

import React, { useEffect, useState } from 'react';
import {
    View,
    StyleSheet,
    Image,
    Dimensions,
} from 'react-native';

const Logo2 = require('../../assets/images/messay-logo-2.png');

const { width, height } = Dimensions.get('window');

interface SplashScreenProps {
    onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
    const [imageLoaded, setImageLoaded] = useState(false);

    useEffect(() => {
        if (imageLoaded) {
            const timer = setTimeout(() => onFinish(), 2000);
            return () => clearTimeout(timer);
        }
    }, [imageLoaded, onFinish]);

    return (
        <View style={styles.container}>
            <Image
                source={Logo2}
                style={styles.logo}
                resizeMode="cover"
                onLoad={() => setImageLoaded(true)}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    logo: {
        width,
        height,
    },
});

