import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    Modal,
    TouchableOpacity,
    ScrollView,
    Dimensions,
} from 'react-native';
import { X, Ruler } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

const { height } = Dimensions.get('window');

// Size charts for different categories
const SIZE_CHARTS = {
    clothing: {
        headers: ['Size', 'Chest (cm)', 'Waist (cm)', 'Hip (cm)'],
        men: [
            ['S', '88-92', '76-80', '88-92'],
            ['M', '96-100', '84-88', '96-100'],
            ['L', '104-108', '92-96', '104-108'],
            ['XL', '112-116', '100-104', '112-116'],
        ],
        women: [
            ['XS', '80-84', '60-64', '86-90'],
            ['S', '84-88', '64-68', '90-94'],
            ['M', '88-92', '68-72', '94-98'],
            ['L', '92-96', '72-76', '98-102'],
        ],
    },
    shoes: {
        headers: ['EU', 'US Men', 'US Women', 'CM'],
        data: [
            ['36', '4', '6', '22.5'],
            ['37', '5', '7', '23.5'],
            ['38', '6', '8', '24'],
            ['39', '7', '9', '24.5'],
            ['40', '7.5', '9.5', '25'],
            ['41', '8', '10', '26'],
            ['42', '9', '11', '27'],
            ['43', '10', '12', '27.5'],
            ['44', '11', '13', '28.5'],
        ],
    },
};

export function SizeGuideModal({ visible, onClose, category = 'men', productType = 'clothing' }) {
    const { theme, isDark } = useTheme();
    const { t } = useLanguage();

    const isShoes = productType === 'shoes';
    const chart = isShoes ? SIZE_CHARTS.shoes : SIZE_CHARTS.clothing;
    const data = isShoes ? chart.data : (category === 'women' ? chart.women : chart.men);

    return (
        <Modal
            visible={visible}
            animationType="slide"
            transparent
            onRequestClose={onClose}
        >
            <View style={styles.overlay}>
                <View style={[styles.container, { backgroundColor: theme.background }]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[styles.iconContainer, { backgroundColor: theme.accentGlow }]}>
                            <Ruler size={24} color={theme.accent} />
                        </View>
                        <Text style={[styles.title, { color: theme.text }]}>
                            {t('sizeGuide') || 'Size Guide'}
                        </Text>
                        <TouchableOpacity
                            onPress={onClose}
                            style={[styles.closeButton, { backgroundColor: theme.card }]}
                        >
                            <X size={20} color={theme.text} />
                        </TouchableOpacity>
                    </View>

                    {/* Category Label */}
                    <Text style={[styles.categoryLabel, { color: theme.textSecondary }]}>
                        {isShoes
                            ? (t('shoeSizes') || 'Shoe Sizes')
                            : (category === 'women' ? (t('womenSizes') || "Women's Sizes") : (t('menSizes') || "Men's Sizes"))
                        }
                    </Text>

                    {/* Size Table */}
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        style={styles.tableContainer}
                    >
                        {/* Table Header */}
                        <LinearGradient
                            colors={[theme.accent, theme.accentDark]}
                            style={styles.tableHeader}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                        >
                            {chart.headers.map((header, index) => (
                                <Text
                                    key={index}
                                    style={[styles.headerCell, { flex: index === 0 ? 0.8 : 1 }]}
                                >
                                    {header}
                                </Text>
                            ))}
                        </LinearGradient>

                        {/* Table Rows */}
                        {data.map((row, rowIndex) => (
                            <View
                                key={rowIndex}
                                style={[
                                    styles.tableRow,
                                    {
                                        backgroundColor: rowIndex % 2 === 0 ? theme.card : theme.inputBackground
                                    }
                                ]}
                            >
                                {row.map((cell, cellIndex) => (
                                    <Text
                                        key={cellIndex}
                                        style={[
                                            styles.cell,
                                            {
                                                color: cellIndex === 0 ? theme.accent : theme.text,
                                                fontWeight: cellIndex === 0 ? '700' : '500',
                                                flex: cellIndex === 0 ? 0.8 : 1,
                                            }
                                        ]}
                                    >
                                        {cell}
                                    </Text>
                                ))}
                            </View>
                        ))}

                        {/* Measurement Tips */}
                        <View style={[styles.tipsContainer, { backgroundColor: theme.accentGlow }]}>
                            <Text style={[styles.tipsTitle, { color: theme.accent }]}>
                                📏 {t('measurementTips') || 'Measurement Tips'}
                            </Text>
                            <Text style={[styles.tipsText, { color: theme.text }]}>
                                {isShoes
                                    ? (t('shoeMeasureTip') || 'Measure your foot from heel to longest toe. Try shoes on in the afternoon when feet are slightly larger.')
                                    : (t('clothingMeasureTip') || 'Take measurements over underwear. Keep the tape measure snug but not tight.')
                                }
                            </Text>
                        </View>
                    </ScrollView>

                    {/* Close Button */}
                    <TouchableOpacity
                        onPress={onClose}
                        activeOpacity={0.9}
                    >
                        <LinearGradient
                            colors={[theme.gradientStart, theme.gradientEnd]}
                            style={styles.doneButton}
                        >
                            <Text style={styles.doneButtonText}>
                                {t('gotIt') || 'Got It'}
                            </Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.6)',
        justifyContent: 'flex-end',
    },
    container: {
        maxHeight: height * 0.85,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        padding: 24,
        paddingBottom: 40,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 48,
        height: 48,
        borderRadius: 14,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 14,
    },
    title: {
        flex: 1,
        fontSize: 22,
        fontWeight: '800',
    },
    closeButton: {
        width: 40,
        height: 40,
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center',
    },
    categoryLabel: {
        fontSize: 12,
        fontWeight: '700',
        letterSpacing: 2,
        marginBottom: 16,
    },
    tableContainer: {
        maxHeight: height * 0.45,
    },
    tableHeader: {
        flexDirection: 'row',
        padding: 14,
        borderRadius: 12,
        marginBottom: 8,
    },
    headerCell: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '700',
        textAlign: 'center',
    },
    tableRow: {
        flexDirection: 'row',
        padding: 14,
        borderRadius: 10,
        marginBottom: 4,
    },
    cell: {
        fontSize: 14,
        textAlign: 'center',
    },
    tipsContainer: {
        padding: 18,
        borderRadius: 16,
        marginTop: 20,
        marginBottom: 20,
    },
    tipsTitle: {
        fontSize: 14,
        fontWeight: '700',
        marginBottom: 8,
    },
    tipsText: {
        fontSize: 13,
        lineHeight: 20,
    },
    doneButton: {
        padding: 18,
        borderRadius: 16,
        alignItems: 'center',
    },
    doneButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
