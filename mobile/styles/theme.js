/**
 * EtiketKontrol - Tema ve Stil Sabitleri
 */

export const colors = {
    // Ana renkler
    primary: '#10B981',       // Yeşil - Ana renk
    primaryDark: '#059669',
    primaryLight: '#34D399',

    // Durum renkleri
    danger: '#EF4444',        // Kırmızı - Alerji uyarısı
    dangerBg: '#FEF2F2',
    dangerBorder: '#FECACA',

    warning: '#F59E0B',       // Sarı/Turuncu - Dikkat
    warningBg: '#FFFBEB',
    warningBorder: '#FDE68A',

    safe: '#10B981',          // Yeşil - Güvenli
    safeBg: '#ECFDF5',
    safeBorder: '#A7F3D0',

    // Nötr renkler
    background: '#F9FAFB',
    surface: '#FFFFFF',
    surfaceSecondary: '#F3F4F6',

    // Metin renkleri
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textLight: '#9CA3AF',
    textWhite: '#FFFFFF',

    // Kenarlık
    border: '#E5E7EB',
    borderDark: '#D1D5DB',

    // Gölge
    shadow: 'rgba(0, 0, 0, 0.1)',
};

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
};

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
};

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
};

export const fontWeight = {
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
};

// Ortak stiller
export const commonStyles = {
    // Kart stili
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        padding: spacing.md,
        shadowColor: colors.shadow,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
    },

    // Başlık stili
    title: {
        fontSize: fontSize.xxl,
        fontWeight: fontWeight.bold,
        color: colors.textPrimary,
    },

    // Alt başlık
    subtitle: {
        fontSize: fontSize.md,
        color: colors.textSecondary,
    },

    // Buton stili
    button: {
        backgroundColor: colors.primary,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.md,
        paddingHorizontal: spacing.lg,
        alignItems: 'center',
        justifyContent: 'center',
    },

    buttonText: {
        color: colors.textWhite,
        fontSize: fontSize.md,
        fontWeight: fontWeight.semibold,
    },

    // Input stili
    input: {
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        fontSize: fontSize.md,
        color: colors.textPrimary,
    },
};

export default {
    colors,
    spacing,
    borderRadius,
    fontSize,
    fontWeight,
    commonStyles,
};
