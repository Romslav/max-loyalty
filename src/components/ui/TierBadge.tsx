import React from 'react';
import { tierConfig } from '../../theme/theme';

interface TierBadgeProps {
  tierName?: string;
  tierLevel?: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animated?: boolean;
}

const TierBadge: React.FC<TierBadgeProps> = ({
  tierName = 'BRONZE',
  tierLevel = 1,
  size = 'md',
  showLabel = true,
  animated = false,
}) => {
  const tier = tierConfig[tierName as keyof typeof tierConfig] || tierConfig.BRONZE;
  const config = {
    sm: { fontSize: '16px', padding: '4px 8px', iconSize: '16px' },
    md: { fontSize: '18px', padding: '8px 12px', iconSize: '20px' },
    lg: { fontSize: '24px', padding: '12px 16px', iconSize: '28px' },
  };

  const sizeConfig = config[size];

  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: sizeConfig.padding,
        backgroundColor: `${tier.color}20`,
        border: `2px solid ${tier.color}`,
        borderRadius: '9999px',
        animation: animated ? `pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite` : 'none',
      }}
    >
      <span style={{ fontSize: sizeConfig.iconSize }}>{tier.icon}</span>
      {showLabel && (
        <span
          style={{
            fontSize: sizeConfig.fontSize,
            fontWeight: 600,
            color: tier.color,
          }}
        >
          {tier.name}
        </span>
      )}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.8; }
        }
      `}</style>
    </div>
  );
};

export default TierBadge;
