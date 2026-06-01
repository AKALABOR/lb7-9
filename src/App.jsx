import React, { useEffect } from 'react';
import { useGameState } from './hooks/useGameState';
import ClickArea from './components/ClickArea';
import Upgrades from './components/Upgrades';
import Bonuses from './components/Bonuses';
import Prestige from './components/Prestige';
import Skins from './components/Skins';
import OfflineModal from './components/OfflineModal';
import './styles/global.scss';
import styles from './App.module.scss';

function App() {
  const {
    state,
    isLoaded,
    clickValue,
    passiveIncome,
    totalMultiplier,
    offlineEarnings,
    handleClick,
    buyUpgrade,
    buySkin,
    setSkin,
    triggerPrestige,
    addBonus,
    addAntiBonus,
    clearOfflineEarnings,
    debugAddCredits
  } = useGameState();

  useEffect(() => {
    document.body.setAttribute('data-theme', state.activeSkin);
  }, [state.activeSkin]);

  if (!isLoaded) {
    return <div className={styles.loading}>Завантаження...</div>;
  }

  return (
    <div className={styles.appContainer}>
      <OfflineModal earnings={offlineEarnings} onClose={clearOfflineEarnings} />

      <header className={styles.header}>
        <div className={styles.balances}>
          <div className={styles.credits}>
            <h1>{Math.floor(state.credits)} Cr</h1>
            <span>{passiveIncome}/сек</span>
          </div>
          <div className={styles.prestige}>
            <h2>{state.duiktcoins} DC</h2>
          </div>
        </div>
      </header>

      <main className={styles.mainGrid}>
        <div className={styles.leftCol}>
          <ClickArea 
            onClick={handleClick} 
            clickValue={clickValue} 
            totalClicks={state.totalClicks}
            totalMultiplier={totalMultiplier}
          />
          <Bonuses 
            activeBonuses={state.activeBonuses}
            activeAntiBonuses={state.activeAntiBonuses}
            onAddBonus={addBonus}
            onAddAntiBonus={addAntiBonus}
          />
        </div>
        
        <div className={styles.rightCol}>
          <Upgrades 
            credits={state.credits}
            upgrades={state.upgrades}
            onBuy={buyUpgrade}
          />
        </div>
      </main>

      <section className={styles.bottomSection}>
        <Skins 
          unlockedSkins={state.unlockedSkins}
          activeSkin={state.activeSkin}
          credits={state.credits}
          duiktcoins={state.duiktcoins}
          onBuySkin={buySkin}
          onSetSkin={setSkin}
        />
        <Prestige 
          credits={state.credits}
          duiktcoins={state.duiktcoins}
          prestigeLevel={state.prestigeLevel}
          onPrestige={triggerPrestige}
        />
      </section>
    </div>
  );
}

export default App;
