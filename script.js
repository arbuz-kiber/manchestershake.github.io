// Получение данных из localStorage
const storedData = JSON.parse(localStorage.getItem('clickerData')) || {
    counter: 0,
    clickPower: 1,
    energy: 300,
    maxEnergy: 300,
    upgradeCost: 300,
    upgradeEnergyCost: 1000,
    energyRecoveryRate: 1,
    recoveryInterval: 1000,
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

const updateDisplay = () => {
    document.getElementById('counter').textContent = counter;
    document.getElementById('clickPower').textContent = clickPower;
    document.getElementById('energy').textContent = energy;
    document.getElementById('maxEnergy').textContent = maxEnergy;
    document.getElementById('upgradeCost').textContent = upgradeCost;
    document.getElementById('upgradeEnergyCost').textContent = upgradeEnergyCost;
};

document.getElementById('clickButton').addEventListener('click', () => {
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

        saveData();
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
        maxEnergy = Math.min(maxEnergy + 300, 600); // Увеличиваем максимальную энергию, максимум 600
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
