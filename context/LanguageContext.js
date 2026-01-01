import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LanguageContext = createContext();

const LANGUAGE_STORAGE_KEY = '@app_language';

// Complete translations for ALL screens
const translations = {
    en: {
        // Common
        back: 'Back',
        cancel: 'Cancel',
        save: 'Save',
        done: 'Done',
        loading: 'Loading...',
        error: 'Error',
        success: 'Success',
        close: 'Close',
        delete: 'Delete',
        edit: 'Edit',
        confirm: 'Confirm',

        // Tab Bar
        shop: 'Shop',
        cart: 'Cart',
        account: 'Account',

        // Auth
        welcome: 'Welcome Back ✨',
        welcomeSubtitle: 'Sign in to discover exclusive styles',
        continueWithApple: 'Continue with Apple',
        continueWithGoogle: 'Continue with Google',
        signUpWithEmail: 'Sign up with Email',
        termsAgree: 'By continuing, you agree to our',
        terms: 'Terms',
        and: '&',
        privacy: 'Privacy',

        // Sign Up
        createAccount: 'Create Account',
        joinLuxe: 'Join LUXE to discover premium fashion',
        name: 'Name',
        email: 'Email',
        password: 'Password',
        confirmPassword: 'Confirm Password',
        signUp: 'Sign Up',
        alreadyHaveAccount: 'Already have an account?',
        signIn: 'Sign In',

        // Home
        searchPlaceholder: 'Search luxury items...',
        all: 'All',
        men: 'Men',
        women: 'Women',
        recentlyViewed: 'Recently Viewed',
        yourWishlist: 'Your Wishlist 💕',
        savedItems: 'saved items',
        savedItem: 'saved item',
        newDrops: 'NEW DROPS',
        collection: 'Collection',
        noProducts: 'No products found',

        // Categories
        shirts: 'Shirts',
        jackets: 'Jackets',
        shoes: 'Shoes',
        accessories: 'Accessories',
        dresses: 'Dresses',
        bags: 'Bags',
        jewelry: 'Jewelry',
        tops: 'Tops',
        forHer: 'For her',
        forHim: 'For him',
        allProducts: 'All Products',

        // Product
        selectSize: 'SELECT SIZE',
        quantity: 'QUANTITY',
        description: 'DESCRIPTION',
        availableColors: 'AVAILABLE COLORS',
        addToBag: 'Add to Bag',
        addedToBag: '✓ Added to Bag!',
        outOfStock: 'Out of Stock',
        lowStock: 'Low Stock',
        inStock: 'In Stock',
        onlyLeft: 'Only {count} left!',
        reviews: 'reviews',
        sizes: 'sizes',
        total: 'Total',
        share: 'Share',
        productNotFound: 'Product not found',
        selectSizeFirst: 'Select Size',
        selectSizeMessage: 'Please select a size before adding to cart.',

        // Cart
        shoppingBag: 'Shopping Bag',
        yourBagEmpty: 'Your bag is empty',
        emptyBagSubtitle: 'Time to treat yourself! Add some luxury items.',
        startShopping: 'Start Shopping',
        freeShippingQualify: '🎉 You qualify for free shipping!',
        moreForFreeShipping: '${amount} more for free shipping',
        subtotal: 'Subtotal',
        shipping: 'Shipping',
        free: 'FREE',
        checkout: 'Checkout',
        items: 'items',
        item: 'item',
        size: 'Size',

        // Currency & Filter
        currency: 'Currency',
        selectCurrency: 'SELECT CURRENCY',
        currencyNote: 'Exchange rates are approximate and updated periodically.',
        filter: 'Filter',
        sortBy: 'SORT BY',
        priceRange: 'PRICE RANGE',
        priceLowToHigh: 'Price: Low to High',
        priceHighToLow: 'Price: High to Low',
        newest: 'Newest First',
        popular: 'Most Popular',
        resetFilters: 'Reset Filters',
        applyFilters: 'Apply',

        // Wishlist
        wishlist: 'Wishlist',
        wishlistEmpty: 'Your wishlist is empty',
        wishlistEmptySubtitle: 'Tap the heart on products you love to save them here',

        // Checkout
        shippingAddress: '📍 SHIPPING ADDRESS',
        paymentDetails: '💳 PAYMENT DETAILS',
        orderItems: '🛍️ ORDER ITEMS',
        delivery: '📍 DELIVERY',
        payment: '💳 PAYMENT',
        useSavedAddress: 'USE SAVED ADDRESS',
        selectAddress: 'Select an address',
        orEnterManually: 'Or enter manually',
        fullName: 'Full Name',
        streetAddress: 'Street Address',
        city: 'City',
        zipCode: 'ZIP Code',
        cardNumber: 'Card Number',
        expiry: 'Expiry (MM/YY)',
        cvv: 'CVV',
        nameOnCard: 'Name on Card',
        securePayment: 'Your payment information is encrypted and secure',
        continueBtn: 'Continue',
        placeOrder: '🎉 Place Order',
        orderConfirmed: '🎉 Order Confirmed!',
        orderNumber: 'Order #',
        confirmationSent: "You'll receive a confirmation shortly.",
        viewOrders: 'View Orders',
        keepShopping: 'Keep Shopping',
        review: 'Review',
        missingInfo: 'Missing Information',
        fillAllFields: 'Please fill in all shipping fields',
        invalidCard: 'Invalid Card',
        enterValidCard: 'Please enter a valid card number',
        invalidExpiry: 'Invalid Expiry',
        enterExpiry: 'Please enter expiry as MM/YY',
        invalidCvv: 'Invalid CVV',
        enterValidCvv: 'Please enter a valid CVV',
        missingName: 'Missing Name',
        enterCardName: 'Please enter the name on card',
        tax: 'Tax',
        expires: 'Expires',
        qty: 'Qty',

        // Order History
        orderHistory: 'Order History',
        noOrders: 'No orders yet',
        noOrdersSubtitle: 'Your order history will appear here after your first purchase.',
        orderPlaced: 'Order placed',
        orderStatus: 'Status',
        orderTotal: 'Total',
        processing: 'Processing',
        shipped: 'Shipped',
        delivered: 'Delivered',

        // New Features - Size Guide
        sizeGuide: 'Size Guide',
        shoeSizes: 'SHOE SIZES',
        menSizes: "MEN'S SIZES",
        womenSizes: "WOMEN'S SIZES",
        measurementTips: 'Measurement Tips',
        shoeMeasureTip: 'Measure your foot from heel to longest toe. Try shoes on in the afternoon when feet are slightly larger.',
        clothingMeasureTip: 'Take measurements over underwear. Keep the tape measure snug but not tight.',
        gotIt: 'Got It',

        // New Features - Promo Code
        promoCodePlaceholder: 'Enter promo code',
        enterPromoCode: 'Please enter a promo code',
        invalidPromoCode: 'Invalid promo code',
        apply: 'Apply',

        // New Features - Addresses
        savedAddresses: 'Saved Addresses',
        noAddresses: 'No saved addresses',
        addAddressHint: 'Add an address for faster checkout',
        addAddress: 'Add Address',
        editAddress: 'Edit Address',
        deleteAddress: 'Delete Address',
        deleteAddressConfirm: 'Are you sure you want to delete this address?',
        default: 'Default',
        fullName: 'FULL NAME',
        phoneNumber: 'PHONE NUMBER',
        streetAddress: 'STREET ADDRESS',
        city: 'CITY',
        country: 'COUNTRY',
        fillAllFields: 'Please fill all fields',

        // New Features - Order Tracking
        orderTracking: 'Order Tracking',
        orderNumber: 'Order Number',
        estimatedDelivery: 'Est. Delivery',
        trackingStatus: 'TRACKING STATUS',
        orderConfirmed: 'Order Confirmed',
        outForDelivery: 'Out for Delivery',
        inProgress: 'In Progress',
        deliveryAddress: 'DELIVERY ADDRESS',
        needHelp: 'Need help with your order?',

        // New Features - AR Try-On
        arTryOn: 'AR Try-On',
        cameraPermission: 'Camera Access Required',
        cameraPermissionDesc: 'We need access to your camera to show the AR try-on experience',
        grantPermission: 'Grant Permission',
        photoSaved: 'Photo Saved!',
        photoSavedDesc: 'Your AR try-on photo has been saved to your gallery.',
        arHint: 'Select an accessory and position it on your face',

        // New Features - Theme Settings
        themeSettings: 'Theme Settings',
        currentTheme: 'Current Theme',
        darkMode: 'Dark Mode',
        lightMode: 'Light Mode',
        toggle: 'Toggle',
        themeModeTitle: 'THEME MODE',
        manualMode: 'Manual',
        manualModeDesc: 'Manually switch between light and dark',
        systemMode: 'Follow System',
        systemModeDesc: 'Match your device appearance settings',
        scheduleMode: 'Schedule',
        scheduleModeDesc: 'Automatically switch at set times',
        scheduleSettings: 'Schedule Settings',
        darkModeStarts: 'Dark Mode Starts',
        darkModeEnds: 'Dark Mode Ends',
        themeInfo: 'Changes will be applied immediately and saved automatically.',

        // New Features - Biometric Login
        biometricLogin: 'Face ID / Touch ID',
        biometricLoginDesc: 'Use biometric authentication for quick access',
        enableBiometric: 'Enable Biometric Login',

        // New Features - Back in Stock
        backInStock: 'Back in Stock Alerts',
        backInStockDesc: 'Get notified when items are available again',
        notifyWhenAvailable: 'Notify When Available',

        // New Features - Account Section
        features: 'FEATURES',
        manageAddresses: 'Manage delivery addresses',
        tryAccessories: 'Try on glasses & hats',

        // Smart Size & Similar Products
        yourSize: 'Your size',
        youMightLike: 'You might also like',
        recentlyViewedSection: 'Recently Viewed',
        continueWhere: 'Continue where you left off',

        // Account
        editProfile: 'Edit Profile',
        nameEmailPhone: 'Name, email, phone',
        viewPastPurchases: 'View past purchases',
        notifications: 'Notifications',
        pushEmailSettings: 'Push, email settings',
        preferences: 'PREFERENCES',
        darkMode: 'Dark Mode',
        darkModeOn: 'On - Pure black theme',
        darkModeOff: 'Off - Light theme',
        language: 'Language',
        support: 'SUPPORT',
        supportTitle: 'Support',
        whatsappEmailTelegram: 'WhatsApp, Email, Telegram',
        help: 'Help',
        howToPurchase: 'How to purchase items',
        legalDocuments: 'Legal Documents',
        privacyCopyright: 'Privacy policy, copyright',
        logOut: 'Log Out',
        logOutConfirm: 'Are you sure you want to log out?',
        guestUser: 'Guest User',
        notSignedIn: 'Not signed in',

        // Edit Profile
        phone: 'Phone',
        saveChanges: 'Save Changes',
        profileUpdated: 'Profile Updated',
        profileUpdatedMessage: 'Your profile has been updated successfully.',

        // Notifications
        notificationSettings: 'Notification Settings',
        pushNotifications: 'Push Notifications',
        pushNotificationsDesc: 'Receive push notifications on your device',
        orderUpdates: 'Order Updates',
        orderUpdatesDesc: 'Get notified about your order status',
        promotions: 'Promotions & Offers',
        promotionsDesc: 'Receive special offers and discounts',
        emailNotifications: 'Email Notifications',
        emailNotificationsDesc: 'Receive marketing emails',
        newArrivals: 'New Arrivals',
        newArrivalsDesc: 'Be the first to know about new products',

        // Support
        howCanWeHelp: 'How can we help?',
        teamHereToAssist: 'Our team is here to assist you',
        workingHours: 'Working Hours',
        workingHoursValue: 'Monday to Friday, 10:00 to 19:00',
        contactUs: 'CONTACT US',
        whatsapp: 'WhatsApp',
        telegramBot: 'Telegram Bot',
        fastestResponse: '💡 For fastest response, contact us on WhatsApp during working hours.',

        // Help
        shoppingGuide: 'Shopping Guide',
        learnHowToPurchase: 'Learn how to purchase items in 5 easy steps',
        browseSelect: 'Browse & Select',
        browseSelectDesc: 'Explore our curated collection. Tap on any item to view details, available sizes, and colors.',
        chooseSizeQty: 'Choose Size & Quantity',
        chooseSizeQtyDesc: 'Select your preferred size and quantity. Green dot means in stock, red means limited availability.',
        addToCart: 'Add to Cart',
        addToCartDesc: 'Tap "Add to Bag" to add items to your shopping cart. You can add multiple items before checkout.',
        checkoutPay: 'Checkout & Pay',
        checkoutPayDesc: 'Enter your shipping address and payment details. We accept all major credit cards. Orders over $100 get free shipping!',
        trackOrder: 'Track Your Order',
        trackOrderDesc: 'Once placed, track your order in "Order History". You\'ll receive updates at every step.',
        proTips: '💡 Pro Tips',
        tip1: '• Add items to wishlist to save for later',
        tip2: '• Free shipping on orders over $100',
        tip3: '• Check "Low Stock" badges for limited items',
        readyToShop: 'Ready to start shopping?',
        toCatalog: 'To the Catalog',

        // Legal
        legalPolicies: 'Legal & Policies',
        reviewPolicies: 'Review our terms and privacy policies',
        privacyPolicy: 'Privacy Policy',
        privacyPolicyDesc: 'How we collect, use, and protect your data',
        termsOfUse: 'Terms of Use',
        termsOfUseDesc: 'Terms and conditions for using LUXE',
        copyrightNotice: 'Copyright Notice',
        copyrightText1: '© 2024 LUXE Fashion App. All rights reserved.',
        copyrightText2: 'All product names, logos, and brands are property of their respective owners.',
        copyrightText3: 'Unauthorized reproduction, distribution, or transmission of any content from this application is strictly prohibited.',

        // Privacy Policy
        privacyPolicyTitle: 'Privacy Policy',
        privacyPolicyContent: 'Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our mobile application.',

        // Terms
        termsTitle: 'Terms of Use',
        termsContent: 'By accessing and using this application, you accept and agree to be bound by the terms and provision of this agreement.',

        // Premium Features
        doubleTapZoom: 'Double tap to zoom',
        shipping: 'Shipping',

        // Missing translations
        push: 'PUSH',
        emailSection: 'EMAIL',
        priceEach: 'each',
        continueBrowsing: 'Continue Browsing',
        itemsFromWishlist: 'Items from your wishlist are waiting',
        itemsViewedRecently: 'Items you viewed recently',
        notSignedInSubtitle: 'Not signed in',
    },

    ru: {
        // Common
        back: 'Назад',
        cancel: 'Отмена',
        save: 'Сохранить',
        done: 'Готово',
        loading: 'Загрузка...',
        error: 'Ошибка',
        success: 'Успешно',
        close: 'Закрыть',
        delete: 'Удалить',
        edit: 'Изменить',
        confirm: 'Подтвердить',

        // Tab Bar
        shop: 'Магазин',
        cart: 'Корзина',
        account: 'Аккаунт',

        // Auth
        welcome: 'С возвращением ✨',
        welcomeSubtitle: 'Войдите, чтобы открыть эксклюзивные стили',
        continueWithApple: 'Войти через Apple',
        continueWithGoogle: 'Войти через Google',
        signUpWithEmail: 'Регистрация по Email',
        termsAgree: 'Продолжая, вы соглашаетесь с',
        terms: 'Условиями',
        and: 'и',
        privacy: 'Политикой',

        // Sign Up
        createAccount: 'Создать аккаунт',
        joinLuxe: 'Присоединяйтесь к LUXE',
        name: 'Имя',
        email: 'Email',
        password: 'Пароль',
        confirmPassword: 'Подтвердите пароль',
        signUp: 'Зарегистрироваться',
        alreadyHaveAccount: 'Уже есть аккаунт?',
        signIn: 'Войти',

        // Home
        searchPlaceholder: 'Поиск товаров...',
        all: 'Все',
        men: 'Мужское',
        women: 'Женское',
        recentlyViewed: 'Недавно просмотренные',
        yourWishlist: 'Избранное 💕',
        savedItems: 'сохранённых товаров',
        savedItem: 'сохранённый товар',
        newDrops: 'НОВИНКИ',
        collection: 'Коллекция',
        noProducts: 'Товары не найдены',

        // Categories
        shirts: 'Рубашки',
        jackets: 'Куртки',
        shoes: 'Обувь',
        accessories: 'Аксессуары',
        dresses: 'Платья',
        bags: 'Сумки',
        jewelry: 'Украшения',
        tops: 'Топы',
        forHer: 'Для неё',
        forHim: 'Для него',
        allProducts: 'Все товары',

        // Product
        selectSize: 'ВЫБЕРИТЕ РАЗМЕР',
        quantity: 'КОЛИЧЕСТВО',
        description: 'ОПИСАНИЕ',
        availableColors: 'ДОСТУПНЫЕ ЦВЕТА',
        addToBag: 'В корзину',
        addedToBag: '✓ Добавлено!',
        outOfStock: 'Нет в наличии',
        lowStock: 'Мало',
        inStock: 'В наличии',
        onlyLeft: 'Осталось только {count}!',
        reviews: 'отзывов',
        sizes: 'размеров',
        total: 'Итого',
        share: 'Поделиться',
        productNotFound: 'Товар не найден',
        selectSizeFirst: 'Выберите размер',
        selectSizeMessage: 'Пожалуйста, выберите размер перед добавлением в корзину.',

        // Cart
        shoppingBag: 'Корзина',
        yourBagEmpty: 'Ваша корзина пуста',
        emptyBagSubtitle: 'Время побаловать себя! Добавьте товары.',
        startShopping: 'За покупками',
        freeShippingQualify: '🎉 Бесплатная доставка!',
        moreForFreeShipping: 'Ещё ${amount} до бесплатной доставки',
        subtotal: 'Подытог',
        shipping: 'Доставка',
        free: 'БЕСПЛАТНО',
        checkout: 'Оформить',
        items: 'товаров',
        item: 'товар',
        size: 'Размер',

        // Currency & Filter
        currency: 'Валюта',
        selectCurrency: 'ВЫБЕРИТЕ ВАЛЮТУ',
        currencyNote: 'Курсы валют приблизительные и периодически обновляются.',
        filter: 'Фильтр',
        sortBy: 'СОРТИРОВКА',
        priceRange: 'ДИАПАЗОН ЦЕН',
        priceLowToHigh: 'Цена: по возрастанию',
        priceHighToLow: 'Цена: по убыванию',
        newest: 'Сначала новые',
        popular: 'Популярные',
        resetFilters: 'Сбросить',
        applyFilters: 'Применить',

        // Wishlist
        wishlist: 'Избранное',
        wishlistEmpty: 'Ваш список желаний пуст',
        wishlistEmptySubtitle: 'Нажмите на сердечко товаров, чтобы сохранить их',

        // Checkout
        shippingAddress: '📍 АДРЕС ДОСТАВКИ',
        paymentDetails: '💳 ОПЛАТА',
        orderItems: '🛍️ ТОВАРЫ',
        delivery: '📍 ДОСТАВКА',
        payment: '💳 ОПЛАТА',
        useSavedAddress: 'ИСПОЛЬЗОВАТЬ СОХРАНЁННЫЙ АДРЕС',
        selectAddress: 'Выберите адрес',
        orEnterManually: 'Или введите вручную',
        fullName: 'Полное имя',
        streetAddress: 'Адрес',
        city: 'Город',
        zipCode: 'Индекс',
        cardNumber: 'Номер карты',
        expiry: 'Срок (ММ/ГГ)',
        cvv: 'CVV',
        nameOnCard: 'Имя на карте',
        securePayment: 'Ваши платёжные данные защищены',
        continueBtn: 'Продолжить',
        placeOrder: '🎉 Оформить заказ',
        orderConfirmed: '🎉 Заказ оформлен!',
        orderNumber: 'Заказ №',
        confirmationSent: 'Вы получите подтверждение.',
        viewOrders: 'Мои заказы',
        keepShopping: 'Продолжить покупки',
        review: 'Проверка',
        missingInfo: 'Не заполнено',
        fillAllFields: 'Пожалуйста, заполните все поля доставки',
        invalidCard: 'Неверная карта',
        enterValidCard: 'Введите корректный номер карты',
        invalidExpiry: 'Неверный срок',
        enterExpiry: 'Введите срок как ММ/ГГ',
        invalidCvv: 'Неверный CVV',
        enterValidCvv: 'Введите корректный CVV',
        missingName: 'Не указано имя',
        enterCardName: 'Введите имя на карте',
        tax: 'Налог',
        expires: 'Срок',
        qty: 'Кол-во',

        // Order History
        orderHistory: 'История заказов',
        noOrders: 'Заказов пока нет',
        noOrdersSubtitle: 'История заказов появится после первой покупки.',
        orderPlaced: 'Заказ оформлен',
        orderStatus: 'Статус',
        orderTotal: 'Итого',
        processing: 'Обрабатывается',
        shipped: 'Отправлен',
        delivered: 'Доставлен',

        // Account
        editProfile: 'Редактировать профиль',
        nameEmailPhone: 'Имя, email, телефон',
        viewPastPurchases: 'Прошлые покупки',
        notifications: 'Уведомления',
        pushEmailSettings: 'Push, email настройки',
        preferences: 'НАСТРОЙКИ',
        darkMode: 'Тёмная тема',
        darkModeOn: 'Вкл - Чёрная тема',
        darkModeOff: 'Выкл - Светлая тема',
        language: 'Язык',
        support: 'ПОДДЕРЖКА',
        supportTitle: 'Поддержка',
        whatsappEmailTelegram: 'WhatsApp, Email, Telegram',
        help: 'Помощь',
        howToPurchase: 'Как совершить покупку',
        legalDocuments: 'Документы',
        privacyCopyright: 'Политика, авторские права',
        logOut: 'Выйти',
        logOutConfirm: 'Вы уверены, что хотите выйти?',
        guestUser: 'Гость',
        notSignedIn: 'Не авторизован',

        // Edit Profile
        phone: 'Телефон',
        saveChanges: 'Сохранить изменения',
        profileUpdated: 'Профиль обновлён',
        profileUpdatedMessage: 'Ваш профиль успешно обновлён.',

        // Notifications
        notificationSettings: 'Настройки уведомлений',
        pushNotifications: 'Push-уведомления',
        pushNotificationsDesc: 'Получать уведомления на устройство',
        orderUpdates: 'Статус заказов',
        orderUpdatesDesc: 'Уведомления о статусе заказа',
        promotions: 'Акции и предложения',
        promotionsDesc: 'Получать специальные предложения',
        emailNotifications: 'Email-уведомления',
        emailNotificationsDesc: 'Получать маркетинговые письма',
        newArrivals: 'Новинки',
        newArrivalsDesc: 'Узнавать первым о новых товарах',

        // Support
        howCanWeHelp: 'Чем можем помочь?',
        teamHereToAssist: 'Наша команда готова помочь вам',
        workingHours: 'Часы работы',
        workingHoursValue: 'Пн-Пт, 10:00 - 19:00',
        contactUs: 'СВЯЗАТЬСЯ',
        whatsapp: 'WhatsApp',
        telegramBot: 'Telegram Бот',
        fastestResponse: '💡 Для быстрого ответа пишите в WhatsApp в рабочее время.',

        // Help
        shoppingGuide: 'Гид по покупкам',
        learnHowToPurchase: 'Узнайте как совершить покупку за 5 шагов',
        browseSelect: 'Просмотр и выбор',
        browseSelectDesc: 'Изучите нашу коллекцию. Нажмите на товар для просмотра деталей.',
        chooseSizeQty: 'Выбор размера',
        chooseSizeQtyDesc: 'Выберите размер и количество. Зелёный - в наличии, красный - мало.',
        addToCart: 'В корзину',
        addToCartDesc: 'Нажмите "В корзину". Можно добавить несколько товаров.',
        checkoutPay: 'Оформление и оплата',
        checkoutPayDesc: 'Введите адрес и данные карты. Бесплатная доставка от $100!',
        trackOrder: 'Отслеживание',
        trackOrderDesc: 'Отслеживайте заказ в "Истории заказов".',
        proTips: '💡 Советы',
        tip1: '• Добавляйте в избранное',
        tip2: '• Бесплатная доставка от $100',
        tip3: '• Следите за значком "Мало"',
        readyToShop: 'Готовы к покупкам?',
        toCatalog: 'В каталог',

        // Legal
        legalPolicies: 'Документы',
        reviewPolicies: 'Политика и условия использования',
        privacyPolicy: 'Политика конфиденциальности',
        privacyPolicyDesc: 'Как мы собираем и защищаем ваши данные',
        termsOfUse: 'Условия использования',
        termsOfUseDesc: 'Условия использования LUXE',
        copyrightNotice: 'Авторские права',
        copyrightText1: '© 2024 LUXE Fashion App. Все права защищены.',
        copyrightText2: 'Все названия продуктов и бренды принадлежат их владельцам.',
        copyrightText3: 'Несанкционированное копирование контента запрещено.',

        // Privacy Policy
        privacyPolicyTitle: 'Политика конфиденциальности',
        privacyPolicyContent: 'Ваша конфиденциальность важна для нас. Эта политика объясняет, как мы собираем, используем и защищаем вашу информацию.',

        // Terms
        termsTitle: 'Условия использования',
        termsContent: 'Используя это приложение, вы соглашаетесь с условиями данного соглашения.',

        // Premium Features
        doubleTapZoom: 'Двойной тап для увеличения',
        shipping: 'Доставка',

        // Missing translations
        push: 'УВЕДОМЛЕНИЯ',
        emailSection: 'ПОЧТА',
        priceEach: 'за шт.',
        continueBrowsing: 'Продолжить просмотр',
        itemsFromWishlist: 'Товары из вашего списка желаний ждут вас',
        itemsViewedRecently: 'Недавно просмотренные товары',
        notSignedInSubtitle: 'Не авторизован',

        // New Features
        features: 'ФУНКЦИИ',
        savedAddresses: 'Сохранённые адреса',
        manageAddresses: 'Управление адресами доставки',
        arTryOn: 'AR примерка',
        tryAccessories: 'Примерьте очки и шляпы',
        biometricLogin: 'Face ID / Touch ID',
        biometricLoginDesc: 'Биометрическая аутентификация',
        noAddresses: 'Нет сохранённых адресов',
        addAddressHint: 'Добавьте адрес для быстрого оформления',
        addAddress: 'Добавить адрес',
        editAddress: 'Редактировать адрес',
        deleteAddress: 'Удалить адрес',
        deleteAddressConfirm: 'Вы уверены, что хотите удалить этот адрес?',
        default: 'По умолчанию',
        fullName: 'ПОЛНОЕ ИМЯ',
        phoneNumber: 'НОМЕР ТЕЛЕФОНА',
        streetAddress: 'УЛИЦА',
        city: 'ГОРОД',
        country: 'СТРАНА',
        cameraPermission: 'Требуется доступ к камере',
        cameraPermissionDesc: 'Разрешите доступ к камере для AR примерки',
        grantPermission: 'Разрешить',
        photoSaved: 'Фото сохранено!',
        photoSavedDesc: 'Ваше AR фото сохранено в галерею.',
        arHint: 'Выберите аксессуар и наведите на лицо',
        backInStock: 'Уведомления о наличии',
        backInStockDesc: 'Получать уведомления о появлении товаров',

        // Smart Size & Similar Products
        yourSize: 'Ваш размер',
        youMightLike: 'Вам также понравится',
        recentlyViewedSection: 'Недавно просмотренные',
        continueWhere: 'Продолжить просмотр',
    },

    kk: {
        // Common
        back: 'Артқа',
        cancel: 'Болдырмау',
        save: 'Сақтау',
        done: 'Дайын',
        loading: 'Жүктелуде...',
        error: 'Қате',
        success: 'Сәтті',
        close: 'Жабу',
        delete: 'Жою',
        edit: 'Өзгерту',
        confirm: 'Растау',

        // Tab Bar
        shop: 'Дүкен',
        cart: 'Себет',
        account: 'Аккаунт',

        // Auth
        welcome: 'Қош келдіңіз',
        welcomeSubtitle: 'Премиум сәнге қол жеткізу үшін жүйеге кіріңіз',
        continueWithApple: 'Apple арқылы жалғастыру',
        continueWithGoogle: 'Google арқылы жалғастыру',
        signUpWithEmail: 'Email арқылы тіркелу',
        termsAgree: 'Жалғастыру арқылы сіз келісесіз',
        terms: 'Шарттарға',
        and: 'және',
        privacy: 'Құпиялылық саясатына',

        // Sign Up
        createAccount: 'Аккаунт жасау',
        joinLuxe: 'LUXE-ке қосылыңыз',
        name: 'Аты',
        email: 'Email',
        password: 'Құпия сөз',
        confirmPassword: 'Құпия сөзді растаңыз',
        signUp: 'Тіркелу',
        alreadyHaveAccount: 'Аккаунт бар ма?',
        signIn: 'Кіру',

        // Home
        searchPlaceholder: 'Тауар іздеу...',
        all: 'Барлығы',
        men: 'Ерлер',
        women: 'Әйелдер',
        recentlyViewed: 'Соңғы қаралғандар',
        yourWishlist: 'Таңдаулылар',
        savedItems: 'сақталған',
        savedItem: 'сақталған',
        newDrops: 'ЖАҢА ТҮСІМДЕР',
        collection: 'Коллекция',
        noProducts: 'Тауар табылмады',

        // Categories
        shirts: 'Жейделер',
        jackets: 'Күртешелер',
        shoes: 'Аяқ киім',
        accessories: 'Аксессуарлар',
        dresses: 'Көйлектер',
        bags: 'Сөмкелер',
        jewelry: 'Зергерлік бұйымдар',
        tops: 'Жоғарғы киім',
        forHer: 'Оған арналған',
        forHim: 'Оған арналған',
        allProducts: 'Барлық тауарлар',

        // Product
        selectSize: 'ӨЛШЕМДІ ТАҢДАҢЫЗ',
        quantity: 'САНЫ',
        description: 'СИПАТТАМА',
        availableColors: 'ТҮСТЕР',
        addToBag: 'Себетке қосу',
        addedToBag: '✓ Қосылды!',
        outOfStock: 'Қоймада жоқ',
        lowStock: 'Аз',
        inStock: 'Бар',
        onlyLeft: 'Тек {count} қалды!',
        reviews: 'пікір',
        sizes: 'өлшем',
        total: 'Барлығы',
        share: 'Бөлісу',
        productNotFound: 'Тауар табылмады',
        selectSizeFirst: 'Өлшемді таңдаңыз',
        selectSizeMessage: 'Себетке қосу алдында өлшемді таңдаңыз.',

        // Cart
        shoppingBag: 'Себет',
        yourBagEmpty: 'Себет бос',
        emptyBagSubtitle: 'Каталогтан тауарларды таңдаңыз',
        startShopping: 'Сатып алуға өту',
        freeShippingQualify: 'Тегін жеткізу қолжетімді',
        moreForFreeShipping: 'Тегін жеткізуге дейін ${amount}',
        subtotal: 'Аралық сома',
        shipping: 'Жеткізу',
        free: 'ТЕГІН',
        checkout: 'Төлемге өту',
        items: 'тауар',
        item: 'тауар',
        size: 'Өлшем',

        // Currency & Filter
        currency: 'Валюта',
        selectCurrency: 'ВАЛЮТАНЫ ТАҢДАҢЫЗ',
        currencyNote: 'Айырбас бағамы шамамен және мерзімді түрде жаңартылады.',
        filter: 'Сүзгі',
        sortBy: 'СҰРЫПТАУ',
        priceRange: 'БАҒА ДИАПАЗОНЫ',
        priceLowToHigh: 'Баға: өсу бойынша',
        priceHighToLow: 'Баға: кему бойынша',
        newest: 'Жаңалары',
        popular: 'Танымал',
        resetFilters: 'Өшіру',
        applyFilters: 'Қолдану',

        // Wishlist
        wishlist: 'Таңдаулылар',
        wishlistEmpty: 'Таңдаулылар тізімі бос',
        wishlistEmptySubtitle: 'Сақтау үшін тауарлардағы жүректі басыңыз',

        // Checkout
        shippingAddress: '📍 ЖЕТКІЗУ МЕКЕНЖАЙЫ',
        paymentDetails: '💳 ТӨЛЕМ',
        orderItems: '🛍️ ТАУАРЛАР',
        delivery: '📍 ЖЕТКІЗУ',
        payment: '💳 ТӨЛЕМ',
        useSavedAddress: 'САҚТАЛҒАН МЕКЕНЖАЙДЫ ПАЙДАЛАНУ',
        selectAddress: 'Мекенжайды таңдаңыз',
        orEnterManually: 'Немесе қолмен енгізіңіз',
        fullName: 'Толық аты',
        streetAddress: 'Мекенжай',
        city: 'Қала',
        zipCode: 'Индекс',
        cardNumber: 'Карта нөмірі',
        expiry: 'Мерзімі (АА/ЖЖ)',
        cvv: 'CVV',
        nameOnCard: 'Картадағы ат',
        securePayment: 'Төлем деректеріңіз қорғалған',
        continueBtn: 'Жалғастыру',
        placeOrder: 'Тапсырыс беру',
        orderConfirmed: 'Тапсырыс расталды',
        orderNumber: 'Тапсырыс №',
        confirmationSent: 'Растау хабарламасы жіберіледі.',
        viewOrders: 'Тапсырыстарды қарау',
        keepShopping: 'Сатып алуды жалғастыру',
        review: 'Тексеру',
        missingInfo: 'Толтырылмаған',
        fillAllFields: 'Барлық жеткізу өрістерін толтырыңыз',
        invalidCard: 'Карта қате',
        enterValidCard: 'Дұрыс карта нөмірін енгізіңіз',
        invalidExpiry: 'Мерзімі қате',
        enterExpiry: 'Мерзімді АА/ЖЖ ретінде енгізіңіз',
        invalidCvv: 'CVV қате',
        enterValidCvv: 'Дұрыс CVV енгізіңіз',
        missingName: 'Ат жоқ',
        enterCardName: 'Картадағы атты енгізіңіз',
        tax: 'Салық',
        expires: 'Мерзімі',
        qty: 'Саны',

        // Order History
        orderHistory: 'Тапсырыстар тарихы',
        noOrders: 'Тапсырыстар жоқ',
        noOrdersSubtitle: 'Тапсырыстар тарихы бірінші сатып алудан кейін пайда болады.',
        orderPlaced: 'Тапсырыс берілді',
        orderStatus: 'Статус',
        orderTotal: 'Барлығы',
        processing: 'Өңделуде',
        shipped: 'Жіберілді',
        delivered: 'Жеткізілді',

        // Account
        editProfile: 'Профильді өңдеу',
        nameEmailPhone: 'Аты, email, телефон',
        viewPastPurchases: 'Өткен сатып алулар',
        notifications: 'Хабарландырулар',
        pushEmailSettings: 'Push, email баптаулар',
        preferences: 'БАПТАУЛАР',
        darkMode: 'Қараңғы тема',
        darkModeOn: 'Қосулы - Қара тема',
        darkModeOff: 'Өшірулі - Ашық тема',
        language: 'Тіл',
        support: 'ҚОЛДАУ',
        supportTitle: 'Қолдау',
        whatsappEmailTelegram: 'WhatsApp, Email, Telegram',
        help: 'Көмек',
        howToPurchase: 'Қалай сатып алуға болады',
        legalDocuments: 'Құжаттар',
        privacyCopyright: 'Құпиялылық, авторлық құқық',
        logOut: 'Шығу',
        logOutConfirm: 'Жүйеден шығуды қалайсыз ба?',
        guestUser: 'Қонақ',
        notSignedIn: 'Жүйеге кірілмеген',

        // Edit Profile
        phone: 'Телефон',
        saveChanges: 'Өзгерістерді сақтау',
        profileUpdated: 'Профиль жаңартылды',
        profileUpdatedMessage: 'Профиліңіз сәтті жаңартылды.',

        // Notifications
        notificationSettings: 'Хабарландыру баптаулары',
        pushNotifications: 'Push-хабарландырулар',
        pushNotificationsDesc: 'Құрылғыға хабарландырулар алу',
        orderUpdates: 'Тапсырыс статусы',
        orderUpdatesDesc: 'Тапсырыс статусы туралы хабарландырулар',
        promotions: 'Акциялар мен ұсыныстар',
        promotionsDesc: 'Арнайы ұсыныстар алу',
        emailNotifications: 'Email-хабарландырулар',
        emailNotificationsDesc: 'Маркетингтік хаттар алу',
        newArrivals: 'Жаңа түсімдер',
        newArrivalsDesc: 'Жаңа тауарлар туралы бірінші білу',

        // Support
        howCanWeHelp: 'Қалай көмектесе аламыз?',
        teamHereToAssist: 'Біздің команда сізге көмектесуге дайын',
        workingHours: 'Жұмыс уақыты',
        workingHoursValue: 'Дс-Жм, 10:00 - 19:00',
        contactUs: 'БАЙЛАНЫС',
        whatsapp: 'WhatsApp',
        telegramBot: 'Telegram Бот',
        fastestResponse: 'Жылдам жауап алу үшін WhatsApp-қа жазыңыз.',

        // Help
        shoppingGuide: 'Сатып алу нұсқаулығы',
        learnHowToPurchase: '5 қадамда сатып алуды үйреніңіз',
        browseSelect: 'Қарау және таңдау',
        browseSelectDesc: 'Коллекцияны қараңыз. Толық ақпарат үшін тауарды түртіңіз.',
        chooseSizeQty: 'Өлшемді таңдау',
        chooseSizeQtyDesc: 'Өлшем мен санын таңдаңыз. Жасыл - бар, қызыл - аз.',
        addToCart: 'Себетке қосу',
        addToCartDesc: '"Себетке қосу" түймесін басыңыз.',
        checkoutPay: 'Рәсімдеу және төлеу',
        checkoutPayDesc: 'Мекенжай мен карта деректерін енгізіңіз. $100-ден тегін жеткізу!',
        trackOrder: 'Тапсырысты бақылау',
        trackOrderDesc: 'Тапсырысты "Тапсырыстар тарихы" бөлімінде бақылаңыз.',
        proTips: 'Кеңестер',
        tip1: '• Таңдаулыларға қосыңыз',
        tip2: '• $100-ден астам тегін жеткізу',
        tip3: '• "Аз" белгісін қадағалаңыз',
        readyToShop: 'Сатып алуға дайынсыз ба?',
        toCatalog: 'Каталогқа',

        // Legal
        legalPolicies: 'Құжаттар',
        reviewPolicies: 'Саясат пен шарттарды қараңыз',
        privacyPolicy: 'Құпиялылық саясаты',
        privacyPolicyDesc: 'Деректерді қалай жинаймыз және қорғаймыз',
        termsOfUse: 'Пайдалану шарттары',
        termsOfUseDesc: 'LUXE пайдалану шарттары',
        copyrightNotice: 'Авторлық құқық',
        copyrightText1: '© 2024 LUXE Fashion App. Барлық құқықтар қорғалған.',
        copyrightText2: 'Барлық тауар атаулары мен брендтер иелеріне тиесілі.',
        copyrightText3: 'Контентті рұқсатсыз көшіруге тыйым салынады.',

        // Privacy Policy
        privacyPolicyTitle: 'Құпиялылық саясаты',
        privacyPolicyContent: 'Сіздің құпиялылығыңыз біз үшін маңызды. Бұл саясат біздің ақпаратты қалай жинайтынымызды түсіндіреді.',

        // Terms
        termsTitle: 'Пайдалану шарттары',
        termsContent: 'Осы қолданбаны пайдалана отырып, сіз осы келісім шарттарымен келісесіз.',

        // Premium Features
        doubleTapZoom: 'Үлкейту үшін екі рет түртіңіз',
        shipping: 'Жеткізу',

        // Missing translations
        push: 'ХАБАРЛАМАЛАР',
        emailSection: 'EMAIL',
        priceEach: 'дана',
        continueBrowsing: 'Қарауды жалғастыру',
        itemsFromWishlist: 'Таңдаулылар тізіміндегі тауарлар',
        itemsViewedRecently: 'Жақында қаралған тауарлар',
        notSignedInSubtitle: 'Жүйеге кіру қажет',

        // New Features
        features: 'ФУНКЦИЯЛАР',
        savedAddresses: 'Сақталған мекенжайлар',
        manageAddresses: 'Жеткізу мекенжайларын басқару',
        arTryOn: 'AR киіп көру',
        tryAccessories: 'Көзілдірік пен бас киімді киіп көріңіз',
        biometricLogin: 'Face ID / Touch ID',
        biometricLoginDesc: 'Биометриялық аутентификация',
        noAddresses: 'Сақталған мекенжай жоқ',
        addAddressHint: 'Тез тіркелу үшін мекенжай қосыңыз',
        addAddress: 'Мекенжай қосу',
        editAddress: 'Мекенжайды өзгерту',
        deleteAddress: 'Мекенжайды жою',
        deleteAddressConfirm: 'Бұл мекенжайды жоюды қалайсыз ба?',
        default: 'Әдепкі',
        fullName: 'ТОЛЫҚ АТЫ',
        phoneNumber: 'ТЕЛЕФОН НӨМІРІ',
        streetAddress: 'КӨШЕ',
        city: 'ҚАЛА',
        country: 'ЕЛ',
        cameraPermission: 'Камераға рұқсат қажет',
        cameraPermissionDesc: 'AR киіп көру үшін камераға рұқсат беріңіз',
        grantPermission: 'Рұқсат беру',
        photoSaved: 'Фото сақталды!',
        photoSavedDesc: 'AR фотосуретіңіз галереяға сақталды.',
        arHint: 'Аксессуарды таңдап, бетке бағыттаңыз',
        backInStock: 'Қол жетімділік туралы хабарлама',
        backInStockDesc: 'Тауарлар пайда болғанда хабарлама алу',

        // Smart Size & Similar Products
        yourSize: 'Сіздің өлшеміңіз',
        youMightLike: 'Сізге ұнауы мүмкін',
        recentlyViewedSection: 'Жақында қаралған',
        continueWhere: 'Қарауды жалғастыру',
    },
};

