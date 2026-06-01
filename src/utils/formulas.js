import { UPGRADES_CONFIG, PRESTIGE_MULTIPLIER_PER_COIN, PRESTIGE_REQUIREMENT } from './constants';

export const calculateUpgradePrice = (upgradeId, currentLevel) => {
  const config = UPGRADES_CONFIG[upgradeId];
  return Math.floor(config.basePrice * Math.pow(config.priceMultiplier, currentLevel));
};

export const calculateModifiers = (state) => {
  const { upgrades, duiktcoins, activeBonuses, activeAntiBonuses } = state;

  let synergyMultiplier = UPGRADES_CONFIG.synergy.effect(upgrades.synergy);
  
  const prestigeMultiplier = 1 + (duiktcoins * PRESTIGE_MULTIPLIER_PER_COIN);

  let bonusMultiplier = 1;
  activeBonuses.forEach(b => {
    if (b.type === 'multiplier') bonusMultiplier *= b.value;
  });

  let antiBonusMultiplier = 1;
  activeAntiBonuses.forEach(b => {
    if (b.type === 'reduce_income') antiBonusMultiplier *= b.value;
  });

  const totalMultiplier = synergyMultiplier * prestigeMultiplier * bonusMultiplier * antiBonusMultiplier;

  const baseClick = state.clickValueBase 
    + UPGRADES_CONFIG.clickPower.effect(upgrades.clickPower)
    + UPGRADES_CONFIG.comboMultiplier.effect(upgrades.comboMultiplier);

  const basePassive = state.passiveIncomeBase 
    + UPGRADES_CONFIG.autoClicker.effect(upgrades.autoClicker)
    + UPGRADES_CONFIG.efficiency.effect(upgrades.efficiency);

  return {
    clickValue: Math.floor(baseClick * totalMultiplier),
    passiveIncome: Math.floor(basePassive * totalMultiplier),
    totalMultiplier
  };
};

export const calculateOfflineIncome = (state) => {
  const now = Date.now();
  const lastSaved = state.lastSaved || now;
  const secondsOffline = Math.floor((now - lastSaved) / 1000);
  
  if (secondsOffline < 60) return 0;
  
  const { passiveIncome } = calculateModifiers(state);
  return secondsOffline * passiveIncome;
};

export const calculatePrestigeGain = (credits) => {
  if (credits < PRESTIGE_REQUIREMENT) return 0;
  return Math.floor(credits / PRESTIGE_REQUIREMENT);
};