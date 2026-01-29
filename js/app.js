// ===================================
// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
// ===================================

// Инициализация приложения
document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    console.log('🚀 Инициализация приложения...');
    
    // Скрываем loader и показываем приложение
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('app').classList.add('fade-in');
    }, 800);
    
    // Обновляем бейдж корзины
    cart.updateBadge();
    
    // Устанавливаем имя пользователя в форму, если доступно
    const userName = telegramApp.getUserName();
    if (userName && userName !== 'Test User') {
        document.getElementById('customerName').value = userName;
    }
    
    // Настройка обработчика клика по иконке корзины
    document.getElementById('cartIcon').addEventListener('click', showCart);
    
    // Инициализация маски телефона
    initPhoneMask();
    
    console.log('✅ Приложение готово к работе');
}

// ===================================
// УПРАВЛЕНИЕ ИЗОБРАЖЕНИЯМИ
// ===================================

function changeImage(thumbnail) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    // Обновляем главное изображение
    mainImage.src = thumbnail.src.replace('w=200', 'w=800');
    
    // Обновляем активный thumbnail
    thumbnails.forEach(t => t.classList.remove('active'));
    thumbnail.classList.add('active');
    
    telegramApp.hapticFeedback('light');
}

// ===================================
// УПРАВЛЕНИЕ КОЛИЧЕСТВОМ
// ===================================

function increaseQty() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue < 10) {
        input.value = currentValue + 1;
        updateButtonPrice();
        telegramApp.hapticFeedback('light');
    }
}

function decreaseQty() {
    const input = document.getElementById('quantity');
    const currentValue = parseInt(input.value);
    if (currentValue > 1) {
        input.value = currentValue - 1;
        updateButtonPrice();
        telegramApp.hapticFeedback('light');
    }
}

function updateButtonPrice() {
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = CONFIG.PRODUCT.price * quantity;
    document.getElementById('btnPrice').textContent = `${totalPrice.toLocaleString('ru-RU')} ₽`;
}

// ===================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// ===================================

function addToCart() {
    const quantity = parseInt(document.getElementById('quantity').value);
    
    cart.add(CONFIG.PRODUCT, quantity);
    
    // Показываем уведомление
    telegramApp.showAlert(`✅ Добавлено в корзину: ${quantity} шт.`);
    
    // Переходим в корзину
    setTimeout(() => {
        showCart();
    }, 500);
}

// ===================================
// НАВИГАЦИЯ МЕЖДУ СЕКЦИЯМИ
// ===================================

function showProduct() {
    hideAllSections();
    document.getElementById('productSection').style.display = 'block';
    telegramApp.hapticFeedback('light');
}

function showCart() {
    hideAllSections();
    document.getElementById('cartSection').style.display = 'block';
    
    if (cart.isEmpty()) {
        document.getElementById('cartEmpty').style.display = 'block';
        document.getElementById('cartContent').style.display = 'none';
    } else {
        document.getElementById('cartEmpty').style.display = 'none';
        document.getElementById('cartContent').style.display = 'block';
        renderCart();
    }
    
    telegramApp.hapticFeedback('light');
}

function showCheckout() {
    if (cart.isEmpty()) {
        telegramApp.showAlert('❌ Корзина пуста');
        return;
    }
    
    hideAllSections();
    document.getElementById('checkoutSection').style.display = 'block';
    renderCheckoutSummary();
    telegramApp.hapticFeedback('medium');
}

function hideAllSections() {
    document.getElementById('productSection').style.display = 'none';
    document.getElementById('cartSection').style.display = 'none';
    document.getElementById('checkoutSection').style.display = 'none';
    document.getElementById('successSection').style.display = 'none';
}

// ===================================
// РЕНДЕРИНГ КОРЗИНЫ
// ===================================

