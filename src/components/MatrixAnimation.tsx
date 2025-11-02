import { useEffect, useRef } from 'react';
import './MatrixAnimation.css';

interface MatrixAnimationProps {
  onComplete: () => void;
  duration?: number;
}

const MatrixAnimation = ({ onComplete, duration = 10000 }: MatrixAnimationProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Play dramatic music at the start
    const playDramaticMusic = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        // Create a dramatic, suspenseful musical sequence
        // Low bass notes building tension
        const bassNotes = [
          { freq: 65.41, time: 0 },    // C2
          { freq: 73.42, time: 1 },    // D2
          { freq: 82.41, time: 2 },    // E2
          { freq: 87.31, time: 3 },   // F2
          { freq: 98.00, time: 4 },   // G2
        ];

        bassNotes.forEach(({ freq, time }) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'sawtooth'; // Dramatic sawtooth wave
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
          gainNode.gain.linearRampToValueAtTime(0.15, audioContext.currentTime + time + 0.1);
          gainNode.gain.exponentialRampToValueAtTime(0.05, audioContext.currentTime + time + 0.8);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 1.2);
          
          oscillator.start(audioContext.currentTime + time);
          oscillator.stop(audioContext.currentTime + time + 1.2);
        });

        // Add tension with higher frequencies
        const tensionNotes = [
          { freq: 220, time: 1.5 },    // A3
          { freq: 247, time: 2.5 },    // B3
          { freq: 262, time: 3.5 },    // C4
        ];

        tensionNotes.forEach(({ freq, time }) => {
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = freq;
          oscillator.type = 'square';
          
          gainNode.gain.setValueAtTime(0, audioContext.currentTime + time);
          gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + time + 0.05);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + time + 0.4);
          
          oscillator.start(audioContext.currentTime + time);
          oscillator.stop(audioContext.currentTime + time + 0.4);
        });

        // Continuous background drone for atmosphere
        const droneOsc = audioContext.createOscillator();
        const droneGain = audioContext.createGain();
        droneOsc.connect(droneGain);
        droneGain.connect(audioContext.destination);
        
        droneOsc.frequency.value = 55; // Low A
        droneOsc.type = 'triangle';
        
        droneGain.gain.setValueAtTime(0, audioContext.currentTime);
        droneGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 0.5);
        droneGain.gain.linearRampToValueAtTime(0.08, audioContext.currentTime + 3.5);
        droneGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 4);
        
        droneOsc.start(audioContext.currentTime);
        droneOsc.stop(audioContext.currentTime + 4);
      } catch (err) {
        console.log('Music play failed:', err);
      }
    };

    // Set canvas size to window size
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // The target word to form
    const targetWord = 'COUSINENTREFFEN';
    
    // Matrix characters - using katakana, latin letters, and numbers
    const characters = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%^&*()';
    const charArray = characters.split('');

    const fontSize = 20;
    const columns = Math.floor(canvas.width / fontSize);

    // Calculate center position for the word
    const targetY = Math.floor(canvas.height / 2);
    
    // Calculate positions for each letter of the target word
    const letterWidth = fontSize * 0.6; // Actual width of a monospace character
    const wordPixelWidth = targetWord.length * letterWidth;
    const wordStartX = (canvas.width - wordPixelWidth) / 2;
    
    // Map each letter to its x position and column
    interface LetterInfo {
      char: string;
      x: number;
      column: number;
      locked: boolean;
      currentY: number;
      targetX: number;
      startTime: number;
      hasStarted: boolean;
    }
    
    const letters: LetterInfo[] = [];
    for (let i = 0; i < targetWord.length; i++) {
      const x = wordStartX + (i * letterWidth);
      letters.push({
        char: targetWord[i],
        x: Math.random() * canvas.width, // Start at random X position
        column: Math.floor(x / fontSize),
        locked: false,
        currentY: -50 - (Math.random() * 100), // Start above screen
        targetX: x, // Target X position for word formation
        startTime: 5000 + (i * 200), // Start falling after 5 seconds, staggered
        hasStarted: false
      });
    }

    // Background rain drops - slow falling at the beginning
    const drops: number[] = [];
    const dropSpeeds: number[] = [];
    for (let i = 0; i < columns; i++) {
      drops[i] = Math.random() * -canvas.height;
      dropSpeeds[i] = 0.3 + Math.random() * 0.5; // Slow speed (0.3-0.8 pixels per frame)
    }

    // Play dramatic music when animation starts
    playDramaticMusic();

    const startTime = Date.now();
    let animationComplete = false;
    let bangPlayed = false;

    const draw = () => {
      const elapsed = Date.now() - startTime;
      
      // Black background with transparency for trailing effect
      ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw slow background rain (especially in first 5 seconds)
      const rainAlpha = elapsed < 5000 ? 0.6 : Math.max(0, 0.6 - (elapsed - 5000) / duration * 0.5);
      if (rainAlpha > 0.05) {
        ctx.fillStyle = `rgba(0, 255, 0, ${rainAlpha})`;
        ctx.font = `${fontSize}px monospace`;
        
        for (let i = 0; i < drops.length; i++) {
          // Skip columns that are part of our word after they start
          let skipColumn = false;
          for (const letter of letters) {
            if (letter.hasStarted && Math.abs(i - letter.column) < 2) {
              skipColumn = true;
              break;
            }
          }
          
          if (!skipColumn) {
            const char = charArray[Math.floor(Math.random() * charArray.length)];
            const x = i * fontSize;
            const y = drops[i];
            ctx.fillText(char, x, y);
            
            // Slow falling speed, especially in first 5 seconds
            const speed = elapsed < 5000 ? dropSpeeds[i] : dropSpeeds[i] * 2;
            drops[i] += speed;
            if (drops[i] > canvas.height && Math.random() > 0.975) {
              drops[i] = 0;
            }
          }
        }
      }

      // Draw the forming word letters
      for (let i = 0; i < letters.length; i++) {
        const letter = letters[i];
        
        // Check if it's time for this letter to start falling
        if (!letter.hasStarted && elapsed >= letter.startTime) {
          letter.hasStarted = true;
        }
        
        // Only process and draw if the letter has started
        if (!letter.hasStarted) {
          continue;
        }

        // Calculate distances to target
        const distToTargetY = Math.abs(letter.currentY - targetY);
        const distToTargetX = Math.abs(letter.x - letter.targetX);
        const isAtTarget = distToTargetY < 5 && distToTargetX < 2;

        // Check if it's time to lock this letter
        if (!letter.locked && isAtTarget) {
          letter.locked = true;
          letter.currentY = targetY;
          letter.x = letter.targetX;
        }

        if (letter.locked) {
          // Draw locked letter (bold and bright)
          ctx.fillStyle = '#00ff00';
          ctx.font = `bold ${fontSize}px monospace`;
          ctx.fillText(letter.char, letter.x, letter.currentY);
        } else {
          // Draw falling/moving letter
          // Show correct character more often as it gets closer to target
          let charToShow: string;
          
          if (distToTargetY < 100 && distToTargetX < 50) {
            // Close to target - show correct char most of the time
            charToShow = Math.random() > 0.2 ? letter.char : charArray[Math.floor(Math.random() * charArray.length)];
          } else if (distToTargetY < 200) {
            // Medium distance - show correct char sometimes
            charToShow = Math.random() > 0.6 ? letter.char : charArray[Math.floor(Math.random() * charArray.length)];
          } else {
            // Far from target - mostly random
            charToShow = Math.random() > 0.85 ? letter.char : charArray[Math.floor(Math.random() * charArray.length)];
          }
          
          ctx.fillStyle = '#00ff00';
          ctx.font = `${fontSize}px monospace`;
          ctx.fillText(charToShow, letter.x, letter.currentY);
          
          // Move the letter down
          let verticalSpeed = 2; // Default falling speed
          if (distToTargetY < 50) {
            verticalSpeed = 0.8; // Very slow near target
          } else if (distToTargetY < 150) {
            verticalSpeed = 1.5; // Slow down approaching
          }
          letter.currentY += verticalSpeed;
          
          // Move horizontally towards target X position
          if (distToTargetX > 2) {
            const horizontalSpeed = Math.max(0.5, distToTargetX * 0.05); // Speed up when far, slow down when close
            if (letter.x < letter.targetX) {
              letter.x += horizontalSpeed;
            } else if (letter.x > letter.targetX) {
              letter.x -= horizontalSpeed;
            }
          }
        }
      }

      // Check if all letters are locked
      if (!animationComplete && letters.every(l => l.locked)) {
        animationComplete = true;
        
        // Play loud bang when "Cousinentreffen" is fully formed
        if (!bangPlayed) {
          bangPlayed = true;
          try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Create a powerful bang with low frequencies and white noise
            // Low frequency impact (bass boom)
            const boomOsc = audioContext.createOscillator();
            const boomGain = audioContext.createGain();
            boomOsc.connect(boomGain);
            boomGain.connect(audioContext.destination);
            
            boomOsc.frequency.setValueAtTime(40, audioContext.currentTime);
            boomOsc.frequency.exponentialRampToValueAtTime(20, audioContext.currentTime + 0.3);
            boomOsc.type = 'sawtooth';
            
            boomGain.gain.setValueAtTime(0, audioContext.currentTime);
            boomGain.gain.linearRampToValueAtTime(0.8, audioContext.currentTime + 0.01); // Very loud!
            boomGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            boomOsc.start(audioContext.currentTime);
            boomOsc.stop(audioContext.currentTime + 0.5);
            
            // White noise explosion
            const bufferSize = audioContext.sampleRate * 0.3;
            const noiseBuffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
              output[i] = Math.random() * 2 - 1;
            }
            
            const whiteNoise = audioContext.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            const noiseGain = audioContext.createGain();
            whiteNoise.connect(noiseGain);
            noiseGain.connect(audioContext.destination);
            
            noiseGain.gain.setValueAtTime(0, audioContext.currentTime);
            noiseGain.gain.linearRampToValueAtTime(0.6, audioContext.currentTime + 0.01); // Very loud!
            noiseGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
            
            whiteNoise.start(audioContext.currentTime);
            whiteNoise.stop(audioContext.currentTime + 0.2);
            
            // Additional mid-frequency impact
            const impactOsc = audioContext.createOscillator();
            const impactGain = audioContext.createGain();
            impactOsc.connect(impactGain);
            impactGain.connect(audioContext.destination);
            
            impactOsc.frequency.setValueAtTime(200, audioContext.currentTime);
            impactOsc.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.15);
            impactOsc.type = 'square';
            
            impactGain.gain.setValueAtTime(0, audioContext.currentTime);
            impactGain.gain.linearRampToValueAtTime(0.5, audioContext.currentTime + 0.005);
            impactGain.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
            
            impactOsc.start(audioContext.currentTime);
            impactOsc.stop(audioContext.currentTime + 0.15);
          } catch (err) {
            console.log('Bang sound failed:', err);
          }
        }
        
        // Give a moment to appreciate the final word
        setTimeout(() => {
          onComplete();
        }, 800);
      }
    };

    // Animation loop
    const interval = setInterval(draw, 33); // ~30fps

    // Failsafe: trigger completion after duration even if something goes wrong
    const timeout = setTimeout(() => {
      if (!animationComplete) {
        onComplete();
      }
    }, duration + 500);

    // Handle window resize
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
      window.removeEventListener('resize', handleResize);
    };
  }, [onComplete, duration]);

  return (
    <div className="matrix-container">
      <canvas ref={canvasRef} className="matrix-canvas" />
    </div>
  );
};

export default MatrixAnimation;
