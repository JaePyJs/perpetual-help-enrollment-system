import React from 'react';
import Icon from './Icon';
import styles from './EmptyState.module.css';

const EmptyState = ({ type, title, message, actionLabel, onAction, className }) => {
  const getDefaultTitle = () => {
    switch(type) {
      case 'grades': return 'No Grades Available';
      case 'finances': return 'No Financial Records';
      case 'schedule': return 'No Schedule Available';
      case 'courses': return 'No Courses Enrolled';
      default: return 'No Data Available';
    }
  };

  const getDefaultMessage = () => {
    switch(type) {
      case 'grades': return 'Your grades will appear here once they are posted by your instructors.';
      case 'finances': return 'Your financial records will appear here once transactions are processed.';
      case 'schedule': return 'Your class schedule will appear here once you are enrolled in courses.';
      case 'courses': return 'Courses you enroll in will appear here.';
      default: return 'There is no data to display at this time.';
    }
  };

  return (
    <div className={`${styles.emptyState} ${className || ''}`}>
      <div className={styles.iconContainer}>
        <Icon type={type} category="dashboard" size="large" />
      </div>
      <h3 className={styles.title}>{title || getDefaultTitle()}</h3>
      <p className={styles.message}>{message || getDefaultMessage()}</p>
      {actionLabel && onAction && (
        <button className={styles.actionButton} onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
