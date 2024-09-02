// Получение данных из localStorage
const storedData = JSON.parse(localStorage.getItem('clickerData')) || {
    counter: 0,
    clickPower: 1,
    energy: 300,
    maxEnergy: 300,
    upgradeCost: 300,
    upgradeEnergyCost: 1000,
    energyRecoveryRate: 1,
    recoveryInterval: 500,
};

// Обновление глобальных переменных
let counter = storedData.counter;
let clickPower = storedData.clickPower;
let energy = storedData.energy;
let maxEnergy = storedData.maxEnergy;
let upgradeCost = storedData.upgradeCost;
let upgradeEnergyCost = storedData.upgradeEnergyCost;
const energyRecoveryRate = storedData.energyRecoveryRate;
const recoveryInterval = storedData.recoveryInterval;
let recoveryTimer = null;
let clickCooldown = false; // Переменная для отслеживания кулдауна клика
const clickCooldownTime = 500; // Время кулдауна в миллисекундах (например, 500 мс)

const updateDisplay = () => {
    document.getElementById('counter').textContent = counter;
    document.getElementById('clickPower').textContent = clickPower;
    document.getElementById('energy').textContent = energy;
    document.getElementById('maxEnergy').textContent = maxEnergy;
    document.getElementById('upgradeCost').textContent = upgradeCost;
    document.getElementById('upgradeEnergyCost').textContent = upgradeEnergyCost;
};

document.getElementById('clickButton').addEventListener('click', (event) => {
    if (clickCooldown) return; // Блокируем клик, если кулдаун активен

    if (energy >= clickPower) { // Проверяем, достаточно ли энергии для клика
        counter += clickPower;
        energy -= clickPower; // Расход энергии в соответствии с силой клика
        document.getElementById('counter').textContent = counter;
        document.getElementById('energy').textContent = energy;

        // Сбросить таймер восстановления при клике
        if (recoveryTimer) {
            clearInterval(recoveryTimer);
            recoveryTimer = null;
        }

        // Запустить таймер восстановления после последнего клика
        if (!recoveryTimer) {
            recoveryTimer = setInterval(() => {
                if (energy < maxEnergy) {
                    energy = Math.min(energy + energyRecoveryRate * clickPower, maxEnergy); // Восстанавливаем энергию
                    document.getElementById('energy').textContent = energy;
                    saveData();
                }
            }, recoveryInterval);
        }

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

        // Включаем кулдаун
        clickCooldown = true;
        setTimeout(() => {
            clickCooldown = false;
        }, clickCooldownTime);
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
        maxEnergy = Math.min(maxEnergy + 300); // Увеличиваем максимальную энергию, максимум 600
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

if (energy < maxEnergy && !recoveryTimer) {
    recoveryTimer = setInterval(() => {
        if (energy < maxEnergy) {
            energy = Math.min(energy + energyRecoveryRate * clickPower, maxEnergy); // Восстанавливаем энергию
            document.getElementById('energy').textContent = energy;
            saveData();
        }
    }, recoveryInterval);
}

