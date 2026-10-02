import React from 'react';
import { theme } from '../../styles/theme';
import { Shield, Search, AlertTriangle, Award, Sparkles, HelpCircle } from 'lucide-react';

export type LeoMood = 'friendly' | 'detective' | 'warning' | 'celebrating' | 'thinking';

export interface LeoAvatarProps {
  mood?: LeoMood;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showBadge?: boolean;
  customImageSrc?: string;
  animation?: 'none' | 'pulse' | 'think';
}

const SIZE_MAP = {
  sm: 40,
  md: 64,
  lg: 88,
  xl: 120,
};

export const LeoAvatar: React.FC<LeoAvatarProps> = ({
  mood = 'friendly',
  size = 'md',
  showBadge = true,
  customImageSrc,
  animation = 'none',
}) => {
  const pixelSize = SIZE_MAP[size];

  // Farben für Löwe Leo
  const lionGold = '#F59E0B'; // Mähne (Amber 500)
  const lionFace = '#FDE68A'; // Gesicht (Amber 200)
  const lionNose = '#78350F'; // Nase (Amber 900)

  const badgeIcon = () => {
    switch (mood) {
      case 'detective':
        return <Search size={pixelSize * 0.28} color="#FFFFFF" />;
      case 'thinking':
        return <HelpCircle size={pixelSize * 0.28} color="#FFFFFF" />;
      case 'warning':
        return <AlertTriangle size={pixelSize * 0.28} color="#FFFFFF" />;
      case 'celebrating':
        return <Award size={pixelSize * 0.28} color="#FFFFFF" />;
      default:
        return <Shield size={pixelSize * 0.28} color="#FFFFFF" />;
    }
  };

  const badgeBg = () => {
    switch (mood) {
      case 'warning':
        return theme.colors.danger.default;
      case 'celebrating':
        return theme.colors.success.default;
      case 'detective':
        return theme.colors.secondary.default;
      case 'thinking':
        return theme.colors.warning.default;
      default:
        return theme.colors.primary.default;
    }
  };

  const animationStyle = animation === 'pulse' || animation === 'think'
    ? { animation: 'leoPulse 2.5s infinite ease-in-out' }
    : {};

  return (
    <div
      style={{
        position: 'relative',
        width: pixelSize,
        height: pixelSize,
        flexShrink: 0,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        ...animationStyle,
      }}
    >
      {/* Fallback auf benutzerdefiniertes Bild, falls hinterlegt */}
      {customImageSrc ? (
        <img
          src={customImageSrc}
          alt="Löwe Leo"
          style={{
            width: pixelSize,
            height: pixelSize,
            borderRadius: theme.borderRadius.full,
            objectFit: 'cover',
            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
          }}
        />
      ) : (
        /* Vektorgrafik: Löwe Leo (Didaktischer Platzhalter) */
        <svg
          width={pixelSize}
          height={pixelSize}
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))' }}
        >
          {/* Mähne */}
          <circle cx="50" cy="50" r="46" fill={lionGold} />
          <circle cx="20" cy="25" r="14" fill={lionGold} />
          <circle cx="80" cy="25" r="14" fill={lionGold} />
          <circle cx="14" cy="50" r="14" fill={lionGold} />
          <circle cx="86" cy="50" r="14" fill={lionGold} />
          <circle cx="25" cy="78" r="14" fill={lionGold} />
          <circle cx="75" cy="78" r="14" fill={lionGold} />
          <circle cx="50" cy="86" r="14" fill={lionGold} />

          {/* Ohren-Innenbereich */}
          <circle cx="26" cy="26" r="8" fill="#FBBF24" />
          <circle cx="74" cy="26" r="8" fill="#FBBF24" />

          {/* Gesicht */}
          <circle cx="50" cy="52" r="32" fill={lionFace} />

          {/* Augen */}
          <ellipse cx="40" cy="46" rx="4.5" ry="6" fill="#1E293B" />
          <ellipse cx="60" cy="46" rx="4.5" ry="6" fill="#1E293B" />
          <circle cx="42" cy="44" r="1.8" fill="#FFFFFF" />
          <circle cx="62" cy="44" r="1.8" fill="#FFFFFF" />

          {/* Freundliche Bäckchen */}
          <circle cx="32" cy="56" r="5" fill="#FCA5A5" opacity="0.6" />
          <circle cx="68" cy="56" r="5" fill="#FCA5A5" opacity="0.6" />

          {/* Schnauze & Nase */}
          <ellipse cx="50" cy="58" rx="11" ry="8" fill="#FEF3C7" />
          <polygon points="50,54 44,60 56,60" fill={lionNose} />

          {/* Mund */}
          <path
            d={mood === 'warning' ? 'M 45 64 Q 50 60 55 64' : 'M 45 61 Q 50 67 55 61'}
            stroke={lionNose}
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
          />

          {/* Schnurrhaare */}
          <line x1="28" y1="58" x2="38" y2="59" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="28" y1="62" x2="38" y2="61" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="59" x2="72" y2="58" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="62" y1="61" x2="72" y2="62" stroke="#92400E" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
      )}

      {/* Status-Badge am rechten unteren Rand */}
      {showBadge && (
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: pixelSize * 0.38,
            height: pixelSize * 0.38,
            borderRadius: theme.borderRadius.full,
            backgroundColor: badgeBg(),
            border: `2px solid ${theme.colors.surface}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: theme.shadows.sm,
          }}
        >
          {badgeIcon()}
        </div>
      )}

      {mood === 'celebrating' && (
        <div style={{ position: 'absolute', top: -4, right: -4 }}>
          <Sparkles size={pixelSize * 0.3} color="#F59E0B" />
        </div>
      )}
    </div>
  );
};
