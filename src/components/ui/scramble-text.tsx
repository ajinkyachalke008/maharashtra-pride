import { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARS = '!<>-_\\/[]{}—=+*^?#________';

interface ScrambleTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  scrambleSpeed?: number;
  revealDelay?: number;
  revealDuration?: number;
  repeatDelay?: number;
}

export function ScrambleText({
  text,
  className,
  style,
  scrambleSpeed = 50,
  revealDelay = 500,
  revealDuration = 1000,
  repeatDelay = 0
}: ScrambleTextProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: false, margin: "-100px" });

  const [displayText, setDisplayText] = useState(
    Array(text.length).fill('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')
  );
  
  useEffect(() => {
    if (!isInView) return;

    let frameId: number;
    let scrambleInterval: NodeJS.Timeout;
    let timeoutId: NodeJS.Timeout;
    let repeatTimeoutId: NodeJS.Timeout;
    let isCancelled = false;

    const startAnimation = () => {
      let startTime: number;
      
      // Initial scrambling
      scrambleInterval = setInterval(() => {
        setDisplayText(prev => 
          prev.split('').map((char, i) => {
            if (text[i] === ' ') return ' ';
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          }).join('')
        );
      }, scrambleSpeed);

      // Stop scrambling and start revealing
      timeoutId = setTimeout(() => {
        clearInterval(scrambleInterval);
        
        const animate = (timestamp: number) => {
          if (isCancelled) return;
          if (!startTime) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / revealDuration, 1);
          
          const revealCount = Math.floor(progress * text.length);
          
          setDisplayText(() => {
            return text.split('').map((char, i) => {
              if (char === ' ') return ' ';
              if (i < revealCount) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            }).join('');
          });

          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          } else {
            setDisplayText(text);
            if (repeatDelay > 0 && !isCancelled) {
              repeatTimeoutId = setTimeout(startAnimation, repeatDelay);
            }
          }
        };
        
        frameId = requestAnimationFrame(animate);
      }, revealDelay);
    };

    startAnimation();

    return () => {
      isCancelled = true;
      clearInterval(scrambleInterval);
      clearTimeout(timeoutId);
      clearTimeout(repeatTimeoutId);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [text, scrambleSpeed, revealDelay, revealDuration, repeatDelay, isInView]);

  return (
    <motion.span ref={ref} className={className} style={style}>
      {displayText}
    </motion.span>
  );
}
