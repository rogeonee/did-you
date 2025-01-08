'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import ModeToggle from '@/components/mode-toggle';

export default function EvasiveButton() {
  const [showYes, setShowYes] = useState(false);
  const [showNo, setShowNo] = useState(false);
  const [noButtonPosition, setNoButtonPosition] = useState({ x: 0, y: 0 });
  const [rotation, setRotation] = useState(0);
  const noButtonRef = useRef<HTMLButtonElement>(null);
  const yesButtonRef = useRef<HTMLButtonElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleYesClick = () => {
    setShowYes(true);
    setShowNo(false);
  };

  const handleNoClick = () => {
    setShowNo(true);
    setShowYes(false);
  };

  const moveToRandomPosition = useCallback(
    (
      containerWidth: number,
      containerHeight: number,
      buttonWidth: number,
      buttonHeight: number,
    ) => {
      const PADDING = 10; // Padding for all edges
      const newX =
        PADDING +
        Math.random() * (containerWidth - buttonWidth - 2 * PADDING - 30);
      const newY =
        PADDING +
        Math.random() * (containerHeight - buttonHeight - 2 * PADDING);
      return { x: newX, y: newY };
    },
    [],
  );

  const moveButton = useCallback(
    (e: MouseEvent | TouchEvent) => {
      const PADDING = 10;

      if (noButtonRef.current && containerRef.current) {
        const buttonRect = noButtonRef.current.getBoundingClientRect();
        const containerRect = containerRef.current.getBoundingClientRect();

        let mouseX, mouseY;
        if (e instanceof MouseEvent) {
          mouseX = e.clientX - containerRect.left;
          mouseY = e.clientY - containerRect.top;
        } else {
          mouseX = e.touches[0].clientX - containerRect.left;
          mouseY = e.touches[0].clientY - containerRect.top;
        }

        const buttonCenterX = noButtonPosition.x + buttonRect.width / 2;
        const buttonCenterY = noButtonPosition.y + buttonRect.height / 2;

        const distanceX = mouseX - buttonCenterX;
        const distanceY = mouseY - buttonCenterY;

        if (Math.abs(distanceX) < 50 && Math.abs(distanceY) < 50) {
          const randomPosition = moveToRandomPosition(
            containerRect.width,
            containerRect.height,
            buttonRect.width,
            buttonRect.height,
          );
          setNoButtonPosition(randomPosition);
        } else if (Math.abs(distanceX) < 100 && Math.abs(distanceY) < 100) {
          let newX = noButtonPosition.x - distanceX / 1.5;
          let newY = noButtonPosition.y - distanceY / 1.5;

          // Ensure the button stays within the container
          newX = Math.max(
            PADDING,
            Math.min(
              newX,
              containerRect.width - buttonRect.width - PADDING - 30,
            ),
          );
          newY = Math.max(
            PADDING,
            Math.min(newY, containerRect.height - buttonRect.height - PADDING),
          );

          setNoButtonPosition({ x: newX, y: newY });
        }
      }
    },
    [noButtonPosition, moveToRandomPosition],
  );

  useEffect(() => {
    setRotation(Math.random() * 10 - 5);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (container) {
      container.addEventListener('mousemove', moveButton);
      container.addEventListener('touchstart', moveButton);
      container.addEventListener('touchmove', moveButton);
      return () => {
        container.removeEventListener('mousemove', moveButton);
        container.removeEventListener('touchstart', moveButton);
        container.removeEventListener('touchmove', moveButton);
      };
    }
  }, [moveButton]);

  // initial position
  useEffect(() => {
    if (containerRef.current && yesButtonRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const yesButtonRect = yesButtonRef.current.getBoundingClientRect();

      // Calculate initial position relative to the "Yes" button
      const initialX =
        yesButtonRect.left - containerRect.left + yesButtonRect.width + 4; // Add spacing
      const initialY = yesButtonRect.top - containerRect.top;

      setNoButtonPosition({ x: initialX, y: initialY });
    }
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-[#100C08] overflow-hidden p-4"
    >
      <div className="absolute top-4 right-4">
        <ModeToggle />
      </div>

      <h1 className="text-4xl font-bold mb-8 text-gray-900 dark:text-gray-100">
        Сосал?
      </h1>
      <div className="space-x-4 ml-[-80px]">
        <button
          ref={yesButtonRef}
          onClick={handleYesClick}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
        >
          Да
        </button>
        <button
          ref={noButtonRef}
          style={{
            position: 'absolute',
            left: `${noButtonPosition.x}px`,
            top: `${noButtonPosition.y}px`,
            transition: 'transform 0.3s ease, left 0.2s ease, top 0.2s ease',
            transform: `rotate(${rotation}deg) scale(1.1)`,
          }}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          onClick={handleNoClick}
        >
          Нет
        </button>
      </div>
      <div className="mt-4 h-20 flex flex-col items-center justify-center">
        {showYes && (
          <p className="text-xl text-gray-700 dark:text-gray-300">А я знал</p>
        )}
        {showNo && (
          <p className="text-xl text-gray-700 dark:text-gray-300">Обоюнда...</p>
        )}
      </div>
    </div>
  );
}
