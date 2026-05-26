import React from 'react';
import { SKINS_CONFIG } from '../utils/constants';
import styles from './Skins.module.scss';

const Skins = ({ unlockedSkins, activeSkin, credits, duiktcoins, onBuySkin, onSetSkin }) => {
  return (
    <div className={styles.container}>
      <h2>Скіни</h2>
      <div className={styles.grid}>
        {SKINS_CONFIG.map(skin => {
          const isUnlocked = unlockedSkins.includes(skin.id);
          const isActive = activeSkin === skin.id;
          
          let canAfford = false;
          if (!isUnlocked) {
            canAfford = skin.type === 'credits' ? credits >= skin.price : duiktcoins >= skin.price;
          }

          return (
            <div key={skin.id} className={`${styles.card} ${isActive ? styles.active : ''}`}>
              <div className={styles.preview} data-theme={skin.id}>
                <span>{skin.name}</span>
              </div>
              
              <div className={styles.actions}>
                {isUnlocked ? (
                  <button 
                    onClick={() => onSetSkin(skin.id)}
                    disabled={isActive}
                    className={isActive ? styles.btnActive : styles.btnEquip}
                  >
                    {isActive ? 'Активний' : 'Обрати'}
                  </button>
                ) : (
                  <button 
                    onClick={() => onBuySkin(skin)}
                    disabled={!canAfford}
                    className={styles.btnBuy}
                  >
                    Купити за {skin.price} {skin.type === 'credits' ? 'Cr' : 'DC'}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Skins;
