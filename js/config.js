// ===================================
// КОНФИГУРАЦИЯ ПРИЛОЖЕНИЯ
// ===================================

const CONFIG = {
    // URL вебхука LEADTEX (замените на свой)
    WEBHOOK_URL: 'https://rb786743.leadteh.ru/inner_webhook/4228d48d-9a90-40aa-b249-664e73405c4a',
    
    // Данные товара
    PRODUCT: {
        id: 'keychain-premium-001',
        name: 'Брелок Premium Edition',
        price: 990,
        oldPrice: 1490,
        image: 'https://images.unsplash.com/photo-1582719471137-c3967ffb1c42?w=800&q=80',
        description: 'Стильный металлический брелок премиум-класса',
        sku: 'KEY-PRE-001'
    },
    
    // Настройки доставки
    DELIVERY: {
        freeShippingThreshold: 1000, // Бесплатная доставка от этой суммы
        cost: 0, // Стоимость доставки (если меньше порога)
        estimatedDays: '1-3'
    },
    
    // Режим разработки (включить для тестирования без Telegram)
    DEV_MODE: false,
    
    // Mock данные для режима разработки
    MOCK_USER: {
        id: 123456789,
        first_name: 'Test',
        last_name: 'User',
        username: 'testuser',
        language_code: 'ru'
    }
};

// Экспорт для использования в других файлах
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
