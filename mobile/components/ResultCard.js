/**
 * EtiketKontrol - Sonuç Kartı Bileşeni
 */

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../styles/theme';

/**
 * Uyarı kartı bileşeni
 */
const WarningCard = ({ level, title, message, description, icon }) => {
    const cardStyles = {
        danger: {
            bg: colors.dangerBg,
            border: colors.danger,
            icon: 'alert-circle',
            iconColor: colors.danger,
        },
        warning: {
            bg: colors.warningBg,
            border: colors.warning,
            icon: 'warning',
            iconColor: colors.warning,
        },
        safe: {
            bg: colors.safeBg,
            border: colors.safe,
            icon: 'checkmark-circle',
            iconColor: colors.safe,
        },
    };

    const style = cardStyles[level] || cardStyles.warning;

    return (
        <View style={[
            styles.warningCard,
            { backgroundColor: style.bg, borderLeftColor: style.border }
        ]}>
            <View style={styles.warningHeader}>
                <Ionicons name={icon || style.icon} size={24} color={style.iconColor} />
                <Text style={[styles.warningTitle, { color: style.border }]}>
                    {title}
                </Text>
            </View>
            <Text style={styles.warningMessage}>{message}</Text>
            {description && (
                <Text style={styles.warningDescription}>{description}</Text>
            )}
        </View>
    );
};

/**
 * Sonuç Kartı Ana Bileşeni
 */
