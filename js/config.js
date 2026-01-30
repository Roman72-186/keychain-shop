// ===================================
// КОНФИГУРАЦИЯ МАГАЗИНА
// ===================================
// Для запуска на своем аккаунте LEADTEX достаточно изменить WEBHOOK_URL

const CONFIG = {
    // ===================================
    // НАСТРОЙКИ ИНТЕГРАЦИИ
    // ===================================

    // URL вебхука LEADTEX (единственное что нужно изменить для своего магазина)
    WEBHOOK_URL: '/api/webhook',

    // ===================================
    // НАСТРОЙКИ МАГАЗИНА
    // ===================================

    SHOP: {
        name: 'MiniShop',           // Название магазина
        logo: '🛍️',                 // Эмодзи логотипа
        currency: '₽',              // Валюта
        currencyCode: 'RUB'         // Код валюты
    },

    // ===================================
    // КАТЕГОРИИ ТОВАРОВ
    // ===================================

    CATEGORIES: [
        { id: 'all', name: 'Все товары', icon: '🏠' },
        { id: 'accessories', name: 'Аксессуары', icon: '🔑' },
        { id: 'electronics', name: 'Электроника', icon: '📱' },
        { id: 'clothing', name: 'Одежда', icon: '👕' },
        { id: 'home', name: 'Для дома', icon: '🏡' }
    ],

    // ===================================
    // КАТАЛОГ ТОВАРОВ
    // ===================================

    PRODUCTS: [
        {
            id: 'keychain-premium-001',
            name: 'Брелок Premium Edition',
            price: 990,
            oldPrice: 1490,
            category: 'accessories',
            badge: 'Хит продаж',
            rating: 4.9,
            reviews: 127,
            image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
                'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=800&q=80',
                'https://images.unsplash.com/photo-1614267118677-5285ffa7b6e2?w=800&q=80'
            ],
            description: 'Стильный металлический брелок премиум-класса. Идеально подходит для ключей от дома, автомобиля или офиса.',
            features: [
                { label: 'Материал', value: 'Нержавеющая сталь' },
                { label: 'Размер', value: '5 × 3 см' },
                { label: 'Вес', value: '25 г' },
                { label: 'Цвет', value: 'Серебристый' },
                { label: 'Гарантия', value: '1 год' }
            ],
            inStock: true
        },
        {
            id: 'wireless-charger-002',
            name: 'Беспроводная зарядка Qi',
            price: 1490,
            oldPrice: 2290,
            category: 'electronics',
            badge: 'Новинка',
            rating: 4.8,
            reviews: 89,
            image: 'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1591815302525-756a9bcc3425?w=800&q=80',
                'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800&q=80'
            ],
            description: 'Быстрая беспроводная зарядка с поддержкой стандарта Qi. Совместима с iPhone и Android устройствами.',
            features: [
                { label: 'Мощность', value: '15W' },
                { label: 'Стандарт', value: 'Qi' },
                { label: 'Совместимость', value: 'iPhone / Android' },
                { label: 'Размер', value: '10 × 10 см' },
                { label: 'LED индикатор', value: 'Да' }
            ],
            inStock: true
        },
        {
            id: 'cotton-tshirt-003',
            name: 'Футболка Classic Cotton',
            price: 1290,
            oldPrice: 1790,
            category: 'clothing',
            badge: '-28%',
            rating: 4.7,
            reviews: 234,
            image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&q=80',
                'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800&q=80'
            ],
            description: 'Классическая футболка из 100% хлопка. Мягкая ткань, удобный крой на каждый день.',
            features: [
                { label: 'Материал', value: '100% хлопок' },
                { label: 'Размеры', value: 'S, M, L, XL' },
                { label: 'Цвет', value: 'Белый' },
                { label: 'Уход', value: 'Машинная стирка' },
                { label: 'Страна', value: 'Турция' }
            ],
            inStock: true
        },
        {
            id: 'smart-watch-004',
            name: 'Смарт-часы FitPro',
            price: 3990,
            oldPrice: 5990,
            category: 'electronics',
            badge: 'Топ продаж',
            rating: 4.6,
            reviews: 512,
            image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&q=80',
                'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80'
            ],
            description: 'Умные часы с пульсометром, шагомером и уведомлениями. Водонепроницаемые, батарея до 7 дней.',
            features: [
                { label: 'Дисплей', value: '1.4" AMOLED' },
                { label: 'Батарея', value: '7 дней' },
                { label: 'Защита', value: 'IP68' },
                { label: 'Датчики', value: 'Пульс, SpO2, шаги' },
                { label: 'Bluetooth', value: '5.0' }
            ],
            inStock: true
        },
        {
            id: 'desk-lamp-005',
            name: 'LED Настольная лампа',
            price: 2490,
            oldPrice: 3290,
            category: 'home',
            badge: null,
            rating: 4.5,
            reviews: 78,
            image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80',
                'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=800&q=80'
            ],
            description: 'Современная LED лампа с регулировкой яркости и цветовой температуры. Идеальна для работы и чтения.',
            features: [
                { label: 'Мощность', value: '12W' },
                { label: 'Цвет. темп.', value: '2700K-6500K' },
                { label: 'Диммер', value: '5 уровней' },
                { label: 'Материал', value: 'Алюминий' },
                { label: 'USB порт', value: 'Да' }
            ],
            inStock: true
        },
        {
            id: 'leather-wallet-006',
            name: 'Кожаный кошелек',
            price: 1890,
            oldPrice: 2490,
            category: 'accessories',
            badge: 'Premium',
            rating: 4.9,
            reviews: 156,
            image: 'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
            images: [
                'https://images.unsplash.com/photo-1627123424574-724758594e93?w=800&q=80',
                'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?w=800&q=80'
            ],
            description: 'Компактный кошелек из натуральной кожи. Вместительный, стильный, долговечный.',
            features: [
                { label: 'Материал', value: 'Натуральная кожа' },
                { label: 'Карманы', value: '8 для карт' },
                { label: 'Размер', value: '11 × 9 см' },
                { label: 'Цвет', value: 'Коричневый' },
                { label: 'RFID защита', value: 'Да' }
            ],
            inStock: true
        }
    ],

    // ===================================
    // НАСТРОЙКИ ДОСТАВКИ
    // ===================================

    DELIVERY: {
        freeShippingThreshold: 2000,    // Бесплатная доставка от этой суммы
        cost: 299,                       // Стоимость доставки
        estimatedDays: '1-3'            // Срок доставки
    },

    // ===================================
    // РЕЖИМ РАЗРАБОТКИ
    // ===================================

    DEV_MODE: false,

    MOCK_USER: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'ru'
    },

    // ===================================
    // ВСПОМОГАТЕЛЬНЫЕ МЕТОДЫ
    // ===================================

    // Получить товар по ID
    getProductById(id) {
        return this.PRODUCTS.find(p => p.id === id);
    },

    // Получить товары по категории
    getProductsByCategory(categoryId) {
        if (categoryId === 'all') return this.PRODUCTS;
        return this.PRODUCTS.filter(p => p.category === categoryId);
    },

    // Форматирование цены
    formatPrice(price) {
        return price.toLocaleString('ru-RU') + ' ' + this.SHOP.currency;
    },

    // Рассчитать скидку в процентах
    getDiscount(price, oldPrice) {
        if (!oldPrice || oldPrice <= price) return 0;
        return Math.round((1 - price / oldPrice) * 100);
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
