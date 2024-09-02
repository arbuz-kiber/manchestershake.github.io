// Получение данных из localStorage
const storedData = JSON.parse(localStorage.getItem('clickerData')) || {
    counter: 0,
    clickPower: 1,
    energy: 300,
    maxEnergy: 300,
    upgradeCost: 300,
    upgradeEnergyCost: 1000,
    energyRecoveryRate: 1,
    recoveryInterval: 500, // Интервал восстановления энергии
};

// Обновление глобальных переменных
let counter = storedData.counter;
let clickPower = storedData.clickPower;
let energy = storedData.energy;
let maxEnergy = storedData.maxEnergy;
let upgradeCost = storedData.upgradeCost;
let upgradeEnergyCost = storedData.upgradeEnergyCost;
let energyRecoveryRate = storedData.energyRecoveryRate;
let recoveryInterval = storedData.recoveryInterval;
let recoveryTimer = null;
let clickCooldown = false;
let caseCooldown = false; // Кулдаун для кейса

// Обновление отображения данных на странице
const updateDisplay = () => {
    document.getElementById('counter').textContent = counter;
    document.getElementById('clickPower').textContent = clickPower;
    document.getElementById('energy').textContent = energy;
    document.getElementById('maxEnergy').textContent = maxEnergy;
    document.getElementById('upgradeCost').textContent = upgradeCost;
    document.getElementById('upgradeEnergyCost').textContent = upgradeEnergyCost;
};

// Функция для запуска таймера восстановления энергии
const startRecoveryTimer = () => {
    if (recoveryTimer) {
        clearInterval(recoveryTimer);
    }
    recoveryTimer = setInterval(() => {
        if (energy < maxEnergy) {
            energy = Math.min(energy + energyRecoveryRate * clickPower, maxEnergy); // Восстанавливаем энергию
            document.getElementById('energy').textContent = energy;
            saveData();
        }
    }, recoveryInterval);
};

// Функция для открытия и закрытия меню магазина
const toggleShopMenu = () => {
    const shopMenu = document.getElementById('shopMenu');
    shopMenu.style.display = (shopMenu.style.display === 'none' || shopMenu.style.display === '') ? 'block' : 'none';
};

// Функция для открытия кейса
const openCase = () => {
    const casePrice = 250;
    if (counter >= casePrice && !caseCooldown) {
        caseCooldown = true; // Включаем кулдаун

        // Сбрасываем кулдаун через 10 секунд
        setTimeout(() => {
            caseCooldown = false;
        }, 10000); // 10 секунд

        counter -= casePrice;
        document.getElementById('counter').textContent = counter;

        // Шанс выпадения каждого предмета
        const items = [
            { name: 'Аня', clicks: 100, chance: 45 },
            { name: 'Тихон', clicks: 175, chance: 20 },
            { name: 'Ваван', clicks: 250, chance: 10 },
            { name: 'Маслик', clicks: 280, chance: 7 },
            { name: 'Ярушка', clicks: 300, chance: 5 },
            { name: 'Лука', clicks: 325, chance: 3 },
            { name: 'Фурик', clicks: 400, chance: 1 },
            { name: 'ДМИТРИЙ ЮРЬЕВИЧ', clicks: 1000, chance: 0.1 }
        ];

        // Генерация случайного числа от 0 до 100 для определения результата
        const random = Math.random() * 100;
        let cumulativeChance = 0;
        let result = '';

        for (const item of items) {
            cumulativeChance += item.chance;
            if (random <= cumulativeChance) {
                result = `Вам выпал ${item.name}! (${item.clicks} кликов)`;
                counter += item.clicks; // Добавляем клики
                break;
            }
        }

        // Обновление отображения данных
        document.getElementById('counter').textContent = counter;

        // Отображение сообщения с результатом
        const resultMessage = document.getElementById('resultMessage');
        resultMessage.textContent = result;
        resultMessage.style.opacity = '1';

        // Текст пропадает через пару секунд
        setTimeout(() => {
            resultMessage.style.opacity = '0';
        }, 3000); // 3 секунды

        saveData();
    } else if (caseCooldown) {
        alert("Подождите 10 секунд, прежде чем открывать следующий кейс!");
    } else {
        alert("Недостаточно шейк коинов для открытия кейса!");
    }
};

