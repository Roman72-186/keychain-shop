// ===================================
// ОСНОВНАЯ ЛОГИКА ПРИЛОЖЕНИЯ
// ===================================

// Текущее состояние
let currentCategory = 'all';
let currentProduct = null;

// ===================================
// ИНИЦИАЛИЗАЦИЯ
// ===================================

document.addEventListener('DOMContentLoaded', function() {
    initApp();
});

function initApp() {
    console.log('🚀 Инициализация приложения...');

    // Устанавливаем название и логотип магазина
    document.getElementById('shopName').textContent = CONFIG.SHOP.name;
    document.getElementById('shopLogo').textContent = CONFIG.SHOP.logo;
    document.title = CONFIG.SHOP.name + ' - Telegram Mini App';

    // Рендерим категории
    renderCategories();

    // Рендерим каталог товаров
    renderProducts();

    // Обновляем информацию о доставке
    updateDeliveryInfo();

    // Скрываем loader и показываем приложение
    setTimeout(() => {
        document.getElementById('loader').style.display = 'none';
        document.getElementById('app').style.display = 'block';
        document.getElementById('app').classList.add('fade-in');
    }, 500);

    // Обновляем бейдж корзины
    cart.updateBadge();

    // Настройка обработчика клика по иконке корзины
    document.getElementById('cartIcon').addEventListener('click', showCart);

    // Инициализация маски телефона
    initPhoneMask();

    console.log('✅ Приложение готово к работе');
}

// ===================================
// РЕНДЕРИНГ КАТЕГОРИЙ
// ===================================

function renderCategories() {
    const container = document.getElementById('categories');

    container.innerHTML = CONFIG.CATEGORIES.map(cat => `
        <button class="category-btn ${cat.id === currentCategory ? 'active' : ''}"
                onclick="selectCategory('${cat.id}')">
            <span class="category-icon">${cat.icon}</span>
            <span>${cat.name}</span>
        </button>
    `).join('');
}

function selectCategory(categoryId) {
    currentCategory = categoryId;
    renderCategories();
    renderProducts();
    telegramApp.hapticFeedback('light');
}

// ===================================
// РЕНДЕРИНГ КАТАЛОГА ТОВАРОВ
// ===================================

