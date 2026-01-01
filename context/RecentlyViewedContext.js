import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ═══════════════════════════════════════════════════════════════════════════
// RECENTLY VIEWED CONTEXT - Track and persist recently viewed products
// ═══════════════════════════════════════════════════════════════════════════

const RecentlyViewedContext = createContext();

const STORAGE_KEY = '@recently_viewed';
const MAX_ITEMS = 10;

export function RecentlyViewedProvider({ children }) {
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [undoStack, setUndoStack] = useState([]);

    useEffect(() => {
        loadRecentlyViewed();
    }, []);

    const loadRecentlyViewed = async () => {
        try {
            const saved = await AsyncStorage.getItem(STORAGE_KEY);
            if (saved) {
                setRecentlyViewed(JSON.parse(saved));
            }
        } catch (e) {
            console.log('Error loading recently viewed:', e);
        }
    };

    const saveRecentlyViewed = async (items) => {
        try {
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(items));
        } catch (e) {
            console.log('Error saving recently viewed:', e);
        }
    };

    const addToRecentlyViewed = (product) => {
        setRecentlyViewed(prev => {
            // Remove if already exists (to move to front)
            const filtered = prev.filter(p => p.id !== product.id);
            // Add to front, limit to MAX_ITEMS
            const updated = [product, ...filtered].slice(0, MAX_ITEMS);
            saveRecentlyViewed(updated);
            return updated;
        });
    };

    const clearRecentlyViewed = () => {
        // Save current state for undo
        setUndoStack(prev => [...prev, { type: 'clearRecent', data: recentlyViewed }]);
        setRecentlyViewed([]);
        saveRecentlyViewed([]);
    };

    // Undo functionality
    const canUndo = undoStack.length > 0;

    const undo = () => {
        if (undoStack.length === 0) return false;

        const lastAction = undoStack[undoStack.length - 1];
        setUndoStack(prev => prev.slice(0, -1));

        if (lastAction.type === 'clearRecent') {
            setRecentlyViewed(lastAction.data);
            saveRecentlyViewed(lastAction.data);
            return true;
        }

        return false;
    };

    // Get similar products based on category and gender
    const getSimilarProducts = (product, allProducts) => {
        if (!product) return [];

        return allProducts
            .filter(p =>
                p.id !== product.id &&
                (p.category === product.category || p.gender === product.gender)
            )
            .slice(0, 6);
    };

    return (
        <RecentlyViewedContext.Provider value={{
            recentlyViewed,
            addToRecentlyViewed,
            clearRecentlyViewed,
            getSimilarProducts,
            canUndo,
            undo,
        }}>
            {children}
        </RecentlyViewedContext.Provider>
    );
}

export function useRecentlyViewed() {
    const context = useContext(RecentlyViewedContext);
    if (!context) {
        throw new Error('useRecentlyViewed must be used within a RecentlyViewedProvider');
    }
    return context;
}
