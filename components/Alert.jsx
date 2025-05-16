import React from 'react';
import Icon from './Icon';
import styles from './Alert.module.css';

const Alert = ({ type = 'info', message, onClose, className }) => {
  return (
    <div className={`${styles.alert} ${styles[type]} ${className || ''}`}>
      <div className={styles.iconContainer}>
        <Icon type={type} category="status" size="small" />
      </div>
      <div className={styles.message}>{message}</div>
      {onClose && (
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          &times;
        </button>
      )}
    </div>
  );
};

export default Alert;
