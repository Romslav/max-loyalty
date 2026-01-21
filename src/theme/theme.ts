// Modern Design System with Dark Mode Support

export const lightTheme = {
  colors: {
    primary: '#3B82F6',
    primaryHover: '#2563EB',
    primaryLight: '#EFF6FF',
    
    secondary: '#8B5CF6',
    secondaryHover: '#7C3AED',
    
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#06B6D4',
    
    background: '#FFFFFF',
    surface: '#F9FAFB',
    surfaceHover: '#F3F4F6',
    
    text: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    
    overlay: 'rgba(0, 0, 0, 0.5)',
    
    // Tier Colors
    bronze: '#CD7F32',
    silver: '#C0C0C0',
    gold: '#FFD700',
    platinum: '#E5E4E2',
  },
  
  gradients: {
    premium: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  },
  
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
  },
  
  borderRadius: {
    sm: '4px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
  },
  
  typography: {
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
    fontFamilyMono: "'Fira Code', monospace",
    
    h1: {
      fontSize: '32px',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.02em',
    },
    h2: {
      fontSize: '28px',
      fontWeight: 700,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '24px',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body: {
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    bodySmall: {
      fontSize: '14px',
      fontWeight: 400,
      lineHeight: 1.5,
    },
  },
  
  transitions: {
    fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
    normal: '250ms cubic-bezier(0.4, 0, 0.2, 1)',
    slow: '350ms cubic-bezier(0.4, 0, 0.2, 1)',
  },
};

export const darkTheme = {
  ...lightTheme,
  colors: {
    ...lightTheme.colors,
    primary: '#60A5FA',
    primaryHover: '#93C5FD',
    primaryLight: '#1E3A8A',
    
    secondary: '#A78BFA',
    secondaryHover: '#C4B5FD',
    
    success: '#34D399',
    warning: '#FBBF24',
    error: '#F87171',
    info: '#22D3EE',
    
    background: '#111827',
    surface: '#1F2937',
    surfaceHover: '#374151',
    
    text: '#F9FAFB',
    textSecondary: '#D1D5DB',
    textTertiary: '#9CA3AF',
    
    border: '#374151',
    borderLight: '#4B5563',
  },
};

export const tierConfig = {
  BRONZE: {
    name: 'Bronze',
    level: 1,
    color: '#CD7F32',
    icon: '🥉',
    minPoints: 0,
    multiplier: 1.0,
    benefits: ['Earn rewards', 'Access catalog'],
  },
  SILVER: {
    name: 'Silver',
    level: 2,
    color: '#C0C0C0',
    icon: '🥈',
    minPoints: 1000,
    multiplier: 1.2,
    benefits: ['1.2x points', 'Priority support', 'Early access to deals'],
  },
  GOLD: {
    name: 'Gold',
    level: 3,
    color: '#FFD700',
    icon: '🥇',
    minPoints: 5000,
    multiplier: 1.5,
    benefits: ['1.5x points', 'VIP line', 'Special events', 'Birthday bonus'],
  },
  PLATINUM: {
    name: 'Platinum',
    level: 4,
    color: '#E5E4E2',
    icon: '💎',
    minPoints: 15000,
    multiplier: 2.0,
    benefits: ['2x points', 'Concierge service', 'Exclusive lounge', 'Personal manager'],
  },
};

export type Theme = typeof lightTheme;
