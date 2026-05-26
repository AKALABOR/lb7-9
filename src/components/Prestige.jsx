import React from 'react';
import { PRESTIGE_REQUIREMENT, PRESTIGE_MULTIPLIER_PER_COIN } from '../utils/constants';
import { calculatePrestigeGain } from '../utils/formulas';
import styles from './Prestige.module.scss';

const Prestige = ({ credits, duiktcoins, prestigeLevel, onPrestige }) => {
  const gain = calculatePrestigeGain(credits);
  const currentMultiplier = 1 + (duiktcoins * PRESTIGE_MULTIPLIER_PER_COIN);
  const nextMultiplier = 1 + ((duiktcoins + gain) * PRESTIGE_MULTIPLIER_PER_COIN);

  return (
    <div className={styles.container}>
      <h2>Престиж (Рівень {prestigeLevel})</h2>
      <div className={styles.stats}>
        <p>Ваші Duiktcoins: <strong>{duiktcoins}</strong></p>
        <p>Поточний множник: <strong>x{currentMultiplier.toFixed(2)}</strong></p>
      </div>

      <div className={styles.action}>
        <p>Вимагає: {PRESTIGE_REQUIREMENT} Cr за 1 Duiktcoin</p>
        <p>При скиданні ви отримаєте: <strong>+{gain} DC</strong></p>
        <p>Новий множник буде: <strong>x{nextMultiplier.toFixed(2)}</strong></p>
        
        <button 
          onClick={onPrestige} 
          disabled={gain === 0}
          className={styles.btn}
        >
          Зробити престиж!
        </button>
      </div>
    </div>
  );
};

export default Prestige;
