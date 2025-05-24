"use client";

import { useState, useEffect, useRef, useImperativeHandle, forwardRef } from 'react';

interface Player {
  id: number;
  x: number;
  y: number;
  team: 'home' | 'away';
  position: string;
  name: string;
  originalX: number;
  originalY: number;
  role: 'goalkeeper' | 'defender' | 'midfielder' | 'forward';
}

interface FootballSimulatorProps {
  onAnimationComplete?: () => void;
}

export interface FootballSimulatorRef {
  animateHomeGoal: () => Promise<void>;
  animateAwayGoal: () => Promise<void>;
  animateRandomEvent: () => Promise<void>;
  stopAnimation: () => void;
}

const FootballSimulator = forwardRef<FootballSimulatorRef, FootballSimulatorProps>(({ onAnimationComplete }, ref) => {
  const [isAnimating, setIsAnimating] = useState(false);
  const [ballPosition, setBallPosition] = useState({ x: 50, y: 50 });
  const [players, setPlayers] = useState<Player[]>([]);
  const animationRef = useRef<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  // Expose methods to parent component
  useImperativeHandle(ref, () => ({
    animateHomeGoal: () => animateGoal('home'),
    animateAwayGoal: () => animateGoal('away'),
    animateRandomEvent,
    stopAnimation: () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      setIsAnimating(false);
      setIsPlaying(false);
    }
  }));

  // Initialize players with proper formations
  useEffect(() => {
    initializePlayers();
  }, []);

  // Initialize audio
  useEffect(() => {
    audioRef.current = new Audio('/crowd.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.3;

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  const initializePlayers = () => {
    const homeTeam: Player[] = [
      { id: 1, x: 15, y: 50, team: 'home', position: 'GK', name: 'GK', originalX: 15, originalY: 50, role: 'goalkeeper' },
      { id: 2, x: 30, y: 25, team: 'home', position: 'DEF', name: 'RB', originalX: 30, originalY: 25, role: 'defender' },
      { id: 3, x: 30, y: 40, team: 'home', position: 'DEF', name: 'CB', originalX: 30, originalY: 40, role: 'defender' },
      { id: 4, x: 30, y: 60, team: 'home', position: 'DEF', name: 'CB', originalX: 30, originalY: 60, role: 'defender' },
      { id: 5, x: 30, y: 75, team: 'home', position: 'DEF', name: 'LB', originalX: 30, originalY: 75, role: 'defender' },
      { id: 6, x: 45, y: 35, team: 'home', position: 'MID', name: 'CM', originalX: 45, originalY: 35, role: 'midfielder' },
      { id: 7, x: 45, y: 65, team: 'home', position: 'MID', name: 'CM', originalX: 45, originalY: 65, role: 'midfielder' },
      { id: 8, x: 60, y: 30, team: 'home', position: 'FWD', name: 'RW', originalX: 60, originalY: 30, role: 'forward' },
      { id: 9, x: 60, y: 50, team: 'home', position: 'FWD', name: 'ST', originalX: 60, originalY: 50, role: 'forward' },
      { id: 10, x: 60, y: 70, team: 'home', position: 'FWD', name: 'LW', originalX: 60, originalY: 70, role: 'forward' },
      { id: 11, x: 55, y: 50, team: 'home', position: 'MID', name: 'CAM', originalX: 55, originalY: 50, role: 'midfielder' }
    ];

    const awayTeam: Player[] = [
      { id: 12, x: 85, y: 50, team: 'away', position: 'GK', name: 'GK', originalX: 85, originalY: 50, role: 'goalkeeper' },
      { id: 13, x: 70, y: 25, team: 'away', position: 'DEF', name: 'RB', originalX: 70, originalY: 25, role: 'defender' },
      { id: 14, x: 70, y: 40, team: 'away', position: 'DEF', name: 'CB', originalX: 70, originalY: 40, role: 'defender' },
      { id: 15, x: 70, y: 60, team: 'away', position: 'DEF', name: 'CB', originalX: 70, originalY: 60, role: 'defender' },
      { id: 16, x: 70, y: 75, team: 'away', position: 'DEF', name: 'LB', originalX: 70, originalY: 75, role: 'defender' },
      { id: 17, x: 55, y: 35, team: 'away', position: 'MID', name: 'CM', originalX: 55, originalY: 35, role: 'midfielder' },
      { id: 18, x: 55, y: 65, team: 'away', position: 'MID', name: 'CM', originalX: 55, originalY: 65, role: 'midfielder' },
      { id: 19, x: 40, y: 30, team: 'away', position: 'FWD', name: 'RW', originalX: 40, originalY: 30, role: 'forward' },
      { id: 20, x: 40, y: 50, team: 'away', position: 'FWD', name: 'ST', originalX: 40, originalY: 50, role: 'forward' },
      { id: 21, x: 40, y: 70, team: 'away', position: 'FWD', name: 'LW', originalX: 40, originalY: 70, role: 'forward' },
      { id: 22, x: 45, y: 50, team: 'away', position: 'MID', name: 'CAM', originalX: 45, originalY: 50, role: 'midfielder' }
    ];

    setPlayers([...homeTeam, ...awayTeam]);
  };

  const animateBallMovement = (
    fromX: number, 
    fromY: number, 
    toX: number, 
    toY: number, 
    duration: number = 1500
  ): Promise<void> => {
    return new Promise<void>((resolve) => {
      const startTime: number = Date.now();
      
      const animate = (): void => {
        const elapsed: number = Date.now() - startTime;
        const progress: number = Math.min(elapsed / duration, 1);
        
        // Smooth easing function
        const easeProgress: number = 1 - Math.pow(1 - progress, 3);
        
        const currentX: number = fromX + (toX - fromX) * easeProgress;
        const currentY: number = fromY + (toY - fromY) * easeProgress;
        
        setBallPosition({ x: currentX, y: currentY });
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  };

  const movePlayersRealistically = (ballX: number, ballY: number, phase: 'buildup' | 'attack', attackingTeam: 'home' | 'away') => {
    return new Promise<void>((resolve) => {
      let step = 0;
      const maxSteps = 45;
      
      const animate = () => {
        step++;
        setPlayers(prevPlayers => 
          prevPlayers.map(player => {
            let targetX = player.x;
            let targetY = player.y;
            
            // Goalkeeper behavior - minimal movement
            if (player.role === 'goalkeeper') {
              if (phase === 'attack' && player.team !== attackingTeam) {
                // Defending goalkeeper moves slightly closer to ball line
                targetY = Math.max(40, Math.min(60, ballY));
                targetX = player.team === 'home' ? Math.max(12, player.originalX - 2) : Math.min(88, player.originalX + 2);
              } else {
                targetX = player.originalX;
                targetY = player.originalY;
              }
            }
            // Attacking team movement - only key players move significantly
            else if (player.team === attackingTeam) {
              if (phase === 'buildup') {
                // Only midfielders and nearby players move towards ball
                const ballDistance = Math.sqrt(Math.pow(ballX - player.x, 2) + Math.pow(ballY - player.y, 2));
                if (ballDistance < 15) {
                  targetX = player.x + (ballX - player.x) * 0.3;
                  targetY = player.y + (ballY - player.y) * 0.3;
                }
              } else if (phase === 'attack') {
                // Only forwards and supporting midfielders make significant moves
                if (player.role === 'forward') {
                  targetX = attackingTeam === 'home' ? Math.min(75, player.x + 10) : Math.max(25, player.x - 10);
                  targetY = 40 + Math.random() * 20; // More controlled spread
                } else if (player.role === 'midfielder' && Math.random() < 0.5) {
                  // Only some midfielders support the attack
                  targetX = attackingTeam === 'home' ? Math.min(65, player.x + 8) : Math.max(35, player.x - 8);
                  targetY = player.y + (ballY - player.y) * 0.2;
                } else if (player.role === 'defender') {
                  // Defenders maintain shape with minimal movement
                  targetX = attackingTeam === 'home' ? Math.min(50, player.x + 5) : Math.max(50, player.x - 5);
                  targetY = player.y;
                }
              }
            }
            // Defending team movement - more structured
            else {
              if (phase === 'attack') {
                // Only nearby defenders and midfielders react
                const ballDistance = Math.sqrt(Math.pow(ballX - player.x, 2) + Math.pow(ballY - player.y, 2));
                if (ballDistance < 20) {
                  if (player.role === 'defender') {
                    targetX = player.team === 'home' ? Math.max(25, player.x - 5) : Math.min(75, player.x + 5);
                    targetY = player.y + (50 - player.y) * 0.2; // More controlled compression
                  } else if (player.role === 'midfielder' && Math.random() < 0.4) {
                    // Only some midfielders track back
                    targetX = player.team === 'home' ? Math.max(35, player.x - 8) : Math.min(65, player.x + 8);
                    targetY = player.y + (ballY - player.y) * 0.15;
                  }
                }
              } else {
                // Normal positioning with minimal adjustment
                const ballDistance = Math.sqrt(Math.pow(ballX - player.x, 2) + Math.pow(ballY - player.y, 2));
                if (ballDistance < 15) {
                  targetX = player.x + (ballX - player.x) * 0.1;
                  targetY = player.y + (ballY - player.y) * 0.1;
                }
              }
            }
            
            // Smoother movement with reduced speed
            const progress = step / maxSteps;
            const easing = 1 - Math.pow(1 - progress, 2);
            const moveSpeed = 0.1; // Reduced from 0.15
            
            return {
              ...player,
              x: player.x + (targetX - player.x) * easing * moveSpeed,
              y: player.y + (targetY - player.y) * easing * moveSpeed
            };
          })
        );
        
        if (step < maxSteps) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  };

  const resetPlayersToFormation = () => {
    return new Promise<void>((resolve) => {
      let step = 0;
      const maxSteps = 80;
      
      const animate = () => {
        step++;
        setPlayers(prevPlayers => 
          prevPlayers.map(player => {
            const progress = step / maxSteps;
            const easing = 1 - Math.pow(1 - progress, 2);
            
            return {
              ...player,
              x: player.x + (player.originalX - player.x) * easing * 0.08,
              y: player.y + (player.originalY - player.y) * easing * 0.08
            };
          })
        );
        
        if (step < maxSteps) {
          animationRef.current = requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      
      animate();
    });
  };

  const animateGoal = async (team: 'home' | 'away') => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    try {
      if (audioRef.current && !isPlaying) {
        audioRef.current.play();
        setIsPlaying(true);
      }
      
      // Phase 1: Build-up play (more realistic ball movement)
      const buildupX = team === 'home' ? 35 : 65;
      const buildupY = 30 + Math.random() * 40;
      
      await animateBallMovement(ballPosition.x, ballPosition.y, buildupX, buildupY, 1000);
      await movePlayersRealistically(buildupX, buildupY, 'buildup', team);
      
      await new Promise(resolve => setTimeout(resolve, 400));
      
      
      const attackX = team === 'home' ? 70 : 30;
      const attackY = 25 + Math.random() * 50;
      
      await animateBallMovement(buildupX, buildupY, attackX, attackY, 1200);
      await movePlayersRealistically(attackX, attackY, 'attack', team);
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const finalAttackX = team === 'home' ? 100 : 0;
      const finalAttackY = 40 + Math.random() * 20;
      
      await animateBallMovement(attackX, attackY, finalAttackX, finalAttackY, 800);
      
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const goalX = team === 'home' ? 88 : 12;
      const goalY = 45 + Math.random() * 10;
      
      await animateBallMovement(finalAttackX, finalAttackY, goalX, goalY, 500);
      
      
      
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      await animateBallMovement(goalX, goalY, 50, 50, 1200);
      await resetPlayersToFormation();
      
    } finally {
      setIsAnimating(false);
      onAnimationComplete?.();
    }
  };

  const animateRandomEvent = async () => {
    if (isAnimating) return;
    setIsAnimating(true);
    
    try {
      const events = [
        { type: 'counter' },
        { type: 'save' },
        { type: 'midfield' },
        { type: 'defense' },
        { type: 'longball' },
        { type: 'passing' },
        { type: 'switch' }
      ];
      
      const event = events[Math.floor(Math.random() * events.length)];
      
      // Create realistic movement patterns based on event type
      let sequence = [];
      
      if (event.type === 'counter') {
        // Fast counter-attack movement
        sequence = [
          { x: 25, y: 45 + Math.random() * 10 },
          { x: 50, y: 35 + Math.random() * 30 },
          { x: 75, y: 40 + Math.random() * 20 }
        ];
      } else if (event.type === 'save') {
        // Shot towards goal then save
        sequence = [
          { x: 70 + Math.random() * 10, y: 40 + Math.random() * 20 },
          { x: 85, y: 48 + Math.random() * 4 }
        ];
      } else if (event.type === 'longball') {
        // Long diagonal ball
        sequence = [
          { x: 25, y: 25 + Math.random() * 10 },
          { x: 70, y: 60 + Math.random() * 15 }
        ];
      } else if (event.type === 'switch') {
        // Ball switched from one side to another
        sequence = [
          { x: 40, y: 20 + Math.random() * 10 },
          { x: 45, y: 50 },
          { x: 55, y: 75 + Math.random() * 10 }
        ];
      } else {
        // General movement
        sequence = [
          { x: 30 + Math.random() * 40, y: 25 + Math.random() * 50 },
          { x: 35 + Math.random() * 30, y: 30 + Math.random() * 40 }
        ];
      }
      
      // Execute the movement sequence
      for (let i = 0; i < sequence.length; i++) {
        const pos = sequence[i];
        const duration = event.type === 'counter' ? 800 : 1200;
        
        await animateBallMovement(ballPosition.x, ballPosition.y, pos.x, pos.y, duration);
        
        // Move players based on the ball position and event type
        const team = Math.random() < 0.5 ? 'home' : 'away';
        const phase = event.type === 'counter' ? 'attack' : 'buildup';
        await movePlayersRealistically(pos.x, pos.y, phase, team);
        
        if (i < sequence.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 300));
        }
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Gradual return to formation
      await resetPlayersToFormation();
      
    } finally {
      setIsAnimating(false);
      onAnimationComplete?.();
    }
  };

  const toggleSound = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className="">
      <div className="flex justify-center mb-4">
        <button
          onClick={toggleSound}
          className={`px-4 py-2 rounded-sm font-semibold transition-colors ${
            isPlaying 
              ? 'bg-red-500/50 hover:bg-red-600/50 text-white' 
              : 'bg-green-500/50 hover:bg-green-600/50 text-white'
          }`}
        >
          {isPlaying ? 'Stop Sound' : 'Play Sound'}
        </button>
      </div>

      {/* Football Pitch */}
      <div className="relative bg-green-900 border-2 border-white border-opacity-30 rounded-xl mx-auto mb-6 shadow-2xl overflow-hidden" 
           style={{ width: '900px', height: '500px', backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.03) 20px, rgba(255,255,255,0.03) 40px)' }}>
        
        {/* Pitch markings */}
        <div className="absolute inset-0">
          {/* Center circle */}
          <div className="absolute border border-white border-opacity-30 rounded-full"
               style={{ 
                 left: '50%', 
                 top: '50%', 
                 width: '150px', 
                 height: '150px',
                 transform: 'translate(-50%, -50%)'
               }} />
          
          {/* Center line */}
          <div className="absolute bg-white bg-opacity-30" 
               style={{ left: '50%', top: '0', width: '2px', height: '100%' }} />
          
          {/* Center spot */}
          <div className="absolute bg-white rounded-full"
               style={{ left: '50%', top: '50%', width: '6px', height: '6px', transform: 'translate(-50%, -50%)' }} />
          
          {/* Goal areas */}
          <div className="absolute border border-white border-opacity-30"
               style={{ left: '0', top: '40%', width: '80px', height: '20%' }} />
          <div className="absolute border border-white border-opacity-30"
               style={{ right: '0', top: '40%', width: '80px', height: '20%' }} />
          
          {/* Penalty areas */}
          <div className="absolute border border-white border-opacity-30"
               style={{ left: '0', top: '25%', width: '150px', height: '50%' }} />
          <div className="absolute border border-white border-opacity-30"
               style={{ right: '0', top: '25%', width: '150px', height: '50%' }} />
          
          {/* Penalty spots */}
          <div className="absolute bg-white rounded-full bg-opacity-80"
               style={{ left: '120px', top: '50%', width: '6px', height: '6px', transform: 'translate(-50%, -50%)' }} />
          <div className="absolute bg-white rounded-full bg-opacity-80"
               style={{ right: '120px', top: '50%', width: '6px', height: '6px', transform: 'translate(-50%, -50%)' }} />
          
          {/* Goals */}
          <div className="absolute bg-gray-900 border border-white border-opacity-50 shadow-lg"
               style={{ left: '-8px', top: '44%', width: '8px', height: '12%' }} />
          <div className="absolute bg-gray-900 border border-white border-opacity-50 shadow-lg"
               style={{ right: '-8px', top: '44%', width: '8px', height: '12%' }} />
          
          {/* Subtle grass pattern overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-green-800 to-green-900 opacity-30 mix-blend-overlay"></div>
        </div>

        {/* Players */}
        {players.map(player => (
          <div
            key={player.id}
            className={`absolute w-7 h-7 rounded-full border-2 border-white border-opacity-70 transition-all duration-300 ease-out shadow-md ${
              player.team === 'home' ? 'bg-gradient-to-b from-blue-600 to-blue-800' : 'bg-gradient-to-b from-red-600 to-red-800'
            }`}
            style={{
              left: `${player.x}%`,
              top: `${player.y}%`,
              transform: 'translate(-50%, -50%)',
              zIndex: 10
            }}
          >
            <span className="text-xs text-white font-bold absolute inset-0 flex items-center justify-center drop-shadow">
              {player.id}
            </span>
          </div>
        ))}

        {/* Ball */}
        <div
          className="absolute w-5 h-5 bg-white rounded-full border border-gray-400 transition-all duration-200 ease-out shadow-lg"
          style={{
            left: `${ballPosition.x}%`,
            top: `${ballPosition.y}%`,
            transform: 'translate(-50%, -50%)',
            zIndex: 20,
            boxShadow: '0 2px 4px rgba(0,0,0,0.4)'
          }}
        />
      </div>
    </div>
  );
});

FootballSimulator.displayName = 'FootballSimulator';

export default FootballSimulator;