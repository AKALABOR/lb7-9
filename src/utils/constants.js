export const INITIAL_STATE = {
  credits: 0,
  duiktcoins: 0,
  prestigeLevel: 0,
  clickValueBase: 1,
  passiveIncomeBase: 0,
  upgrades: {
    clickPower: 0,
    autoClicker: 0,
    synergy: 0,
    comboMultiplier: 0,
    efficiency: 0,
  },
  unlockedSkins: ['default'],
  activeSkin: 'default',
  lastSaved: Date.now(),
  activeBonuses: [],
  activeAntiBonuses: [],
  totalClicks: 0,
};

export const UPGRADES_CONFIG = {
  clickPower: {
    id: 'clickPower',
    name: 'Потужність кліку',
    description: '+1 кредит за клік',
    basePrice: 10,
    priceMultiplier: 1.5,
    effect: (level) => level * 1, // flat increase
  },
  autoClicker: {
    id: 'autoClicker',
    name: 'Автоклікер',
    description: '+1 кредит на секунду',
    basePrice: 50,
    priceMultiplier: 1.6,
    effect: (level) => level * 1, // flat increase
  },
  synergy: {
    id: 'synergy',
    name: 'Синергія',
    description: '+10% до всіх доходів',
    basePrice: 500,
    priceMultiplier: 2.0,
    effect: (level) => 1 + (level * 0.1), // multiplier
  },
  comboMultiplier: {
    id: 'comboMultiplier',
    name: 'Комбо-множник',
    description: '+5 до сили кліку за рівень',
    basePrice: 1000,
    priceMultiplier: 2.2,
    effect: (level) => level * 5,
  },
  efficiency: {
    id: 'efficiency',
    name: 'Ефективність',
    description: '+15 пасивного доходу',
    basePrice: 2000,
    priceMultiplier: 1.8,
    effect: (level) => level * 15,
  }
};

export const SKINS_CONFIG = [
  { id: 'default', name: 'Стандартний', price: 0, type: 'default' },
  { id: 'dark', name: 'Темна тема', price: 1000, type: 'credits' },
  { id: 'hacker', name: 'Хакер', price: 10000, type: 'credits' },
  { id: 'gold', name: 'Золотий', price: 5, type: 'duiktcoins' },
  { id: 'neon', name: 'Неон', price: 15, type: 'duiktcoins' },
];

export const PRESTIGE_REQUIREMENT = 100000; // credits needed to prestige
export const PRESTIGE_MULTIPLIER_PER_COIN = 0.5; // +50% per duiktcoin
