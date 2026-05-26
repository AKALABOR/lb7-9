import React from 'react';
import styles from './OfflineModal.module.scss';

const OfflineModal = ({ earnings, onClose }) => {
  if (earnings <= 0) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <h2>З поверненням!</h2>
        <p>Поки вас не було, ваші працівники здобули:</p>
        <div className={styles.amount}>+{earnings} Cr</div>
        <button onClick={onClose} className={styles.btn}>Чудово!</button>
      </div>
    </div>
  );
};

export default OfflineModal;
