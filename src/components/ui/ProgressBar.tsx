import React from 'react';

interface ProgressBarProps {
  current: number;
  target: number;
  label?: string;
  color?: string;
  showPercentage?: boolean;
  animated?: boolean;
  height?: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  current,
  target,
  label,
  color = '#3B82F6',
  showPercentage = true,
  animated = true,
  height = 8,
}) => {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <div style={{ width: '100%' }}>
      {label && (
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            marginBottom: '8px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          <span>{label}</span>
          {showPercentage && <span>{Math.round(percentage)}%</span>}
        </div>
      )}
      <div
        style={{
          width: '100%',
          height: `${height}px`,
          backgroundColor: 'rgba(0, 0, 0, 0.1)',
          borderRadius: '9999px',
          overflow: 'hidden',
          position: 'relative',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${percentage}%`,
            backgroundColor: color,
            transition: animated ? 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' : 'none',
            borderRadius: '9999px',
          }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
