import React from 'react';

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  return (
    <>
      <style jsx global>{`
        @keyframes shiny-text-animation {
          0% {
            background-position: 0% center;
          }
          100% {
            background-position: 200% center;
          }
        }
        
        .shiny-text-effect {
          background: linear-gradient(
            110deg,
            rgba(255, 255, 255, 0.4) 0%,
            rgba(255, 255, 255, 0.4) 40%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.4) 60%,
            rgba(255, 255, 255, 0.4) 100%
          );
          background-size: 200% auto;
          color: transparent;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: shiny-text-animation var(--animation-duration, 5s) linear infinite;
        }
        
        .shiny-text-effect.disabled {
          animation: none;
          background: white;
        }
      `}</style>
      <span
        className={`shiny-text-effect ${disabled ? 'disabled' : ''} ${className}`}
        style={{ '--animation-duration': `${speed}s` } as React.CSSProperties}
      >
        {text}
      </span>
    </>
  );
};

export default ShinyText;
