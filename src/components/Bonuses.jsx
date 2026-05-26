import React, { useState } from 'react';
import styles from './Bonuses.module.scss';

const BONUS_TYPES = [
  { id: 'b1', name: 'Золота жила', type: 'multiplier', value: 2, duration: 30000, desc: 'x2 множник на 30с', isBad: false },
  { id: 'b2', name: 'Божевілля', type: 'multiplier', value: 5, duration: 10000, desc: 'x5 множник на 10с', isBad: false },
  { id: 'a1', name: 'DDoS Атака', type: 'reduce_income', value: 0.5, duration: 20000, desc: '-50% доходу на 20с', isBad: true },
  { id: 'a2', name: 'Вірус-шифрувальник', type: 'reduce_income', value: 0.1, duration: 15000, desc: '-90% доходу на 15с', isBad: true },
  { id: 'a3', name: 'Баг у базі', type: 'reduce_income', value: 0.8, duration: 60000, desc: '-20% доходу на 1 хв', isBad: true },
];

const Bonuses = ({ activeBonuses, activeAntiBonuses, onAddBonus, onAddAntiBonus }) => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState(null);

  const spinWheel = () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    setTimeout(() => {
      const randomEvent = BONUS_TYPES[Math.floor(Math.random() * BONUS_TYPES.length)];
      setSpinResult(randomEvent);
      
      if (randomEvent.isBad) {
        onAddAntiBonus(randomEvent);
      } else {
        onAddBonus(randomEvent);
      }
      setIsSpinning(false);
    }, 2000);
  };

  const now = Date.now();

  return (
    <div className={styles.container}>
      <h2>Колесо Фортуни</h2>
      <div className={styles.wheelSection}>
        <button 
          className={styles.spinBtn} 
          onClick={spinWheel}
          disabled={isSpinning}
        >
          {isSpinning ? 'Крутиться...' : 'Випробувати удачу'}
        </button>
        {spinResult && (
          <div className={`${styles.result} ${spinResult.isBad ? styles.bad : styles.good}`}>
            Випало: {spinResult.name}! ({spinResult.desc})
          </div>
        )}
      </div>

      <div className={styles.activeEffects}>
        <h3>Активні ефекти</h3>
        {activeBonuses.length === 0 && activeAntiBonuses.length === 0 && (
          <p className={styles.noEffects}>Немає активних ефектів</p>
        )}
        
        {activeBonuses.map((b, i) => (
          <div key={`b-${i}`} className={`${styles.effect} ${styles.good}`}>
            <span>{b.name}</span>
            <span>{Math.ceil((b.expiresAt - now) / 1000)}с</span>
          </div>
        ))}

        {activeAntiBonuses.map((b, i) => (
          <div key={`a-${i}`} className={`${styles.effect} ${styles.bad}`}>
            <span>{b.name}</span>
            <span>{Math.ceil((b.expiresAt - now) / 1000)}с</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bonuses;
