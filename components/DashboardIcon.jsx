import React from 'react';
import Icon from './Icon';
import styles from './DashboardIcon.module.css';

const DashboardIcon = ({ type, label, onClick, active, className }) => {
  return (
    <div 
      className={`${styles.iconContainer} ${active ? styles.active : ''} ${className || ''}`}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      <div className={styles.iconWrapper}>
        <Icon type={type} category="dashboard" size="medium" />
      </div>
      <span className={styles.label}>{label}</span>
    </div>
  );
};

export default DashboardIcon;
