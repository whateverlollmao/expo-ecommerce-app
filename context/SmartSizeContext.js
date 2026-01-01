import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════════════════
// SMART SIZE CONTEXT - Track user's size preferences based on purchases
// ═══════════════════════════════════════════════════════════════════════════

const SmartSizeContext = createContext();

const SIZE_HISTORY_KEY = '@size_history';

export function SmartSizeProvider({ children }) {
    const [sizeHistory, setSizeHistory] = useState({
        clothing: {},  // { 'S': 2, 'M': 5, 'L': 1 }
        shoes: {},     // { '42': 3, '43': 1 }
    });
    const [recommendedSizes, setRecommendedSizes] = useState({
        clothing: null,
        shoes: null,
    });

    useEffect(() => {
        loadSizeHistory();
    }, []);

    useEffect(() => {
        calculateRecommendedSizes();
    }, [sizeHistory]);

    const loadSizeHistory = async () => {
        try {
            const saved = await AsyncStorage.getItem(SIZE_HISTORY_KEY);
            if (saved) {
                setSizeHistory(JSON.parse(saved));
            }
        } catch (e) {
            console.log('Error loading size history:', e);
        }
    };

    const saveSizeHistory = async (history) => {
        try {
            await AsyncStorage.setItem(SIZE_HISTORY_KEY, JSON.stringify(history));
        } catch (e) {
            console.log('Error saving size history:', e);
        }
    };

    // Record a size when user makes a purchase
    const recordSize = (category, size) => {
        if (!size) return;

        const type = isShoeSize(size) ? 'shoes' : 'clothing';

        setSizeHistory(prev => {
            const updated = {
                ...prev,
                [type]: {
                    ...prev[type],
                    [size]: (prev[type][size] || 0) + 1,
                },
            };
            saveSizeHistory(updated);
            return updated;
        });
    };

    // Check if size is a shoe size (numeric, typically 35-50)
    const isShoeSize = (size) => {
        const num = parseInt(size);
        return !isNaN(num) && num >= 30 && num <= 55;
    };

    // Calculate recommended sizes based on history
    const calculateRecommendedSizes = () => {
        const getTopSize = (sizes) => {
            const entries = Object.entries(sizes);
            if (entries.length === 0) return null;
            return entries.reduce((a, b) => a[1] > b[1] ? a : b)[0];
        };

        setRecommendedSizes({
            clothing: getTopSize(sizeHistory.clothing),
            shoes: getTopSize(sizeHistory.shoes),
        });
    };

    // Get recommendation for a product
    const getRecommendation = (productCategory) => {
        const isShoe = productCategory?.toLowerCase().includes('shoe') ||
            productCategory?.toLowerCase().includes('heel') ||
            productCategory?.toLowerCase().includes('sneaker') ||
            productCategory?.toLowerCase().includes('boot');

        return isShoe ? recommendedSizes.shoes : recommendedSizes.clothing;
    };

    // Get confidence text based on purchase count
    const getConfidenceText = (size, productCategory) => {
        const isShoe = productCategory?.toLowerCase().includes('shoe') ||
            productCategory?.toLowerCase().includes('heel');
        const type = isShoe ? 'shoes' : 'clothing';
        const count = sizeHistory[type][size] || 0;

        if (count >= 5) return 'highConfidence';
        if (count >= 3) return 'mediumConfidence';
        if (count >= 1) return 'lowConfidence';
        return null;
    };

    return (
        <SmartSizeContext.Provider value={{
            sizeHistory,
            recommendedSizes,
            recordSize,
            getRecommendation,
            getConfidenceText,
        }}>
            {children}
        </SmartSizeContext.Provider>
    );
}

export function useSmartSize() {
    const context = useContext(SmartSizeContext);
    if (!context) {
        throw new Error('useSmartSize must be used within a SmartSizeProvider');
    }
    return context;
}
