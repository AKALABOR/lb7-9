import { UPGRADES_CONFIG, PRESTIGE_MULTIPLIER_PER_COIN, PRESTIGE_REQUIREMENT } from './constants';

export const calculateUpgradePrice = (upgradeId, currentLevel) => {
  const config = UPGRADES_CONFIG[upgradeId];
  return Math.floor(config.basePrice * Math.pow(config.priceMultiplier, currentLevel));
};

export const calculateModifiers = (state) => {
  const { upgrades, duiktcoins, activeBonuses, activeAntiBonuses } = state;

  // Base synergy multiplier from upgrades
  let synergyMultiplier = UPGRADES_CONFIG.synergy.effect(upgrades.synergy);
  
  // Prestige multiplier
  const prestigeMultiplier = 1 + (duiktcoins * PRESTIGE_MULTIPLIER_PER_COIN);

  // Bonus/Antibonus multipliers
  let bonusMultiplier = 1;
  activeBonuses.forEach(b => {
    if (b.type === 'multiplier') bonusMultiplier *= b.value;
  });

  let antiBonusMultiplier = 1;
  activeAntiBonuses.forEach(b => {
    if (b.type === 'reduce_income') antiBonusMultiplier *= b.value; // e.g. 0.5 for -50%
  });

  const totalMultiplier = synergyMultiplier * prestigeMultiplier * bonusMultiplier * antiBonusMultiplier;

  // Base values
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
  
  if (secondsOffline < 60) return 0; // Require at least 1 min offline to earn
  
  const { passiveIncome } = calculateModifiers(state);
  return secondsOffline * passiveIncome;
};

export const calculatePrestigeGain = (credits) => {
  if (credits < PRESTIGE_REQUIREMENT) return 0;
  // Earn 1 coin per PRESTIGE_REQUIREMENT, scaling slightly with log or linearly
  return Math.floor(credits / PRESTIGE_REQUIREMENT);
};
