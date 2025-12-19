/**
 * EtiketKontrol - Kamera/Galeri Butonu Bileşeni
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../styles/theme';

/**
 * Kamera ve Galeri Erişim Butonu
 */
export default function CameraButton({ onImageSelected, disabled = false }) {
    /**
     * Kamera ile fotoğraf çek
     */
    const takePhoto = async () => {
        try {
            // Kamera izni iste
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'İzin Gerekli',
                    'Fotoğraf çekmek için kamera izni vermeniz gerekiyor.',
                    [{ text: 'Tamam' }]
                );
                return;
            }

            // Kamerayı aç
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                onImageSelected({
                    uri: asset.uri,
                    base64: asset.base64,
                    width: asset.width,
                    height: asset.height,
                });
            }
        } catch (error) {
            console.error('Kamera hatası:', error);
            Alert.alert('Hata', 'Fotoğraf çekilirken bir hata oluştu.');
        }
    };

    /**
     * Galeriden fotoğraf seç
     */
    const pickImage = async () => {
        try {
            // Galeri izni iste
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'İzin Gerekli',
                    'Galeriye erişmek için izin vermeniz gerekiyor.',
                    [{ text: 'Tamam' }]
                );
                return;
            }

            // Galeriyi aç
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                quality: 0.8,
                base64: true,
                allowsEditing: true,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets[0]) {
                const asset = result.assets[0];
                onImageSelected({
                    uri: asset.uri,
                    base64: asset.base64,
                    width: asset.width,
                    height: asset.height,
                });
            }
        } catch (error) {
            console.error('Galeri hatası:', error);
            Alert.alert('Hata', 'Fotoğraf seçilirken bir hata oluştu.');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Ürün Etiketini Tara</Text>
            <Text style={styles.subtitle}>
                İçindekiler bölümünün fotoğrafını çekin veya galeriden seçin
            </Text>

            <View style={styles.buttonContainer}>
                {/* Kamera Butonu */}
                <TouchableOpacity
                    style={[styles.button, styles.cameraButton]}
                    onPress={takePhoto}
                    disabled={disabled}
                    activeOpacity={0.8}
                >
                    <View style={styles.iconWrapper}>
                        <Ionicons name="camera" size={32} color={colors.textWhite} />
                    </View>
                    <Text style={styles.buttonText}>Fotoğraf Çek</Text>
                </TouchableOpacity>

                {/* Galeri Butonu */}
                <TouchableOpacity
                    style={[styles.button, styles.galleryButton]}
                    onPress={pickImage}
                    disabled={disabled}
                    activeOpacity={0.8}
                >
                    <View style={[styles.iconWrapper, styles.galleryIcon]}>
                        <Ionicons name="images" size={32} color={colors.primary} />
                    </View>
                    <Text style={[styles.buttonText, styles.galleryButtonText]}>
                        Galeriden Seç
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.lg,
    },

    title: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        textAlign: 'center',
        marginBottom: spacing.xs,
    },

    subtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        textAlign: 'center',
        marginBottom: spacing.lg,
    },

    buttonContainer: {
        flexDirection: 'row',
        gap: spacing.md,
    },

    button: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: spacing.lg,
        borderRadius: borderRadius.lg,
    },

    cameraButton: {
        backgroundColor: colors.primary,
    },

    galleryButton: {
        backgroundColor: colors.surface,
        borderWidth: 2,
        borderColor: colors.primary,
    },

    iconWrapper: {
        width: 64,
        height: 64,
        borderRadius: borderRadius.full,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: spacing.sm,
    },

    galleryIcon: {
        backgroundColor: colors.safeBg,
    },

    buttonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textWhite,
    },

    galleryButtonText: {
        color: colors.primary,
    },
});
