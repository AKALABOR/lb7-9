import { useState, useEffect, useCallback, useRef } from 'react';
import { INITIAL_STATE } from '../utils/constants';
import { loadGameState, saveGameState } from '../db';
import { calculateModifiers, calculateOfflineIncome, calculateUpgradePrice, calculatePrestigeGain } from '../utils/formulas';

export const useGameState = () => {
  const [state, setState] = useState(INITIAL_STATE);
  const [isLoaded, setIsLoaded] = useState(false);
  const [offlineEarnings, setOfflineEarnings] = useState(0);

  useEffect(() => {
    const init = async () => {
      const savedState = await loadGameState();
      if (savedState) {
        const mergedState = { ...INITIAL_STATE, ...savedState };
        
        const earnings = calculateOfflineIncome(mergedState);
        if (earnings > 0) {
          mergedState.credits += earnings;
          setOfflineEarnings(earnings);
        }
        
        mergedState.lastSaved = Date.now();
        setState(mergedState);
      } else {
        setState({ ...INITIAL_STATE, lastSaved: Date.now() });
      }
      setIsLoaded(true);
    };
    init();
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    
    const interval = setInterval(() => {
      setState(prev => {
        const nextState = { ...prev, lastSaved: Date.now() };
        saveGameState(nextState);
        return nextState;
      });
    }, 5000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  useEffect(() => {
    if (!isLoaded) return;

    const interval = setInterval(() => {
      setState(prev => {
        const now = Date.now();
        
        const activeBonuses = prev.activeBonuses.filter(b => b.expiresAt > now);
        const activeAntiBonuses = prev.activeAntiBonuses.filter(b => b.expiresAt > now);

        const tempState = { ...prev, activeBonuses, activeAntiBonuses };
        const { passiveIncome } = calculateModifiers(tempState);
        
        if (passiveIncome > 0 || activeBonuses.length !== prev.activeBonuses.length || activeAntiBonuses.length !== prev.activeAntiBonuses.length) {
          return {
            ...tempState,
            credits: tempState.credits + passiveIncome,
          };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isLoaded]);

  const { clickValue, passiveIncome, totalMultiplier } = calculateModifiers(state);

  const handleClick = useCallback(() => {
    setState(prev => ({
      ...prev,
      credits: prev.credits + clickValue,
      totalClicks: prev.totalClicks + 1
    }));
  }, [clickValue]);

  const buyUpgrade = useCallback((upgradeId) => {
    setState(prev => {
      const currentLevel = prev.upgrades[upgradeId];
      const price = calculateUpgradePrice(upgradeId, currentLevel);
      if (prev.credits >= price) {
        return {
          ...prev,
          credits: prev.credits - price,
          upgrades: {
            ...prev.upgrades,
            [upgradeId]: currentLevel + 1
          }
        };
      }
      return prev;
    });
  }, []);

  const buySkin = useCallback((skin) => {
    setState(prev => {
      if (prev.unlockedSkins.includes(skin.id)) return prev;

      if (skin.type === 'credits' && prev.credits >= skin.price) {
        return {
          ...prev,
          credits: prev.credits - skin.price,
          unlockedSkins: [...prev.unlockedSkins, skin.id],
        };
      }
      if (skin.type === 'duiktcoins' && prev.duiktcoins >= skin.price) {
        return {
          ...prev,
          duiktcoins: prev.duiktcoins - skin.price,
          unlockedSkins: [...prev.unlockedSkins, skin.id],
        };
      }
      return prev;
    });
  }, []);

  const setSkin = useCallback((skinId) => {
    setState(prev => {
      if (prev.unlockedSkins.includes(skinId)) {
        return { ...prev, activeSkin: skinId };
      }
      return prev;
    });
  }, []);

  const triggerPrestige = useCallback(() => {
    setState(prev => {
      const gain = calculatePrestigeGain(prev.credits);
      if (gain > 0) {
        return {
          ...INITIAL_STATE,
          duiktcoins: prev.duiktcoins + gain,
          prestigeLevel: prev.prestigeLevel + 1,
          unlockedSkins: prev.unlockedSkins,
          activeSkin: prev.activeSkin,
          lastSaved: Date.now(),
        };
      }
      return prev;
    });
  }, []);

  const addBonus = useCallback((bonus) => {
    setState(prev => ({
      ...prev,
      activeBonuses: [...prev.activeBonuses, { ...bonus, expiresAt: Date.now() + bonus.duration }]
    }));
  }, []);

  const addAntiBonus = useCallback((antiBonus) => {
    setState(prev => ({
      ...prev,
      activeAntiBonuses: [...prev.activeAntiBonuses, { ...antiBonus, expiresAt: Date.now() + antiBonus.duration }]
    }));
  }, []);

  const clearOfflineEarnings = useCallback(() => {
    setOfflineEarnings(0);
  }, []);

  const debugAddCredits = useCallback((amount) => {
    setState(prev => ({ ...prev, credits: prev.credits + amount }));
  }, []);

  return {
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
  };
};
