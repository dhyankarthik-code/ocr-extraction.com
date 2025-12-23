import React from 'react';

// Define the animation styles directly in the component or use a CSS file
// For simplicity and portability in this project structure, we'll inject the styles here
// but normally these would go in globals.css

interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
}

const ShinyText: React.FC<ShinyTextProps> = ({ text, disabled = false, speed = 5, className = '' }) => {
  const animationDuration = `${speed}s`;

  return (
    <>
      <style jsx>{`
        .shiny-text {
          color: transparent;
          -webkit-text-fill-color: transparent;
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.5) 40%,
            #ffffff 50%,
            rgba(255, 255, 255, 0.5) 60%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
          animation: shine ${animationDuration} linear infinite;
        }

        @keyframes shine {
          to {
            background-position: 200% center;
          }
        }

        .shiny-text.disabled {
          animation: none;
        }
      `}</style>
      <div className={`shiny-text ${disabled ? 'disabled' : ''} ${className}`}>
        {text}
      </div>
    </>
  );
};

export default ShinyText;
