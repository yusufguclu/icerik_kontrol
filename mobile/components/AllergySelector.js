/**
 * EtiketKontrol - Alerji Seçici Bileşeni
 */

import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, spacing, borderRadius, fontSize, fontWeight } from '../styles/theme';

// Alerjen listesi
const ALLERGENS = [
    { id: 'gluten', name: 'Gluten', icon: '🌾' },
    { id: 'süt', name: 'Süt Ürünleri', icon: '🥛' },
    { id: 'yumurta', name: 'Yumurta', icon: '🥚' },
    { id: 'fındık', name: 'Fındık/Kuruyemiş', icon: '🥜' },
    { id: 'soya', name: 'Soya', icon: '🫘' },
    { id: 'balık', name: 'Balık', icon: '🐟' },
    { id: 'kabuklu deniz ürünleri', name: 'Kabuklu Deniz Ürünleri', icon: '🦐' },
    { id: 'susam', name: 'Susam', icon: '🌰' },
];

// Diyet tercihleri
const PREFERENCES = [
    { id: 'vegan', name: 'Vegan', icon: '🌱' },
    { id: 'vejetaryen', name: 'Vejetaryen', icon: '🥗' },
    { id: 'helal', name: 'Helal', icon: '☪️' },
    { id: 'koşer', name: 'Koşer', icon: '✡️' },
];

/**
 * Seçim Chip'i
 */
const SelectionChip = ({ item, isSelected, onToggle }) => (
    <TouchableOpacity
        style={[
            styles.chip,
            isSelected && styles.chipSelected,
        ]}
        onPress={() => onToggle(item.id)}
        activeOpacity={0.7}
    >
        <Text style={styles.chipIcon}>{item.icon}</Text>
        <Text style={[
            styles.chipText,
            isSelected && styles.chipTextSelected,
        ]}>
            {item.name}
        </Text>
        {isSelected && (
            <Ionicons name="checkmark-circle" size={18} color={colors.primary} />
        )}
    </TouchableOpacity>
);

/**
 * Alerji Seçici Bileşeni
 */
export default function AllergySelector({
    selectedAllergies = [],
    selectedPreferences = [],
    onAllergiesChange,
    onPreferencesChange,
}) {
    const toggleAllergy = (id) => {
        const newSelection = selectedAllergies.includes(id)
            ? selectedAllergies.filter((a) => a !== id)
            : [...selectedAllergies, id];
        onAllergiesChange(newSelection);
    };

    const togglePreference = (id) => {
        const newSelection = selectedPreferences.includes(id)
            ? selectedPreferences.filter((p) => p !== id)
            : [...selectedPreferences, id];
        onPreferencesChange(newSelection);
    };

    return (
        <View style={styles.container}>
            {/* Alerjenler */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="warning" size={20} color={colors.danger} />
                    <Text style={styles.sectionTitle}>Alerjenler</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                    Size alerji yapan içerikleri seçin
                </Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipContainer}
                >
                    {ALLERGENS.map((item) => (
                        <SelectionChip
                            key={item.id}
                            item={item}
                            isSelected={selectedAllergies.includes(item.id)}
                            onToggle={toggleAllergy}
                        />
                    ))}
                </ScrollView>
            </View>

            {/* Diyet Tercihleri */}
            <View style={styles.section}>
                <View style={styles.sectionHeader}>
                    <Ionicons name="leaf" size={20} color={colors.primary} />
                    <Text style={styles.sectionTitle}>Diyet Tercihleri</Text>
                </View>
                <Text style={styles.sectionSubtitle}>
                    Beslenme tercihlerinizi belirtin
                </Text>
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.chipContainer}
                >
                    {PREFERENCES.map((item) => (
                        <SelectionChip
                            key={item.id}
                            item={item}
                            isSelected={selectedPreferences.includes(item.id)}
                            onToggle={togglePreference}
                        />
                    ))}
                </ScrollView>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        marginBottom: spacing.md,
    },

    section: {
        marginBottom: spacing.lg,
    },

    sectionHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: spacing.xs,
    },

    sectionTitle: {
        fontSize: fontSize.lg,
        fontWeight: fontWeight.semibold,
        color: colors.textPrimary,
        marginLeft: spacing.sm,
    },

    sectionSubtitle: {
        fontSize: fontSize.sm,
        color: colors.textSecondary,
        marginBottom: spacing.md,
        marginLeft: spacing.xl + spacing.sm,
    },

    chipContainer: {
        paddingHorizontal: spacing.xs,
        gap: spacing.sm,
    },

    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.full,
        paddingVertical: spacing.sm,
        paddingHorizontal: spacing.md,
        marginRight: spacing.sm,
        gap: spacing.xs,
    },

    chipSelected: {
        backgroundColor: colors.safeBg,
        borderColor: colors.primary,
    },

    chipIcon: {
        fontSize: fontSize.lg,
    },

    chipText: {
        fontSize: fontSize.sm,
        fontWeight: fontWeight.medium,
        color: colors.textSecondary,
    },

    chipTextSelected: {
        color: colors.primaryDark,
    },
});
