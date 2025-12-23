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
          color: #ffffff; /* Default readable color before shine */
          background: linear-gradient(
            120deg,
            rgba(255, 255, 255, 0.8) 40%,
            rgba(255, 255, 255, 1) 50%,
            rgba(255, 255, 255, 0.8) 60%
          );
          background-size: 200% 100%;
          -webkit-background-clip: text;
          background-clip: text;
          display: inline-block;
          animation: shine ${animationDuration} linear infinite;
          /* Ensure text is visible even if background-clip fails or during load */
          text-shadow: 0 0 10px rgba(255,255,255,0.1); 
        }

        @keyframes shine {
          0% {
            background-position: 100%;
          }
          100% {
            background-position: -100%;
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
