import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════════════════
// CURRENCY CONTEXT - Multi-currency support
// ═══════════════════════════════════════════════════════════════════════════

const CurrencyContext = createContext();

// Currency definitions with flags and exchange rates (approximate)
export const currencies = {
    USD: {
        code: 'USD',
        symbol: '$',
        name: 'US Dollar',
        flag: '🇺🇸',
        rate: 1,
    },
    RUB: {
        code: 'RUB',
        symbol: '₽',
        name: 'Russian Ruble',
        flag: '🇷🇺',
        rate: 92.5,
    },
    KZT: {
        code: 'KZT',
        symbol: '₸',
        name: 'Kazakh Tenge',
        flag: '🇰🇿',
        rate: 450,
    },
};

const CURRENCY_STORAGE_KEY = '@app_currency';

export function CurrencyProvider({ children }) {
    const [currency, setCurrency] = useState('USD');

    useEffect(() => {
        loadCurrency();
    }, []);

    const loadCurrency = async () => {
        try {
            const saved = await AsyncStorage.getItem(CURRENCY_STORAGE_KEY);
            if (saved && currencies[saved]) {
                setCurrency(saved);
            }
        } catch (e) {
            console.log('Error loading currency:', e);
        }
    };

    const changeCurrency = async (code) => {
        if (currencies[code]) {
            setCurrency(code);
            try {
                await AsyncStorage.setItem(CURRENCY_STORAGE_KEY, code);
            } catch (e) {
                console.log('Error saving currency:', e);
            }
        }
    };

    // Convert USD price to selected currency
    const convertPrice = (usdPrice) => {
        const rate = currencies[currency]?.rate || 1;
        return usdPrice * rate;
    };

    // Format price with currency symbol
    const formatPrice = (usdPrice) => {
        const converted = convertPrice(usdPrice);
        const currencyData = currencies[currency];

        // Format number with appropriate decimals
        let formatted;
        if (currency === 'USD') {
            formatted = converted.toFixed(2);
        } else if (currency === 'KZT' || currency === 'RUB') {
            formatted = Math.round(converted).toLocaleString();
        } else {
            formatted = converted.toFixed(2);
        }

        // Return with symbol
        return `${currencyData.symbol}${formatted}`;
    };

    const currentCurrency = currencies[currency];

    return (
        <CurrencyContext.Provider value={{
            currency,
            currencies,
            currentCurrency,
            changeCurrency,
            convertPrice,
            formatPrice,
        }}>
            {children}
        </CurrencyContext.Provider>
    );
}

export function useCurrency() {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
}
