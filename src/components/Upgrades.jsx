import React from 'react';
import { UPGRADES_CONFIG } from '../utils/constants';
import { calculateUpgradePrice } from '../utils/formulas';
import styles from './Upgrades.module.scss';

const Upgrades = ({ credits, upgrades, onBuy }) => {
  return (
    <div className={styles.container}>
      <h2>Покращення</h2>
      <div className={styles.list}>
        {Object.values(UPGRADES_CONFIG).map((upgrade) => {
          const currentLevel = upgrades[upgrade.id];
          const price = calculateUpgradePrice(upgrade.id, currentLevel);
          const canAfford = credits >= price;

          return (
            <button
              key={upgrade.id}
              className={`${styles.item} ${canAfford ? '' : styles.disabled}`}
              onClick={() => canAfford && onBuy(upgrade.id)}
              disabled={!canAfford}
            >
              <div className={styles.info}>
                <span className={styles.name}>{upgrade.name} (Рівень {currentLevel})</span>
                <span className={styles.desc}>{upgrade.description}</span>
              </div>
              <div className={styles.action}>
                <span className={styles.price}>{price} Cr</span>
                <span>Купити</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Upgrades;