// Убедитесь, что обработчик события добавляется только один раз
const caseImageElement = document.getElementById('caseImage');
caseImageElement.removeEventListener('click', openCase); // Удаляем предыдущий обработчик
caseImageElement.addEventListener('click', openCase);


// Удалите обработчик кликов по изображению кейса
document.getElementById('caseImage').removeEventListener('click', openCase);

// Используйте функцию напрямую для открытия кейса
document.getElementById('caseImage').addEventListener('click', () => {
    openCase();
});


// Обработчики событий
document.getElementById('shopButton').addEventListener('click', toggleShopMenu);
document.getElementById('closeShop').addEventListener('click', toggleShopMenu);
document.getElementById('caseImage').addEventListener('click', openCase);

document.getElementById('clickButton').addEventListener('click', (event) => {
    if (clickCooldown) return; // Блокируем клик, если кулдаун активен

    if (energy >= clickPower) { // Проверяем, достаточно ли энергии для клика
        clickCooldown = true;
        counter += clickPower;
        energy -= clickPower; // Расход энергии в соответствии с силой клика
        document.getElementById('counter').textContent = counter;
        document.getElementById('energy').textContent = energy;

        startRecoveryTimer(); // Перезапуск таймера восстановления

        // Добавление всплывающего числа при клике
        const floatingNumber = document.createElement('span');
        floatingNumber.textContent = `+${clickPower}`;
        floatingNumber.classList.add('floating-number');

        // Генерация случайного цвета в формате HEX
        const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        floatingNumber.style.color = randomColor;

        // Устанавливаем случайные координаты ниже кнопки
        const rect = event.target.getBoundingClientRect();
        const randomX = Math.random() * 100 - 50; // Случайное смещение по X (от -50px до 50px)
        const randomY = Math.random() * 50 + 30;  // Случайное смещение по Y (от 30px до 80px ниже кнопки)

        floatingNumber.style.position = 'absolute';
        floatingNumber.style.left = `${rect.left + rect.width / 2 + randomX}px`;
        floatingNumber.style.top = `${rect.bottom + randomY}px`;

        document.body.appendChild(floatingNumber);

        // Анимация исчезновения всплывающего числа
        setTimeout(() => {
            floatingNumber.style.top = `${rect.bottom + randomY - 70}px`; // Сдвиг вверх при исчезновении
            floatingNumber.style.opacity = '0';
        }, 0);

        // Удаление элемента после завершения анимации
        setTimeout(() => {
            floatingNumber.remove();
        }, 1000);

        saveData();

        // Снимаем кулдаун через 0.1 секунду
        setTimeout(() => {
            clickCooldown = false;
        }, 100);
    } else {
        alert("Недостаточно энергии для клика!");
    }
});

document.getElementById('upgradeButton').addEventListener('click', () => {
    if (counter >= upgradeCost) {
        counter -= upgradeCost;
        clickPower++;
        upgradeCost = Math.floor(upgradeCost * 1.8); // Увеличиваем стоимость улучшения

        document.getElementById('counter').textContent = counter;
        document.getElementById('clickPower').textContent = clickPower;
        document.getElementById('upgradeCost').textContent = upgradeCost;

        saveData();
    } else {
        alert("Недостаточно очков для улучшения!");
    }
});

document.getElementById('upgradeEnergyButton').addEventListener('click', () => {
    if (counter >= upgradeEnergyCost) {
        counter -= upgradeEnergyCost;
        maxEnergy = Math.floor(maxEnergy + 300);
        energy = maxEnergy; // Восстанавливаем энергию до максимума
        upgradeEnergyCost = Math.floor(upgradeEnergyCost * 1.8); // Увеличиваем стоимость улучшения энергии

        document.getElementById('counter').textContent = counter;
        document.getElementById('maxEnergy').textContent = maxEnergy;
        document.getElementById('energy').textContent = energy;
        document.getElementById('upgradeEnergyCost').textContent = upgradeEnergyCost;

        saveData();
    } else {
        alert("Недостаточно очков для улучшения энергии!");
    }
});

// Сохранение данных в localStorage
const saveData = () => {
    const data = {
        counter,
        clickPower,
        energy,
        maxEnergy,
        upgradeCost,
        upgradeEnergyCost,
        energyRecoveryRate,
        recoveryInterval
    };
    localStorage.setItem('clickerData', JSON.stringify(data));
};

// Восстановление энергии при загрузке страницы
updateDisplay();

startRecoveryTimer(); // Запускаем таймер восстановления при загрузке страницы
