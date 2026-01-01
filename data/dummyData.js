// Product data with gender categories
export const products = [
    // MEN'S PRODUCTS
    {
        id: '1',
        name: 'Classic Oxford Shirt',
        brand: 'HUGO',
        price: 129.99,
        emoji: '👔',
        image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=400&h=400&fit=crop',
        category: 'men',
        description: 'A timeless oxford shirt crafted from premium cotton. Perfect for both formal and casual occasions.',
        colors: ['White', 'Light Blue', 'Pink'],
        sizes: [
            { size: 'S', stock: 5 },
            { size: 'M', stock: 12 },
            { size: 'L', stock: 8 },
            { size: 'XL', stock: 3 },
        ]
    },
    {
        id: '2',
        name: 'Leather Bomber Jacket',
        brand: 'ARMANI',
        price: 449.99,
        emoji: '🧥',
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop',
        category: 'men',
        description: 'Luxurious Italian leather bomber jacket with silk lining. A statement piece for the modern gentleman.',
        colors: ['Black', 'Brown', 'Navy'],
        sizes: [
            { size: 'S', stock: 2 },
            { size: 'M', stock: 4 },
            { size: 'L', stock: 6 },
            { size: 'XL', stock: 3 },
        ]
    },
    {
        id: '3',
        name: 'Sport Sneakers',
        brand: 'NIKE',
        price: 189.99,
        emoji: '👟',
        image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=400&fit=crop',
        category: 'men',
        description: 'Premium athletic sneakers with responsive cushioning and breathable mesh upper.',
        colors: ['White/Black', 'All Black', 'Grey'],
        sizes: [
            { size: '40', stock: 4 },
            { size: '41', stock: 8 },
            { size: '42', stock: 10 },
            { size: '43', stock: 6 },
            { size: '44', stock: 3 },
        ]
    },
    {
        id: '4',
        name: 'Cashmere Scarf',
        brand: 'BURBERRY',
        price: 279.99,
        emoji: '🧣',
        image: 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?w=400&h=400&fit=crop',
        category: 'men',
        description: 'Ultra-soft 100% cashmere scarf with signature check pattern. An elegant winter essential.',
        colors: ['Classic Check', 'Grey', 'Navy'],
        sizes: [
            { size: 'ONE SIZE', stock: 15 },
        ]
    },
    {
        id: '5',
        name: 'Baseball Cap',
        brand: 'SUPREME',
        price: 89.99,
        emoji: '🧢',
        image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=400&h=400&fit=crop',
        category: 'men',
        description: 'Limited edition streetwear cap with embroidered logo. Made from premium cotton twill.',
        colors: ['Black', 'Red', 'White'],
        sizes: [
            { size: 'ONE SIZE', stock: 0 },
        ]
    },
    {
        id: '6',
        name: 'Slim Fit Chinos',
        brand: 'RALPH LAUREN',
        price: 149.99,
        emoji: '👖',
        image: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=400&h=400&fit=crop',
        category: 'men',
        description: 'Classic slim-fit chinos crafted from stretch cotton twill. Perfect for business casual.',
        colors: ['Khaki', 'Navy', 'Olive'],
        sizes: [
            { size: '30', stock: 6 },
            { size: '32', stock: 10 },
            { size: '34', stock: 8 },
            { size: '36', stock: 4 },
        ]
    },

    // WOMEN'S PRODUCTS
    {
        id: '7',
        name: 'Silk Evening Dress',
        brand: 'VALENTINO',
        price: 899.99,
        emoji: '👗',
        image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop',
        category: 'women',
        description: 'Stunning silk evening dress with delicate draping. Red carpet ready elegance.',
        colors: ['Black', 'Burgundy', 'Champagne'],
        sizes: [
            { size: 'XS', stock: 2 },
            { size: 'S', stock: 5 },
            { size: 'M', stock: 7 },
            { size: 'L', stock: 3 },
        ]
    },
    {
        id: '8',
        name: 'Designer Handbag',
        brand: 'GUCCI',
        price: 1299.99,
        emoji: '👜',
        image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop',
        category: 'women',
        description: 'Iconic designer handbag with GG pattern. Genuine leather with gold hardware.',
        colors: ['Beige/Brown', 'Black', 'Pink'],
        sizes: [
            { size: 'SMALL', stock: 4 },
            { size: 'MEDIUM', stock: 6 },
            { size: 'LARGE', stock: 2 },
        ]
    },
    {
        id: '9',
        name: 'Cashmere Sweater',
        brand: 'LORO PIANA',
        price: 549.99,
        emoji: '🧶',
        image: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400&h=400&fit=crop',
        category: 'women',
        description: 'Ultra-luxurious baby cashmere sweater. Incredibly soft and warm.',
        colors: ['Cream', 'Dusty Rose', 'Camel'],
        sizes: [
            { size: 'XS', stock: 3 },
            { size: 'S', stock: 7 },
            { size: 'M', stock: 9 },
            { size: 'L', stock: 4 },
        ]
    },
    {
        id: '10',
        name: 'Stiletto Heels',
        brand: 'JIMMY CHOO',
        price: 695.99,
        emoji: '👠',
        image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=400&fit=crop',
        category: 'women',
        description: 'Elegant patent leather stilettos with signature pointed toe. 100mm heel.',
        colors: ['Black', 'Nude', 'Red'],
        sizes: [
            { size: '36', stock: 2 },
            { size: '37', stock: 5 },
            { size: '38', stock: 8 },
            { size: '39', stock: 4 },
            { size: '40', stock: 1 },
        ]
    },
    {
        id: '11',
        name: 'Bikini Set',
        brand: 'VERSACE',
        price: 349.99,
        emoji: '👙',
        localImage: require('../assets/Flower-Bikini-2018-New-Women-s-Push-Up-Padded-Bra-Bikini-Set-High-Waist-Bathing-Suit.webp'),
        category: 'women',
        description: 'Bold Baroque print bikini set. Italian designed, perfect for the beach or poolside.',
        colors: ['Gold Print', 'Pink Print', 'Blue Print'],
        sizes: [
            { size: 'XS', stock: 4 },
            { size: 'S', stock: 8 },
            { size: 'M', stock: 6 },
            { size: 'L', stock: 2 },
        ]
    },
    {
        id: '12',
        name: 'Pearl Necklace',
        brand: 'TIFFANY',
        price: 1899.99,
        emoji: '📿',
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=400&h=400&fit=crop',
        category: 'women',
        description: 'Classic Akoya pearl strand necklace with 18k white gold clasp. Timeless elegance.',
        colors: ['White Pearl', 'Pink Pearl'],
        sizes: [
            { size: '16"', stock: 3 },
            { size: '18"', stock: 5 },
            { size: '20"', stock: 2 },
        ]
    },
];

export const getProductById = (id) => {
    return products.find(p => p.id === id);
};

export const getProductsByCategory = (category) => {
    if (category === 'all') return products;
    return products.filter(p => p.category === category);
};

export const getMenProducts = () => products.filter(p => p.category === 'men');
export const getWomenProducts = () => products.filter(p => p.category === 'women');

export const getStockStatus = (product, size) => {
    const sizeData = product.sizes?.find(s => s.size === size);
    if (!sizeData) return null;

    if (sizeData.stock === 0) return { status: 'out', stock: 0, label: 'Out of Stock' };
    if (sizeData.stock <= 3) return { status: 'low', stock: sizeData.stock, label: `Only ${sizeData.stock} left!` };
    return { status: 'in', stock: sizeData.stock, label: 'In Stock' };
};
