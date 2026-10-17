import React from 'react';
import './Skeleton.css';

/**
 * Universal Skeleton Loader component for dark theme Admin & Advocate panels
 */
export const Skeleton = ({ 
  variant = 'text', 
  width, 
  height, 
  borderRadius, 
  style = {}, 
  className = '' 
}) => {
  return (
    <div 
      className={`skeleton-base skeleton-${variant} ${className}`}
      style={{
        width: width || (variant === 'text' ? '100%' : undefined),
        height: height || (variant === 'text' ? '16px' : undefined),
        borderRadius: borderRadius || (variant === 'circle' ? '50%' : '8px'),
        ...style
      }}
    />
  );
};

/**
 * Skeleton for KPI statistic cards in Admin and Advocate dashboards
 */
export const SkeletonKpiCard = () => {
  return (
    <div className="skeleton-kpi-card">
      <div className="skeleton-kpi-icon skeleton-shimmer" />
      <div className="skeleton-kpi-content">
        <div className="skeleton-base skeleton-text skeleton-shimmer" style={{ width: '60%', height: '14px', marginBottom: '8px' }} />
        <div className="skeleton-base skeleton-text skeleton-shimmer" style={{ width: '40%', height: '28px', marginBottom: '8px' }} />
        <div className="skeleton-base skeleton-text skeleton-shimmer" style={{ width: '75%', height: '12px' }} />
      </div>
    </div>
  );
};

/**
 * Skeleton for data tables (New Clients, Assigned Cases, Advocates, Approvals)
 */
export const SkeletonTableRows = ({ rows = 5, columns = 6 }) => {
  return (
    <>
      {Array.from({ length: rows }).map((_, rIdx) => (
        <tr key={rIdx} className="skeleton-table-row">
          {Array.from({ length: columns }).map((_, cIdx) => (
            <td key={cIdx}>
              <div 
                className="skeleton-base skeleton-text skeleton-shimmer" 
                style={{ 
                  width: cIdx === 0 ? '70px' : cIdx === 1 ? '85%' : cIdx === columns - 1 ? '90px' : '65%',
                  height: cIdx === 1 ? '32px' : '18px'
                }} 
              />
            </td>
          ))}
        </tr>
      ))}
    </>
  );
};

export default Skeleton;