export default function ResultCard({ result, onClose, onRetry }) {
    if (!result) return null;

    const { analysis, aiExplanation, extractedText, ocrConfidence } = result;
    const { allergyWarnings, cautionItems, dietaryViolations, overallStatus, overallMessage } = analysis;

    // Genel durum stilini belirle
    const statusStyles = {
        danger: {
            bg: colors.danger,
            icon: 'alert-circle',
            text: 'Dikkat: Risk Tespit Edildi!',
        },
        warning: {
            bg: colors.warning,
            icon: 'warning',
            text: 'Dikkatli Olun',
        },
        safe: {
            bg: colors.safe,
            icon: 'checkmark-circle',
            text: 'Uygun Görünüyor',
        },
    };

    const currentStatus = statusStyles[overallStatus] || statusStyles.safe;

    return (
        <View style={styles.container}>
            {/* Başlık çubuğu */}
            <View style={[styles.header, { backgroundColor: currentStatus.bg }]}>
                <View style={styles.headerContent}>
                    <Ionicons name={currentStatus.icon} size={32} color={colors.textWhite} />
                    <View style={styles.headerText}>
                        <Text style={styles.headerTitle}>{currentStatus.text}</Text>
                        <Text style={styles.headerSubtitle}>{overallMessage}</Text>
                    </View>
                </View>
                <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                    <Ionicons name="close" size={28} color={colors.textWhite} />
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
                {/* AI Açıklaması */}
                {aiExplanation && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="sparkles" size={20} color={colors.primary} />
                            <Text style={styles.sectionTitle}>AI Değerlendirmesi</Text>
                        </View>
                        <View style={styles.aiCard}>
                            <Text style={styles.aiText}>{aiExplanation}</Text>
                        </View>
                    </View>
                )}

                {/* Alerji Uyarıları */}
                {allergyWarnings.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="alert-circle" size={20} color={colors.danger} />
                            <Text style={styles.sectionTitle}>Alerji Uyarıları</Text>
                            <View style={[styles.badge, { backgroundColor: colors.danger }]}>
                                <Text style={styles.badgeText}>{allergyWarnings.length}</Text>
                            </View>
                        </View>
                        {allergyWarnings.map((warning, index) => (
                            <WarningCard
                                key={index}
                                level="danger"
                                title={warning.allergen}
                                message={warning.message}
                                description={warning.description}
                            />
                        ))}
                    </View>
                )}

                {/* Dikkat Gerektiren İçerikler */}
                {cautionItems.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="warning" size={20} color={colors.warning} />
                            <Text style={styles.sectionTitle}>Dikkat Edilmesi Gerekenler</Text>
                            <View style={[styles.badge, { backgroundColor: colors.warning }]}>
                                <Text style={styles.badgeText}>{cautionItems.length}</Text>
                            </View>
                        </View>
                        {cautionItems.map((item, index) => (
                            <WarningCard
                                key={index}
                                level="warning"
                                title={item.ingredient}
                                message={item.message}
                                description={item.description}
                            />
                        ))}
                    </View>
                )}

                {/* Diyet İhlalleri */}
                {dietaryViolations && dietaryViolations.length > 0 && (
                    <View style={styles.section}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="leaf" size={20} color={colors.warning} />
                            <Text style={styles.sectionTitle}>Diyet Uyumsuzlukları</Text>
                        </View>
                        {dietaryViolations.map((violation, index) => (
                            <WarningCard
                                key={index}
                                level="warning"
                                title={violation.preference}
                                message={violation.message}
                                icon="leaf"
                            />
                        ))}
                    </View>
                )}

                {/* Çıkarılan Metin */}
                <View style={styles.section}>
                    <TouchableOpacity style={styles.expandableHeader}>
                        <View style={styles.sectionHeader}>
                            <Ionicons name="document-text" size={20} color={colors.textSecondary} />
                            <Text style={styles.sectionTitle}>Algılanan Metin</Text>
                        </View>
                    </TouchableOpacity>
                    <View style={styles.textCard}>
                        <Text style={styles.extractedText}>{extractedText}</Text>
                        {ocrConfidence && (
                            <Text style={styles.confidenceText}>
                                Algılama güveni: %{Math.round(ocrConfidence)}
                            </Text>
                        )}
                    </View>
                </View>

                {/* Tekrar Dene Butonu */}
                <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
                    <Ionicons name="refresh" size={20} color={colors.textWhite} />
                    <Text style={styles.retryButtonText}>Yeni Bir Ürün Tara</Text>
                </TouchableOpacity>

                {/* Alt boşluk */}
                <View style={{ height: spacing.xl }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
        borderRadius: borderRadius.xl,
        overflow: 'hidden',
        marginTop: spacing.md,
    },

    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: spacing.md,
    },

    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },

    headerText: {
        marginLeft: spacing.md,
        flex: 1,
    },

    headerTitle: {
        fontSize: fontSize.xl,
        fontWeight: fontWeight.bold,
        color: colors.textWhite,
    },

    headerSubtitle: {
        fontSize: fontSize.sm,
        color: 'rgba(255, 255, 255, 0.9)',
        marginTop: 2,
    },

    closeButton: {
        padding: spacing.xs,
    },

    content: {
        flex: 1,
        padding: spacing.md,
    },

    section: {
        marginBottom: spacing.lg,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.sm,
    },

    sectionTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginLeft: spacing.sm,
        flex: 1,
    },

    badge: {
        minWidth: 24,
        height: 24,
        borderRadius: borderRadius.full,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: spacing.xs,
    },

    badgeText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.bold,
        color: colors.textWhite,
    },

    aiCard: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        borderLeftWidth: 4,
        borderLeftColor: colors.primary,
    },

    aiText: {
        fontSize: fontSize.md,
        color: colors.textPrimary,
        lineHeight: 24,
    },

    warningCard: {
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.sm,
        borderLeftWidth: 4,
    },

    warningHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },

    warningTitle: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        marginLeft: spacing.sm,
    },

    warningMessage: {
        fontSize: fontSize.sm,
        color: colors.textPrimary,
        marginLeft: spacing.xl + spacing.xs,
    },

    warningDescription: {
        fontSize: fontSize.xs,
        color: colors.textSecondary,
        marginLeft: spacing.xl + spacing.xs,
        marginTop: spacing.xs,
        fontStyle: 'italic',
    },

    textCard: {
        backgroundColor: colors.surfaceSecondary,
        borderRadius: borderRadius.md,
        padding: spacing.md,
    },

    extractedText: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        lineHeight: 20,
    },

    confidenceText: {
        fontSize: fontSize.xs,
        color: colors.textLight,
        marginTop: spacing.sm,
        textAlign: 'right',
    },

    retryButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        gap: spacing.sm,
    },

    retryButtonText: {
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
        color: colors.textWhite,
    },
});
