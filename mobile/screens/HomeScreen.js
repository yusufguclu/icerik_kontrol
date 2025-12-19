/**
 * EtiketKontrol - Ana Ekran
 */

import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    ActivityIndicator,
    Alert,
    Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../styles/theme';

// Bileşenler
import AllergySelector from '../components/AllergySelector';
import CameraButton from '../components/CameraButton';
import ResultCard from '../components/ResultCard';

// API Servisi
import { analyzeLabel } from '../services/api';

export default function HomeScreen() {
    // State tanımları
    const [selectedAllergies, setSelectedAllergies] = useState([]);
    const [selectedPreferences, setSelectedPreferences] = useState([]);
    const [selectedImage, setSelectedImage] = useState(null);
    const [analysisResult, setAnalysisResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Fotoğraf seçildiğinde analiz başlat
     */
    const handleImageSelected = async (image) => {
        setSelectedImage(image);
        setError(null);
        setIsLoading(true);

        try {
            console.log('Analiz başlatılıyor...');
            console.log('Seçili alerjiler:', selectedAllergies);
            console.log('Seçili tercihler:', selectedPreferences);

            const result = await analyzeLabel(
                image.base64,
                selectedAllergies,
                selectedPreferences
            );

            console.log('Analiz sonucu:', result);
            setAnalysisResult(result);
        } catch (err) {
            console.error('Analiz hatası:', err);
            setError(err.message || 'Analiz sırasında bir hata oluştu.');
            Alert.alert(
                'Hata',
                err.message || 'Analiz sırasında bir hata oluştu. Lütfen tekrar deneyin.',
                [{ text: 'Tamam' }]
            );
        } finally {
            setIsLoading(false);
        }
    };

    /**
     * Sonucu kapat ve yeni tarama için hazırlan
     */
    const handleCloseResult = () => {
        setAnalysisResult(null);
        setSelectedImage(null);
    };

    /**
     * Yeni tarama başlat
     */
    const handleRetry = () => {
        setAnalysisResult(null);
        setSelectedImage(null);
        setError(null);
    };

    return (
        <SafeAreaView style={styles.container} edges={['top']}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.logoContainer}>
                    <View style={styles.logoIcon}>
                        <Ionicons name="scan" size={24} color={colors.textWhite} />
                    </View>
                    <View>
                        <Text style={styles.logoText}>EtiketKontrol</Text>
                        <Text style={styles.logoSubtext}>Gıda Etiket Analizi</Text>
                    </View>
                </View>
            </View>

            {/* Ana İçerik */}
            {isLoading ? (
                // Yükleniyor durumu
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={colors.primary} />
                    <Text style={styles.loadingText}>Etiket analiz ediliyor...</Text>
                    <Text style={styles.loadingSubtext}>Bu işlem birkaç saniye sürebilir</Text>
                    {selectedImage && (
                        <Image
                            source={{ uri: selectedImage.uri }}
                            style={styles.previewImage}
                        />
                    )}
                </View>
            ) : analysisResult ? (
                // Sonuç gösterimi
                <ResultCard
                    result={analysisResult}
                    onClose={handleCloseResult}
                    onRetry={handleRetry}
                />
            ) : (
                // Tarama ekranı
                <ScrollView
                    style={styles.scrollView}
                    contentContainerStyle={styles.scrollContent}
                    showsVerticalScrollIndicator={false}
                >
                    {/* Hoşgeldin kartı */}
                    <View style={styles.welcomeCard}>
                        <Text style={styles.welcomeTitle}>Merhaba! 👋</Text>
                        <Text style={styles.welcomeText}>
                            Paketli gıdaların etiketini tara, içindekilerini analiz et ve
                            senin için uygun olup olmadığını öğren.
                        </Text>
                    </View>

                    {/* Alerji Seçici */}
                    <AllergySelector
                        selectedAllergies={selectedAllergies}
                        selectedPreferences={selectedPreferences}
                        onAllergiesChange={setSelectedAllergies}
                        onPreferencesChange={setSelectedPreferences}
                    />

                    {/* Kamera Butonu */}
                    <CameraButton
                        onImageSelected={handleImageSelected}
                        disabled={isLoading}
                    />

                    {/* Bilgi Kartı */}
                    <View style={styles.infoCard}>
                        <Ionicons name="information-circle" size={24} color={colors.primary} />
                        <Text style={styles.infoText}>
                            En iyi sonuç için etiketin "İçindekiler" bölümünü net bir şekilde
                            çerçeve içine alın.
                        </Text>
                    </View>

                    {/* Seçili içerikler özeti */}
                    {(selectedAllergies.length > 0 || selectedPreferences.length > 0) && (
                        <View style={styles.selectionSummary}>
                            <Text style={styles.summaryTitle}>Kontrol Edilecek:</Text>
                            <View style={styles.summaryTags}>
                                {selectedAllergies.map((allergy) => (
                                    <View key={allergy} style={[styles.tag, styles.tagDanger]}>
                                        <Text style={styles.tagText}>{allergy}</Text>
                                    </View>
                                ))}
                                {selectedPreferences.map((pref) => (
                                    <View key={pref} style={[styles.tag, styles.tagPrimary]}>
                                        <Text style={styles.tagText}>{pref}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },

    header: {
        backgroundColor: colors.primary,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.md,
        borderBottomLeftRadius: borderRadius.xl,
        borderBottomRightRadius: borderRadius.xl,
    },

    logoContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    logoIcon: {
        width: 48,
        height: 48,
        borderRadius: borderRadius.md,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: spacing.md,
    },

    logoText: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textWhite,
    },

    logoSubtext: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.8)',
    },

    scrollView: {
        flex: 1,
    },

    scrollContent: {
        padding: spacing.md,
    },

    welcomeCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.lg,
        marginBottom: spacing.lg,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },

    welcomeTitle: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
    },

    welcomeText: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
        lineHeight: 24,
    },

    loadingContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },

    loadingText: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginTop: spacing.lg,
    },

    loadingSubtext: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },

    previewImage: {
        width: 200,
        height: 150,
        borderRadius: borderRadius.md,
        marginTop: spacing.lg,
    },

    infoCard: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.safeBg,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },

    infoText: {
        flex: 1,
        fontSize: fontSize.sm,
        color: colors.primaryDark,
        marginLeft: spacing.sm,
        lineHeight: 20,
    },

    selectionSummary: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.lg,
    },

    summaryTitle: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.semibold,
        color: colors.textSecondary,
        marginBottom: spacing.sm,
    },

    summaryTags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: spacing.xs,
    },

    tag: {
        paddingVertical: spacing.xs,
        paddingHorizontal: spacing.sm,
        borderRadius: borderRadius.full,
    },

    tagDanger: {
        backgroundColor: colors.dangerBg,
    },

    tagPrimary: {
        backgroundColor: colors.safeBg,
    },

    tagText: {
        fontSize: fontSize.xs,
        fontWeight: fontWeight.medium,
        color: colors.textPrimary,
    },
});