function renderCart() {
    const container = document.getElementById('cartItems');
    const items = cart.getItems();
    
    container.innerHTML = items.map(item => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" class="cart-item-image">
            <div class="cart-item-info">
                <div class="cart-item-title">${item.name}</div>
                <div class="cart-item-details">
                    <span class="cart-item-qty">Количество: ${item.quantity}</span>
                    <span class="cart-item-price">${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
                </div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart('${item.id}')">
                🗑️
            </button>
        </div>
    `).join('');
    
    // Обновляем итоги
    const subtotal = cart.getTotal();
    const deliveryCost = cart.getDeliveryCost();
    const total = cart.getFinalTotal();
    
    document.getElementById('subtotal').textContent = `${subtotal.toLocaleString('ru-RU')} ₽`;
    
    const deliveryElement = document.getElementById('deliveryCost');
    if (deliveryCost === 0) {
        deliveryElement.textContent = 'Бесплатно';
        deliveryElement.className = 'free';
    } else {
        deliveryElement.textContent = `${deliveryCost.toLocaleString('ru-RU')} ₽`;
        deliveryElement.className = '';
    }
    
    document.getElementById('total').textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

function removeFromCart(productId) {
    telegramApp.showConfirm('Удалить товар из корзины?', (confirmed) => {
        if (confirmed) {
            cart.remove(productId);
            
            if (cart.isEmpty()) {
                document.getElementById('cartEmpty').style.display = 'block';
                document.getElementById('cartContent').style.display = 'none';
            } else {
                renderCart();
            }
        }
    });
}

// ===================================
// РЕНДЕРИНГ ЧЕКАУТА
// ===================================

function renderCheckoutSummary() {
    const items = cart.getItems();
    const container = document.getElementById('checkoutItems');
    
    container.innerHTML = items.map(item => `
        <div class="summary-item">
            <span>${item.name} × ${item.quantity}</span>
            <span>${(item.price * item.quantity).toLocaleString('ru-RU')} ₽</span>
        </div>
    `).join('');
    
    const total = cart.getFinalTotal();
    document.getElementById('checkoutTotal').textContent = `${total.toLocaleString('ru-RU')} ₽`;
    document.getElementById('submitTotal').textContent = `${total.toLocaleString('ru-RU')} ₽`;
}

// ===================================
// ОТПРАВКА ЗАКАЗА
// ===================================

async function submitOrder(event) {
    event.preventDefault();
    
    const submitBtn = document.getElementById('submitOrderBtn');
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<span>Оформление...</span><span>⏳</span>';
    
    telegramApp.hapticFeedback('medium');
    
    // Собираем данные формы
    const formData = {
        customer: {
            name: document.getElementById('customerName').value,
            phone: document.getElementById('customerPhone').value,
            email: document.getElementById('customerEmail').value || 'Не указан',
        },
        delivery: {
            city: document.getElementById('city').value,
            address: document.getElementById('address').value,
        },
        comment: document.getElementById('comment').value || 'Нет комментариев',
        order: {
            items: cart.getItems(),
            subtotal: cart.getTotal(),
            delivery: cart.getDeliveryCost(),
            total: cart.getFinalTotal(),
            timestamp: new Date().toISOString(),
            orderId: 'ORD-' + Date.now()
        },
        telegram: {
            userId: telegramApp.getUserId(),
            userName: telegramApp.getUserName()
        }
    };
    
    console.log('📤 Отправка заказа:', formData);
    
    try {
        // Отправляем в LEADTEX через вебхук
        const success = await sendToLeadtex(formData);
        
        if (success) {
            // Показываем страницу успеха
            showSuccess(formData);
            
            // Очищаем корзину
            cart.clear();
            
            telegramApp.hapticFeedback('success');
        } else {
            throw new Error('Ошибка отправки заказа');
        }
    } catch (error) {
        console.error('❌ Ошибка:', error);
        telegramApp.showAlert('❌ Произошла ошибка при оформлении заказа. Попробуйте еще раз.');
        
        submitBtn.disabled = false;
        submitBtn.innerHTML = `<span>Оформить заказ</span><span>${cart.getFinalTotal().toLocaleString('ru-RU')} ₽</span>`;
        
        telegramApp.hapticFeedback('error');
    }
}

// ===================================
// ОТПРАВКА В LEADTEX
// ===================================

async function sendToLeadtex(orderData) {
    try {
        const response = await fetch(CONFIG.WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contact_by: 'telegram_id',
                search: orderData.telegram.userId.toString(),
                variables: {
                    // Информация о заказе
                    order_id: orderData.order.orderId,
                    order_total: orderData.order.total.toString(),
                    order_subtotal: orderData.order.subtotal.toString(),
                    order_delivery: orderData.order.delivery.toString(),
                    order_items_count: orderData.order.items.length.toString(),
                    order_timestamp: orderData.order.timestamp,
                    
                    // Товары (в JSON формате)
                    order_items: JSON.stringify(orderData.order.items.map(item => ({
                        name: item.name,
                        quantity: item.quantity,
                        price: item.price,
                        total: item.price * item.quantity
                    }))),
                    
                    // Данные клиента
                    customer_name: orderData.customer.name,
                    customer_phone: orderData.customer.phone,
                    customer_email: orderData.customer.email,
                    
                    // Адрес доставки
                    delivery_city: orderData.delivery.city,
                    delivery_address: orderData.delivery.address,
                    
                    // Комментарий
                    order_comment: orderData.comment,
                    
                    // Источник
                    source: 'mini_app_keychain_shop',
                    
                    // Telegram данные
                    telegram_user_name: orderData.telegram.userName
                }
            })
        });
        
        if (response.ok) {
            console.log('✅ Заказ успешно отправлен в LEADTEX');
            return true;
        } else {
            console.error('❌ Ошибка ответа сервера:', response.status);
            return false;
        }
    } catch (error) {
        console.error('❌ Ошибка отправки в LEADTEX:', error);
        return false;
    }
}

// ===================================
// ЭКРАН УСПЕХА
// ===================================

function showSuccess(orderData) {
    hideAllSections();
    document.getElementById('successSection').style.display = 'block';
    
    // Заполняем детали заказа
    const detailsContainer = document.getElementById('orderDetails');
    detailsContainer.innerHTML = `
        <h3>Детали заказа</h3>
        <p><strong>Номер заказа:</strong> ${orderData.order.orderId}</p>
        <p><strong>Сумма:</strong> ${orderData.order.total.toLocaleString('ru-RU')} ₽</p>
        <p><strong>Телефон:</strong> ${orderData.customer.phone}</p>
        <p><strong>Адрес:</strong> ${orderData.delivery.city}, ${orderData.delivery.address}</p>
    `;
}

function resetApp() {
    showProduct();
    document.getElementById('checkoutForm').reset();
    telegramApp.hapticFeedback('light');
}

// ===================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ===================================

function initPhoneMask() {
    const phoneInput = document.getElementById('customerPhone');
    
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.startsWith('8')) {
            value = '7' + value.substring(1);
        }
        
        if (value.startsWith('7') || value.startsWith('8')) {
            let formatted = '+7';
            if (value.length > 1) {
                formatted += ' (' + value.substring(1, 4);
            }
            if (value.length >= 5) {
                formatted += ') ' + value.substring(4, 7);
            }
            if (value.length >= 8) {
                formatted += '-' + value.substring(7, 9);
            }
            if (value.length >= 10) {
                formatted += '-' + value.substring(9, 11);
            }
            e.target.value = formatted;
        } else if (value.length > 0) {
            e.target.value = '+' + value;
        }
    });
    
    phoneInput.addEventListener('focus', function(e) {
        if (!e.target.value) {
            e.target.value = '+7 ';
        }
    });
}

// ===================================
// ГЛОБАЛЬНЫЕ ОБРАБОТЧИКИ
// ===================================

// Обработка кнопки "Назад" в Telegram
if (telegramApp.tg?.BackButton) {
    telegramApp.tg.BackButton.onClick(() => {
        const cartSection = document.getElementById('cartSection');
        const checkoutSection = document.getElementById('checkoutSection');
        
        if (checkoutSection.style.display !== 'none') {
            showCart();
        } else if (cartSection.style.display !== 'none') {
            showProduct();
        }
    });
}

// Предотвращение случайного закрытия при незавершенной форме
window.addEventListener('beforeunload', (e) => {
    if (!cart.isEmpty() && document.getElementById('checkoutSection').style.display !== 'none') {
        e.preventDefault();
        e.returnValue = '';
    }
});

console.log('📱 Приложение загружено и готово к работе');