const languageNames = {
    en: 'English',
    ru: 'Русский',
    kk: 'Қазақша',
};

const languageFlags = {
    en: '🇬🇧',
    ru: '🇷🇺',
    kk: '🇰🇿',
};

export function LanguageProvider({ children }) {
    const [language, setLanguage] = useState('en');

    useEffect(() => {
        loadLanguage();
    }, []);

    const loadLanguage = async () => {
        try {
            const savedLang = await AsyncStorage.getItem(LANGUAGE_STORAGE_KEY);
            if (savedLang && translations[savedLang]) {
                setLanguage(savedLang);
            }
        } catch (e) {
            console.log('Error loading language:', e);
        }
    };

    const changeLanguage = async (lang) => {
        if (translations[lang]) {
            setLanguage(lang);
            try {
                await AsyncStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
            } catch (e) {
                console.log('Error saving language:', e);
            }
        }
    };

    const t = (key, params = {}) => {
        let text = translations[language][key] || translations['en'][key] || key;

        // Replace parameters like {count}
        Object.keys(params).forEach(param => {
            text = text.replace(`{${param}}`, params[param]);
        });

        return text;
    };

    return (
        <LanguageContext.Provider value={{
            language,
            changeLanguage,
            t,
            languageNames,
            languageFlags,
            availableLanguages: Object.keys(translations),
        }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
