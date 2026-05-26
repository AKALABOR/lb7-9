import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ClickArea.module.scss';

const ClickArea = ({ onClick, clickValue, totalClicks, totalMultiplier }) => {
  const [clickEffects, setClickEffects] = useState([]);

  const handlePointerDown = (e) => {
    onClick();
    const newEffect = {
      id: Date.now() + Math.random(),
      x: e.clientX,
      y: e.clientY,
      value: clickValue
    };
    setClickEffects(prev => [...prev, newEffect]);
    setTimeout(() => {
      setClickEffects(prev => prev.filter(effect => effect.id !== newEffect.id));
    }, 1000);
  };

  return (
    <div className={styles.container}>
      <motion.button
        className={styles.clickButton}
        onPointerDown={handlePointerDown}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        CLICK ME
      </motion.button>
      
      <div className={styles.stats}>
        <p>Total Clicks: {totalClicks}</p>
        <p>Multiplier: x{totalMultiplier.toFixed(2)}</p>
      </div>

      <AnimatePresence>
        {clickEffects.map(effect => (
          <motion.div
            key={effect.id}
            className={styles.floatingText}
            initial={{ opacity: 1, y: effect.y - 50, x: effect.x - 20 }}
            animate={{ opacity: 0, y: effect.y - 150 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
          >
            +{effect.value}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ClickArea;
