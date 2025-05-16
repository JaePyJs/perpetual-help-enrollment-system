import React, { useState } from "react";

/**
 * Tab Item Type
 */
export type TabItem = {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
};

/**
 * Tabs Component
 * 
 * A versatile tabs component that follows the design system.
 * Supports different variants and orientations.
 */
type TabsProps = {
  tabs: TabItem[];
  defaultActiveTab?: string;
  onChange?: (tabId: string) => void;
  variant?: "default" | "pills" | "underlined";
  orientation?: "horizontal" | "vertical";
  className?: string;
  tabClassName?: string;
  contentClassName?: string;
};

export default function Tabs({
  tabs,
  defaultActiveTab,
  onChange,
  variant = "default",
  orientation = "horizontal",
  className = "",
  tabClassName = "",
  contentClassName = "",
}: TabsProps) {
  const [activeTab, setActiveTab] = useState<string>(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].id : "")
  );
  
  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    if (onChange) {
      onChange(tabId);
    }
  };
  
  // Combine class names based on props
  const tabsContainerClasses = [
    "tabs",
    `tabs-${variant}`,
    `tabs-${orientation}`,
    className,
  ].filter(Boolean).join(" ");
  
  const tabListClasses = [
    "tabs-list",
    `tabs-list-${orientation}`,
  ].filter(Boolean).join(" ");
  
  const tabContentClasses = [
    "tabs-content",
    contentClassName,
  ].filter(Boolean).join(" ");
  
  return (
    <div className={tabsContainerClasses}>
      <div 
        className={tabListClasses}
        role="tablist"
        aria-orientation={orientation}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const tabClasses = [
            "tab",
            isActive ? "tab-active" : "",
            tab.disabled ? "tab-disabled" : "",
            tabClassName,
          ].filter(Boolean).join(" ");
          
          return (
            <button
              key={tab.id}
              id={`tab-${tab.id}`}
              className={tabClasses}
              role="tab"
              aria-selected={isActive}
              aria-controls={`tabpanel-${tab.id}`}
              tabIndex={isActive ? 0 : -1}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              type="button"
            >
              {tab.icon && <span className="tab-icon">{tab.icon}</span>}
              <span className="tab-label">{tab.label}</span>
            </button>
          );
        })}
      </div>
      
      <div className={tabContentClasses}>
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          
          return (
            <div
              key={tab.id}
              id={`tabpanel-${tab.id}`}
              className={`tab-panel ${isActive ? "tab-panel-active" : ""}`}
              role="tabpanel"
              aria-labelledby={`tab-${tab.id}`}
              hidden={!isActive}
              tabIndex={0}
            >
              {tab.content}
            </div>
          );
        })}
      </div>
    </div>
  );
}