function renderProducts() {
    const container = document.getElementById('productsGrid');
    const products = CONFIG.getProductsByCategory(currentCategory);

    container.innerHTML = products.map(product => {
        const discount = CONFIG.getDiscount(product.price, product.oldPrice);

        return `
            <div class="product-card-mini" onclick="openProduct('${product.id}')">
                <div class="product-card-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                    ${product.badge ? `<div class="product-card-badge">${product.badge}</div>` : ''}
                </div>
                <div class="product-card-body">
                    <div class="product-card-name">${product.name}</div>
                    <div class="product-card-rating">
                        <span class="star">⭐</span>
                        <span>${product.rating}</span>
                        <span>(${product.reviews})</span>
                    </div>
                    <div class="product-card-prices">
                        <span class="product-card-price">${CONFIG.formatPrice(product.price)}</span>
                        ${product.oldPrice ? `<span class="product-card-old-price">${CONFIG.formatPrice(product.oldPrice)}</span>` : ''}
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

// ===================================
// СТРАНИЦА ТОВАРА
// ===================================

function openProduct(productId) {
    const product = CONFIG.getProductById(productId);
    if (!product) return;

    currentProduct = product;

    // Заполняем данные товара
    document.getElementById('mainImage').src = product.image;
    document.getElementById('productTitle').textContent = product.name;
    document.getElementById('productDescription').textContent = product.description;

    // Бейдж
    const badgeEl = document.getElementById('productBadge');
    if (product.badge) {
        badgeEl.textContent = product.badge;
        badgeEl.style.display = 'block';
    } else {
        badgeEl.style.display = 'none';
    }

    // Рейтинг
    document.getElementById('productRating').innerHTML = `
        <span class="stars">${'⭐'.repeat(Math.round(product.rating))}</span>
        <span class="rating-text">${product.rating} (${product.reviews} отзывов)</span>
    `;

    // Цены
    document.getElementById('productPrice').textContent = CONFIG.formatPrice(product.price);
    const oldPriceEl = document.getElementById('productOldPrice');
    const discountEl = document.getElementById('productDiscount');

    if (product.oldPrice) {
        oldPriceEl.textContent = CONFIG.formatPrice(product.oldPrice);
        oldPriceEl.style.display = 'block';

        const discount = CONFIG.getDiscount(product.price, product.oldPrice);
        discountEl.textContent = `-${discount}%`;
        discountEl.style.display = 'block';
    } else {
        oldPriceEl.style.display = 'none';
        discountEl.style.display = 'none';
    }

    // Характеристики
    document.getElementById('productFeatures').innerHTML = product.features.map(f =>
        `<li><strong>${f.label}:</strong> ${f.value}</li>`
    ).join('');

    // Миниатюры
    renderThumbnails(product.images);

    // Сброс количества
    document.getElementById('quantity').value = 1;
    updateButtonPrice();

    // Показываем страницу товара
    hideAllSections();
    document.getElementById('productSection').style.display = 'block';

    // Прокрутка вверх
    window.scrollTo(0, 0);

    telegramApp.hapticFeedback('light');
}

function renderThumbnails(images) {
    const container = document.getElementById('imageThumbnails');

    container.innerHTML = images.map((img, index) => `
        <img class="thumbnail ${index === 0 ? 'active' : ''}"
             src="${img.replace('w=800', 'w=200')}"
             alt="Вид ${index + 1}"
             onclick="changeImage(this, '${img}')">
    `).join('');
}

function changeImage(thumbnail, imageUrl) {
    const mainImage = document.getElementById('mainImage');
    const thumbnails = document.querySelectorAll('.thumbnail');

    mainImage.src = imageUrl;

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
    if (!currentProduct) return;
    const quantity = parseInt(document.getElementById('quantity').value);
    const totalPrice = currentProduct.price * quantity;
    document.getElementById('btnPrice').textContent = CONFIG.formatPrice(totalPrice);
}

// ===================================
// ДОБАВЛЕНИЕ В КОРЗИНУ
// ===================================

function addToCart() {
    if (!currentProduct) return;

    const quantity = parseInt(document.getElementById('quantity').value);

    cart.add(currentProduct, quantity);

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

function showCatalog() {
    hideAllSections();
    document.getElementById('catalogSection').style.display = 'block';
    currentProduct = null;
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

    // Устанавливаем имя пользователя в форму, если доступно
    const userName = telegramApp.getUserName();
    if (userName && userName !== 'Test User') {
        document.getElementById('customerName').value = userName;
    }

    renderCheckoutSummary();
    telegramApp.hapticFeedback('medium');
}

function hideAllSections() {
    document.getElementById('catalogSection').style.display = 'none';
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
                    <span class="cart-item-price">${CONFIG.formatPrice(item.price * item.quantity)}</span>
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

    document.getElementById('subtotal').textContent = CONFIG.formatPrice(subtotal);

    const deliveryElement = document.getElementById('deliveryCost');
    if (deliveryCost === 0) {
        deliveryElement.textContent = 'Бесплатно';
        deliveryElement.className = 'free';
    } else {
        deliveryElement.textContent = CONFIG.formatPrice(deliveryCost);
        deliveryElement.className = '';
    }

    document.getElementById('total').textContent = CONFIG.formatPrice(total);
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
            <span>${CONFIG.formatPrice(item.price * item.quantity)}</span>
        </div>
    `).join('');

    const total = cart.getFinalTotal();
    document.getElementById('checkoutTotal').textContent = CONFIG.formatPrice(total);
    document.getElementById('submitTotal').textContent = CONFIG.formatPrice(total);
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
        submitBtn.innerHTML = `<span>Оформить заказ</span><span>${CONFIG.formatPrice(cart.getFinalTotal())}</span>`;

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
                    source: 'mini_app_' + CONFIG.SHOP.name.toLowerCase().replace(/\s+/g, '_'),

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
        <p><strong>Сумма:</strong> ${CONFIG.formatPrice(orderData.order.total)}</p>
        <p><strong>Телефон:</strong> ${orderData.customer.phone}</p>
        <p><strong>Адрес:</strong> ${orderData.delivery.city}, ${orderData.delivery.address}</p>
    `;
}

function resetApp() {
    showCatalog();
    document.getElementById('checkoutForm').reset();
    telegramApp.hapticFeedback('light');
}

// ===================================
// ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ
// ===================================

function updateDeliveryInfo() {
    const deliveryInfoEl = document.getElementById('deliveryInfo');
    const deliveryDaysEl = document.getElementById('deliveryDays');

    if (deliveryInfoEl) {
        deliveryInfoEl.textContent = `Бесплатная доставка от ${CONFIG.formatPrice(CONFIG.DELIVERY.freeShippingThreshold)}`;
    }
    if (deliveryDaysEl) {
        deliveryDaysEl.textContent = `Доставка ${CONFIG.DELIVERY.estimatedDays} дня`;
    }
}

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
        const productSection = document.getElementById('productSection');
        const cartSection = document.getElementById('cartSection');
        const checkoutSection = document.getElementById('checkoutSection');

        if (checkoutSection.style.display !== 'none') {
            showCart();
        } else if (cartSection.style.display !== 'none') {
            showCatalog();
        } else if (productSection.style.display !== 'none') {
            showCatalog();
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
