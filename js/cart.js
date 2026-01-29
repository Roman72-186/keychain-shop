// ===================================
// УПРАВЛЕНИЕ КОРЗИНОЙ
// ===================================

class Cart {
    constructor() {
        this.items = [];
        this.load();
    }

    // Добавить товар в корзину
    add(product, quantity = 1) {
        const existingItem = this.items.find(item => item.id === product.id);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: quantity
            });
        }
        
        this.save();
        this.updateBadge();
        
        telegramApp.hapticFeedback('success');
        
        console.log('✅ Товар добавлен в корзину:', product.name, 'x', quantity);
    }

    // Удалить товар из корзины
    remove(productId) {
        this.items = this.items.filter(item => item.id !== productId);
        this.save();
        this.updateBadge();
        
        telegramApp.hapticFeedback('light');
        
        console.log('🗑️ Товар удален из корзины');
    }

    // Обновить количество товара
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => item.id === productId);
        if (item) {
            item.quantity = quantity;
            this.save();
            this.updateBadge();
        }
    }

    // Получить все товары
    getItems() {
        return this.items;
    }

    // Получить количество товаров
    getCount() {
        return this.items.reduce((sum, item) => sum + item.quantity, 0);
    }

    // Получить общую стоимость
    getTotal() {
        return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    }

    // Получить стоимость доставки
    getDeliveryCost() {
        const total = this.getTotal();
        return total >= CONFIG.DELIVERY.freeShippingThreshold ? 0 : CONFIG.DELIVERY.cost;
    }

    // Получить итоговую сумму с доставкой
    getFinalTotal() {
        return this.getTotal() + this.getDeliveryCost();
    }

    // Очистить корзину
    clear() {
        this.items = [];
        this.save();
        this.updateBadge();
        
        console.log('🗑️ Корзина очищена');
    }

    // Сохранить в localStorage
    save() {
        try {
            localStorage.setItem('cart', JSON.stringify(this.items));
        } catch (e) {
            console.error('Ошибка сохранения корзины:', e);
        }
    }

    // Загрузить из localStorage
    load() {
        try {
            const saved = localStorage.getItem('cart');
            if (saved) {
                this.items = JSON.parse(saved);
                this.updateBadge();
            }
        } catch (e) {
            console.error('Ошибка загрузки корзины:', e);
            this.items = [];
        }
    }

    // Обновить бейдж корзины
    updateBadge() {
        const badge = document.getElementById('cartBadge');
        if (badge) {
            const count = this.getCount();
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        }
    }

    // Проверка, пуста ли корзина
    isEmpty() {
        return this.items.length === 0;
    }
}

// Создаем глобальный экземпляр корзины
const cart = new Cart();
