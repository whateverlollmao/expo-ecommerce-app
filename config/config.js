// App Configuration
// Edit these values to connect to your backend and services

const config = {
    app: {
        name: 'LUXE',
        version: '1.0.0',
        environment: 'development',
    },

    // Authentication
    auth: {
        apple: {
            enabled: false,
            clientId: 'YOUR_APPLE_CLIENT_ID',
            redirectUri: 'YOUR_REDIRECT_URI',
        },
        google: {
            enabled: false,
            clientId: 'YOUR_GOOGLE_CLIENT_ID',
            iosClientId: 'YOUR_GOOGLE_IOS_CLIENT_ID',
            androidClientId: 'YOUR_GOOGLE_ANDROID_CLIENT_ID',
        },
    },

    // Backend API
    api: {
        baseUrl: 'https://api.yourbackend.com',
        timeout: 10000,
        endpoints: {
            products: '/products',
            categories: '/categories',
            orders: '/orders',
            users: '/users',
            cart: '/cart',
            wishlist: '/wishlist',
            addresses: '/addresses',
            auth: '/auth',
        },
    },

    // Payments
    payments: {
        stripe: {
            enabled: false,
            publishableKey: 'pk_test_YOUR_STRIPE_KEY',
            merchantId: 'YOUR_MERCHANT_ID',
        },
        paypal: {
            enabled: false,
            clientId: 'YOUR_PAYPAL_CLIENT_ID',
            environment: 'sandbox',
        },
        applePay: {
            enabled: false,
            merchantId: 'merchant.com.yourapp',
        },
        googlePay: {
            enabled: false,
            merchantId: 'YOUR_GOOGLE_PAY_MERCHANT_ID',
        },
    },

    // Push Notifications
    notifications: {
        provider: 'expo',
        expo: { enabled: true },
        firebase: {
            enabled: false,
            apiKey: 'YOUR_FIREBASE_API_KEY',
            projectId: 'YOUR_PROJECT_ID',
            messagingSenderId: 'YOUR_SENDER_ID',
            appId: 'YOUR_APP_ID',
        },
        onesignal: {
            enabled: false,
            appId: 'YOUR_ONESIGNAL_APP_ID',
        },
    },

    // Analytics
    analytics: {
        enabled: false,
        googleAnalytics: { measurementId: 'G-XXXXXXXXXX' },
        mixpanel: { token: 'YOUR_MIXPANEL_TOKEN' },
    },

    // Social/Sharing
    social: {
        shareUrl: 'https://yourapp.com/product/',
        appStoreUrl: 'https://apps.apple.com/app/your-app-id',
        playStoreUrl: 'https://play.google.com/store/apps/details?id=com.yourapp',
    },

    // Feature Flags
    features: {
        offlineMode: true,
        biometricAuth: true,
        pushNotifications: true,
        darkMode: true,
        multiLanguage: true,
        multiCurrency: true,
        wishlist: true,
        reviews: false,
        orderTracking: true,
        promoCode: true,
        sizeGuide: true,
    },

    // Defaults
    defaults: {
        language: 'en',
        currency: 'USD',
        theme: 'system',
    },

    // Business Settings
    business: {
        freeShippingThreshold: 100,
        taxRate: 0.08,

        support: {
            email: 'support@yourapp.com',
            phone: '+1-800-123-4567',
            whatsapp: '+18001234567',
            telegram: '@YourAppBot',
            workingHours: '9:00 AM - 9:00 PM',
            workingDays: 'Mon - Sat',
        },

        branding: {
            appName: 'LUXE',
            tagline: 'Premium Fashion',
            logoEmoji: '✨',
            primaryColor: '#D4AF37',
        },

        legal: {
            privacyPolicyUrl: 'https://yourapp.com/privacy',
            termsOfServiceUrl: 'https://yourapp.com/terms',
            returnPolicyUrl: 'https://yourapp.com/returns',
        },
    },

    // Promo Codes
    promoCodes: {
        'LUXE10': { discount: 10, type: 'percent', description: '10% off' },
        'FIRST20': { discount: 20, type: 'percent', description: '20% off first order' },
        'VIP50': { discount: 50, type: 'percent', description: 'VIP 50% off' },
        'FREESHIP': { discount: 0, type: 'freeshipping', description: 'Free shipping' },
        'NEWYEAR': { discount: 25, type: 'percent', description: 'New Year 25% off' },
    },
};

// Helper functions
export const isConfigured = (service) => {
    switch (service) {
        case 'google':
            return config.auth.google.enabled && config.auth.google.clientId !== 'YOUR_GOOGLE_CLIENT_ID';
        case 'apple':
            return config.auth.apple.enabled && config.auth.apple.clientId !== 'YOUR_APPLE_CLIENT_ID';
        case 'stripe':
            return config.payments.stripe.enabled && !config.payments.stripe.publishableKey.includes('YOUR_');
        case 'paypal':
            return config.payments.paypal.enabled && config.payments.paypal.clientId !== 'YOUR_PAYPAL_CLIENT_ID';
        case 'api':
            return config.api.baseUrl !== 'https://api.yourbackend.com';
        default:
            return false;
    }
};

export const getEndpoint = (endpoint) => {
    return `${config.api.baseUrl}${config.api.endpoints[endpoint] || ''}`;
};

export default config;
